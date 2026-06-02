using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using UEM.Tests.Integration.Setup;

using EventDto = global::UniversityEventManagement.Application.DTOs.EventDto;

namespace UEM.Tests.Integration.Controllers;

public class EventsControllerIntegrationTests
{
    private static EventDto CreateValidEventDto(string title = "Integration Test Event")
    {
        return new EventDto
        {
            Title = title,
            Category = "Workshop",
            Description = "This event was created during an integration test.",
            StartDate = DateTime.UtcNow.AddDays(10),
            EndDate = DateTime.UtcNow.AddDays(10).AddHours(2),
            Capacity = 80,
            Status = "Upcoming",
            VenueId = 1
        };
    }

    [Fact]
    public async Task GetAllEvents_WithAdminRole_ReturnsOk()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        var response = await client.GetAsync("/api/events");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var events = await response.Content.ReadFromJsonAsync<List<EventDto>>();

        events.Should().NotBeNull();
    }

    [Fact]
    public async Task GetAllEvents_AfterCreatingEvent_ReturnsCreatedEvent()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Organizer");

        var createRequest = CreateValidEventDto("Event Visible In List");

        var createResponse = await client.PostAsJsonAsync("/api/events", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var response = await client.GetAsync("/api/events");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var events = await response.Content.ReadFromJsonAsync<List<EventDto>>();

        events.Should().NotBeNull();
        events!.Should().Contain(e => e.Title == "Event Visible In List");
    }

    [Fact]
    public async Task GetEventById_WhenEventExists_ReturnsOkAndCorrectEvent()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Organizer");

        var createRequest = CreateValidEventDto("Event For Get By Id");

        var createResponse = await client.PostAsJsonAsync("/api/events", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createResponse.Content.ReadFromJsonAsync<EventDto>();
        created.Should().NotBeNull();

        var response = await client.GetAsync($"/api/events/{created!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var eventItem = await response.Content.ReadFromJsonAsync<EventDto>();

        eventItem.Should().NotBeNull();
        eventItem!.Id.Should().Be(created.Id);
        eventItem.Title.Should().Be("Event For Get By Id");
    }

    [Fact]
    public async Task GetEventById_WhenEventDoesNotExist_ReturnsNotFound()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        var response = await client.GetAsync("/api/events/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateEvent_WithOrganizerRole_ReturnsCreated()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Organizer");

        var request = CreateValidEventDto("Created From Integration Test");

        var response = await client.PostAsJsonAsync("/api/events", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await response.Content.ReadFromJsonAsync<EventDto>();

        created.Should().NotBeNull();
        created!.Id.Should().BeGreaterThan(0);
        created.Title.Should().Be("Created From Integration Test");
        created.Category.Should().Be("Workshop");
        created.VenueId.Should().Be(1);
    }

    [Fact]
    public async Task UpdateEvent_WithAdminRole_WhenEventExists_ReturnsOkAndUpdatedEvent()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Organizer");

        var createRequest = CreateValidEventDto("Event Before Update");

        var createResponse = await client.PostAsJsonAsync("/api/events", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createResponse.Content.ReadFromJsonAsync<EventDto>();
        created.Should().NotBeNull();

        client.DefaultRequestHeaders.Remove("X-Test-Role");
        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        var updateRequest = new EventDto
        {
            Title = "Updated Integration Event",
            Category = "Conference",
            Description = "Updated through integration test.",
            StartDate = DateTime.UtcNow.AddDays(20),
            EndDate = DateTime.UtcNow.AddDays(20).AddHours(3),
            Capacity = 150,
            Status = "Upcoming",
            VenueId = 1
        };

        var response = await client.PutAsJsonAsync($"/api/events/{created!.Id}", updateRequest);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var updated = await response.Content.ReadFromJsonAsync<EventDto>();

        updated.Should().NotBeNull();
        updated!.Id.Should().Be(created.Id);
        updated.Title.Should().Be("Updated Integration Event");
        updated.Category.Should().Be("Conference");
        updated.Capacity.Should().Be(150);
    }

    [Fact]
    public async Task UpdateEvent_WhenEventDoesNotExist_ReturnsNotFound()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        var request = CreateValidEventDto("Non Existing Event");

        var response = await client.PutAsJsonAsync("/api/events/9999", request);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteEvent_WithOrganizerRole_WhenEventExists_ReturnsNoContent()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Organizer");

        var createRequest = CreateValidEventDto("Event To Delete Integration Test");

        var createResponse = await client.PostAsJsonAsync("/api/events", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createResponse.Content.ReadFromJsonAsync<EventDto>();
        created.Should().NotBeNull();

        var deleteResponse = await client.DeleteAsync($"/api/events/{created!.Id}");

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteEvent_WhenEventDoesNotExist_ReturnsNotFound()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        var response = await client.DeleteAsync("/api/events/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetEvents_WithoutAuthentication_ReturnsUnauthorized()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/events");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateEvent_WithStudentRole_ReturnsForbidden()
    {
        await using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        client.DefaultRequestHeaders.Add("X-Test-Role", "Student");

        var request = CreateValidEventDto("Forbidden Student Event");

        var response = await client.PostAsJsonAsync("/api/events", request);

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}