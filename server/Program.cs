using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

public partial class Program;

var builder = WebApplication.CreateBuilder(args);

// Add HttpClient for API calls
builder.Services.AddHttpClient();

var app = builder.Build();

// ----------------------
// Test Endpoint
// ----------------------
app.MapGet("/api/test", () => new { message = "API is working!" });

// ----------------------
// Mini-League Endpoint - getting the list of data from the minileague
// This is needed in order for the number line (for the current week).
// ----------------------

// http://localhost:5176/api/league-data/275033

app.MapGet("/api/league-data/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
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


// User Endppoint - getting information regarding the user.
// This is needed in order for ___

//http://localhost:5176/api/user-data/81991
app.MapGet("/api/user-data/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/entry/{id}/";

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

//History endpoint
//http://localhost:5176/api/user-history/81991
app.MapGet("/api/user-history/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    var url = $"https://fantasy.premierleague.com/api/entry/{id}/history/";

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


app.Run();



