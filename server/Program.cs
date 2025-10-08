var builder = WebApplication.CreateBuilder(args);

// Add services (e.g., controllers, HttpClient for API calls)
builder.Services.AddHttpClient();

var app = builder.Build();

// Optional: if using HTTPS redirection
app.UseHttpsRedirection();

// Example test endpoint
app.MapGet("/api/test", () => new { message = "API is working!" });

app.Run();