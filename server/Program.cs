using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

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
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

var app = builder.Build();

// 2️⃣ Use middleware AFTER building
app.UseCors("AllowLocalhost");

// ----------------------
// Endpoints
// ----------------------

// Test endpoint
app.MapGet("/api/test", () => new { message = "API is working!" });

// League endpoint
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

// User endpoints
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

// Chat endpoint
app.MapPost("/api/chat", ([FromBody] ChatRequest req) =>
{
    if (req == null) return Results.BadRequest(new { error = "Request body missing" });

    Console.WriteLine($"Received message: {req.Message}");
    return Results.Ok(new { result = "How can I help you?" });
});

app.Run();

// DTO
public class ChatRequest
{
    public string Message { get; set; } = "";
}
