using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using OpenAI;
using OpenAI.Chat;
using System.Text.Json;


[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("ServerTests")]

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Services
// --------------------

builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
        policy.WithOrigins(
            "http://localhost:3000",   // React
            "http://localhost:5176"    // Backend origin
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

// Register ChatClient for OpenAI v2.2.0
builder.Services.AddSingleton<ChatClient>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var apiKey = config["OpenAI:ApiKey"];
    return new ChatClient(
        model: "gpt-4o-mini",
        apiKey: apiKey
    );
});


var app = builder.Build();

app.UseCors("AllowLocalhost");

// ----------------------
// Test Endpoint
// ----------------------
app.MapGet("/api/test", () => new { message = "API is working!" });

// ----------------------
// FPL API Endpoints
// ----------------------
app.MapGet("/api/league-data/{id}", async (string id, IHttpClientFactory httpFactory) =>
{
    var client = httpFactory.CreateClient();
    string leagueJson;

    try
    {
        // Fetch the league JSON using the id from the URL
        leagueJson = await client.GetStringAsync(
            $"https://fantasy.premierleague.com/api/leagues-classic/{id}/standings/");

        // Log length for debugging
        Console.WriteLine($"Fetched FPL data for league {id}, length: {leagueJson.Length}");

        // Return JSON content
        return Results.Content(leagueJson, "application/json");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"FPL fetch failed for league {id}: {ex.Message}");
        return Results.Problem($"Failed to fetch league data: {ex.Message}", statusCode: 500);
    }
});

app.MapGet("/api/user-data/{id}", async (string id, IHttpClientFactory httpFactory) =>
{
    var client = httpFactory.CreateClient();
    try
    {
        var json = await client.GetStringAsync(
            $"https://fantasy.premierleague.com/api/entry/{id}/");
        return Results.Content(json, "application/json");
    }
    catch (HttpRequestException e)
    {
        return Results.Problem(detail: e.Message, statusCode: 500);
    }
});

app.MapGet("/api/user-history/{id}", async (string id, IHttpClientFactory httpFactory) =>
{
    var client = httpFactory.CreateClient();
    try
    {
        var json = await client.GetStringAsync(
            $"https://fantasy.premierleague.com/api/entry/{id}/history/");
        return Results.Content(json, "application/json");
    }
    catch (HttpRequestException e)
    {
        return Results.Problem(detail: e.Message, statusCode: 500);
    }
});

// ----------------------
// CHAT Endpoint

app.MapPost("/api/chat", async (
    [FromBody] ChatRequest req,
    ChatClient chatClient,
    IHttpClientFactory httpFactory
) =>
{
    if (req == null || string.IsNullOrWhiteSpace(req.Message))
        return Results.BadRequest(new { error = "Request body missing" });

    // 1️⃣ Fetch the league JSON
    var client = httpFactory.CreateClient();
    string leagueJson;
    try
    {
        leagueJson = await client.GetStringAsync(
            "https://fantasy.premierleague.com/api/leagues-classic/275033/standings/");
        Console.WriteLine("Fetched FPL data length: " + leagueJson.Length);
    }
    catch (Exception ex)
    {
        Console.WriteLine("FPL fetch failed: " + ex.Message);
        return Results.Problem("Failed to fetch league data", statusCode: 500);
    }

    // 2️⃣ Build GPT messages with improved system prompt
    var messages = new List<ChatMessage>
    {
    ChatMessage.CreateSystemMessage(
    "You are a Fantasy Premier League assistant. You will receive a JSON object with this structure:\n" +
    "{\n" +
    "  \"league\": { \"id\": number, \"name\": string, ... },\n" +
    "  \"standings\": {\n" +
    "      \"results\": [\n" +
    "          {\n" +
    "              \"id\": number,\n" +
    "              \"entry_name\": string,\n" +
    "              \"player_name\": string,\n" +
    "              \"rank\": number,\n" +
    "              \"total\": number,\n" +
    "              \"event_total\": number\n" +
    "          }, ...\n" +
    "      ]\n" +
    "  }\n" +
    "}\n" +
    "Answer questions using values from the JSON when possible. If something is missing or unclear, you may give a reasonable estimate and clearly note it is an estimate. Use standings.results for players, ranks, total points, and gameweek points, and league.name for the league name. Answer in a friendly Jamaican accent.\n" +
    "Examples:\n" +
    "- 'Who is leading the league?'\n" +
    "- 'What is the league name?'\n" +
    "- 'Give me one player_name'\n" +
    "- 'How many points does Team X have?'\n" +
    "- 'Who scored the most this gameweek?'"
)
,
        ChatMessage.CreateUserMessage(leagueJson),
        ChatMessage.CreateUserMessage(req.Message)
    };

    // 3️⃣ Send request to OpenAI
    ChatCompletion chatCompletion;
    try
    {
        chatCompletion = await chatClient.CompleteChatAsync(messages);
    }
    catch (Exception ex)
    {
        Console.WriteLine("OpenAI request failed: " + ex.Message);
        return Results.Problem("OpenAI request failed: " + ex.Message, statusCode: 500);
    }

    // 4️⃣ Extract GPT reply
    var reply = chatCompletion.Content?.FirstOrDefault()?.Text ?? 
                "I couldn't find an answer, but the JSON contains some information you can check.";

    Console.WriteLine("GPT reply: " + reply);

    return Results.Ok(new { result = reply });
});



app.MapGet("/api/gpt-test", async (ChatClient chatClient) =>
{
    var messages = new List<ChatMessage>
    {
        ChatMessage.CreateSystemMessage("You are a helpful assistant."),
        ChatMessage.CreateUserMessage("Say 'Hello world!'")
    };

    var result = await chatClient.CompleteChatAsync(messages);
    var reply = result.Value?.Content?.FirstOrDefault()?.Text ?? "No response";

    return Results.Ok(new { gptReply = reply });
});
app.Run();

// DTO
public class ChatRequest
{
    public string Message { get; set; } = "";
}
public class League
{
    public string Name { get; set; } = "";
}

public class LeagueResult
{
    public string Entry_Name { get; set; } = "";
    public string Player_Name { get; set; } = "";
    public int Total { get; set; }
    public int Event_Total { get; set; }
}

public class Standings
{
    public List<LeagueResult> Results { get; set; } = new();
}

public class LeagueData
{
    public League League { get; set; } = new();
    public Standings Standings { get; set; } = new();
}
