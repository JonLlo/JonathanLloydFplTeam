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
//CHATBOT
app.MapPost("/api/upload-league-data/{id}", async (string id, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();

    try
    {
        // Fetch raw JSON from FPL API
        var json = await client.GetStringAsync($"https://fantasy.premierleague.com/api/entry/{id}/");

        // Send full JSON to Chatbase
        var chatbasePayload = new
        {
            messages = new[] {
                new {
                    role = "user",
                    content = $"Here is the full Fantasy Premier League data for entry ID {id}:\n\n{json}"
                }
            },
            chatbotId = "Y_wFcvfUyVd9F9F4-vRdw"
        };

        var chatbaseRequest = new HttpRequestMessage(HttpMethod.Post, "https://www.chatbase.co/api/v1/chat")
        {
            Content = JsonContent.Create(chatbasePayload)
        };
        chatbaseRequest.Headers.Add("Authorization", "Bearer e573ec81-c622-43f6-b9e2-9edcb20d298b");

        var chatbaseResponse = await client.SendAsync(chatbaseRequest);
        var chatbaseResult = await chatbaseResponse.Content.ReadAsStringAsync();

        return Results.Content(chatbaseResult, "application/json");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"🔥 Upload error: {ex.Message}");
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.Run();
