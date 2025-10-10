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
// Endpoints
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

// 4️⃣ Run the app
app.Run();
