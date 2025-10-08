using System.Net;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;

namespace ServerTests
{
    public class BackendTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public BackendTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task TestEndpoint_ShouldReturnSuccess()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/test");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("API is working!");
        }

        [Fact]
        public async Task MiniLeagueEndpoint_ShouldReturnJson()
        {
            var client = _factory.CreateClient();

            // Example mini-league ID
            var leagueId = "275033";
            var response = await client.GetAsync($"/api/mini-league/{leagueId}");

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            // Check that it returns something JSON-like
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("league");
        }
    }
}
