using System.Text.Json;
using System.Text;



[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("ServerTests")]

var builder = WebApplication.CreateBuilder(args);



// 1️⃣ Register services BEFORE building the app
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// 2️⃣ Build the app
var app = builder.Build();


// 3️⃣ Use middleware AFTER building
app.UseCors("AllowLocalhost");

// ----------------------
// Endpointsm
// ----------------------

//LEAGUE ENDPOINT


//275033
//https://fantasy.premierleague.com/api/leagues-classic/275033/standings/
app.MapGet("/api/test", () => new { message = "API is working!" });

app.MapGet("/api/league-data/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/leagues-classic/{id}/standings/";

    try
    {
        var response = await client.GetStringAsync(url);
        return Results.Content(response, "application/json");
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});


//USER ENDPOINT
//https://fantasy.premierleague.com/api/entry/33218/
app.MapGet("/api/user-data/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/entry/{id}/";

    try
    {
        var response = await client.GetStringAsync(url);
        return Results.Content(response, "application/json");
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.MapGet("/api/user-history/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/entry/{id}/history/";

    try
    {
        var response = await client.GetStringAsync(url);
        return Results.Content(response, "application/json");
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.MapPost("/api/chat", async (ChatRequest req, IHttpClientFactory http) =>
{

    
    var client = http.CreateClient();

    // Read API key
    var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
    if (string.IsNullOrEmpty(apiKey))
        return Results.Problem("API key missing.");

    // 1️⃣ Fetch league standings JSON
    var leagueUrl = $"https://fantasy.premierleague.com/api/leagues-classic/{req.LeagueId}/standings/";
    var leagueJson = await client.GetStringAsync(leagueUrl);

    // 2️⃣ Build messages
    var messages = new[]
    {
        new {
            role = "system",
            content = @"
You are an expert Fantasy Premier League assistant.

You can:
- Read league JSON
- Understand which players are in the league
- Find someone like 'Jack' by name
- Request their entryId via function calling
- Then fetch their entry, history, and transfers
- Make predictions like: 'Jack usually transfers defenders, so...'
"
        },
        new {
            role = "user",
            content = $"League standings: {leagueJson}\n\nUser asks: {req.Message}"
        }
    };

    // 3️⃣ Define tool/function
    var payload = new
    {
        model = "gpt-4o-mini",
        messages,
        functions = new[]
        {
            new {
                name = "get_player_data",
                description = "Fetch player's entry, transfers, and history",
                parameters = new {
                    type = "object",
                    properties = new {
                        entryId = new { type = "integer" }
                    },
                    required = new[] { "entryId" }
                }
            }
        },
        function_call = "auto"
    };

    // 4️⃣ Send to OpenAI
    var httpReq = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
    httpReq.Headers.Add("Authorization", $"Bearer {apiKey}");
    httpReq.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

    var resp = await client.SendAsync(httpReq);
    var json = await resp.Content.ReadAsStringAsync();

    using var doc = JsonDocument.Parse(json);
    var choice = doc.RootElement.GetProperty("choices")[0];
    var msg = choice.GetProperty("message");

    // 5️⃣ If LLM wants to call function
    if (msg.TryGetProperty("function_call", out var func))
    {
        var argsString = func.GetProperty("arguments").GetString();
        var args = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, int>>(argsString);

        int entryId = args["entryId"];

        // Fetch FPL data
        var entry = await client.GetStringAsync($"https://fantasy.premierleague.com/api/entry/{entryId}/");
        var transfers = await client.GetStringAsync($"https://fantasy.premierleague.com/api/entry/{entryId}/transfers/");
        var history = await client.GetStringAsync($"https://fantasy.premierleague.com/api/entry/{entryId}/history/");

        var toolMessage = new {
            role = "tool",
            name = "get_player_data",
            content = System.Text.Json.JsonSerializer.Serialize(
                new { entry, transfers, history }
            )
        };

        // Follow-up request
        var followPayload = new
        {
            model = "gpt-4o-mini",
            messages = new object[] { messages[0], messages[1], msg, toolMessage }
        };

        var followReq = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        followReq.Headers.Add("Authorization", $"Bearer {apiKey}");
        followReq.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(followPayload), Encoding.UTF8, "application/json");

        var followResp = await client.SendAsync(followReq);
        var followJson = await followResp.Content.ReadAsStringAsync();
        using var followDoc = JsonDocument.Parse(followJson);

        var finalMessage =
            followDoc.RootElement.GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return Results.Ok(new { result = finalMessage });
    }

    // 6️⃣ No function call — respond directly
    var direct = msg.GetProperty("content").GetString();
    return Results.Ok(new { result = direct }); });


// 4️⃣ Run the app

app.Run();
