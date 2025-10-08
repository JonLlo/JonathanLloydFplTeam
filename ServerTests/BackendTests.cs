using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class BackendTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public BackendTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    // First test - testing the test API endpoint gives a valid response
    public async Task TestApiTestEndpoint()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/test");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    // Second test - testing the league-data endpoint
    public async Task TestLeagueDataEndpoint()
    {
        var client = _factory.CreateClient();
        var leagueId = "275033"; // Replace with a valid FPL league ID
        var response = await client.GetAsync($"/api/league-data/{leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("standings", content); // Basic check
    }

    [Fact]
    // Third test - testing the user-data endpoint
    public async Task TestUserDataEndpoint()
    {
        var client = _factory.CreateClient();
        var userId = "81991"; // Replace with a valid FPL user ID
        var response = await client.GetAsync($"/api/user-data/{userId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("id", content); // Checks that the JSON has "id"
    }

    [Fact]
    // Fourth test - testing the user-history endpoint
    public async Task TestUserHistoryEndpoint()
    {
        var client = _factory.CreateClient();
        var userId = "81991"; // Replace with a valid FPL user ID
        var response = await client.GetAsync($"/api/user-history/{userId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("past", content); // Checks that the JSON contains "history"
    }
}
