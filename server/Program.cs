using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add HttpClient for API calls
builder.Services.AddHttpClient();

var app = builder.Build();

// ----------------------
// Test Endpoint
// ----------------------
app.MapGet("/api/test", () => new { message = "API is working!" });

// ----------------------
// Mini-League Endpoint
// ----------------------

// http://localhost:5176/api/mini-league/275033

app.MapGet("/api/mini-league/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/leagues-classic/{id}/standings/";

    try
    {
        // Fetch the data from FPL
        var response = await client.GetStringAsync(url);

        // Return it directly as JSON
        return Results.Content(response, "application/json");
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});


// ----------------------
// Player Endpoint
// ----------------------
app.MapGet("/api/player/{id}", async (int id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var response = await client.GetStringAsync($"https://fantasy.premierleague.com/api/element-summary/{id}/");

    return Results.Ok(new { playerId = id, data = response });
});

// ----------------------
// AI Chatbot Endpoint (POST)
// ----------------------
app.MapPost("/api/chatbot", async ([FromBody] ChatRequest request) =>
{
    // TODO: Integrate OpenAI or custom ML model
    // For now, just echo the message
    return Results.Ok(new { message = $"You said: {request.Message}" });
});

app.Run();

// ----------------------
// ChatRequest Model
// ----------------------
record ChatRequest(string Message);
