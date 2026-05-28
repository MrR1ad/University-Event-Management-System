using FluentAssertions;
using Moq;
using UEM.Tests.Unit.Helpers;

using EventDto = global::UniversityEventManagement.Application.DTOs.EventDto;
using UserDto = global::UniversityEventManagement.Application.DTOs.UserDto;
using IUserService = global::UniversityEventManagement.Application.Interfaces.IUserService;
using Event = global::UniversityEventManagement.Domain.Entities.Event;
using User = global::UniversityEventManagement.Domain.Entities.User;
using Venue = global::UniversityEventManagement.Domain.Entities.Venue;
using EventService = global::UniversityEventManagement.Infrastructure.Services.EventService;

namespace UEM.Tests.Unit.Services;

public class EventServiceTests
{
    [Fact]
    public async Task GetAllAsync_WhenNoEventsExist_ReturnsEmptyList()
    {
        var context = TestDbContextFactory.Create();
        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.GetAllAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_WhenEventsExist_ReturnsAllEvents()
    {
        var context = TestDbContextFactory.Create();

        var venue = new Venue
        {
            Id = 1,
            Name = "Main Hall",
            Location = "Building A",
            Capacity = 200
        };

        var organizer = new User
        {
            Id = 1,
            Name = "Organizer User",
            Email = "organizer@test.com",
            Role = "Organizer",
            Status = "Active",
            JoinedAt = DateTime.UtcNow
        };

        context.Venues.Add(venue);
        context.Users.Add(organizer);

        context.Events.AddRange(
            new Event
            {
                Id = 1,
                Title = "Workshop A",
                Category = "Workshop",
                Description = "Description A",
                StartDate = DateTime.UtcNow.AddDays(1),
                EndDate = DateTime.UtcNow.AddDays(1).AddHours(2),
                Capacity = 50,
                Status = "Upcoming",
                VenueId = 1,
                OrganizerId = 1
            },
            new Event
            {
                Id = 2,
                Title = "Seminar B",
                Category = "Seminar",
                Description = "Description B",
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(2).AddHours(2),
                Capacity = 80,
                Status = "Upcoming",
                VenueId = 1,
                OrganizerId = 1
            }
        );

        await context.SaveChangesAsync();

        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.GetAllAsync();

        result.Should().HaveCount(2);
        result.Should().Contain(e => e.Title == "Workshop A");
        result.Should().Contain(e => e.Title == "Seminar B");
    }

    [Fact]
    public async Task GetByIdAsync_WhenEventExists_ReturnsEvent()
    {
        var context = TestDbContextFactory.Create();

        context.Venues.Add(new Venue
        {
            Id = 1,
            Name = "Room 101",
            Location = "Building B",
            Capacity = 40
        });

        context.Events.Add(new Event
        {
            Id = 1,
            Title = "Test Event",
            Category = "Seminar",
            Description = "Test description",
            StartDate = DateTime.UtcNow.AddDays(1),
            EndDate = DateTime.UtcNow.AddDays(1).AddHours(2),
            Capacity = 30,
            Status = "Upcoming",
            VenueId = 1
        });

        await context.SaveChangesAsync();

        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Test Event");
        result.VenueName.Should().Be("Room 101");
    }

    [Fact]
    public async Task GetByIdAsync_WhenEventDoesNotExist_ReturnsNull()
    {
        var context = TestDbContextFactory.Create();
        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.GetByIdAsync(999);

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_WithValidData_CreatesEvent()
    {
        var context = TestDbContextFactory.Create();

        context.Venues.Add(new Venue
        {
            Id = 1,
            Name = "Main Auditorium",
            Location = "Building A",
            Capacity = 300
        });

        context.Users.Add(new User
        {
            Id = 1,
            Name = "Organizer User",
            Email = "organizer@test.com",
            Role = "Organizer",
            Status = "Active",
            JoinedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var userServiceMock = new Mock<IUserService>();

        userServiceMock
            .Setup(s => s.GetOrCreateCurrentUserAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()))
            .ReturnsAsync(new UserDto
            {
                Id = 1,
                Name = "Organizer User",
                Email = "organizer@test.com",
                Role = "Organizer",
                Status = "Active",
                JoinedAt = DateTime.UtcNow.ToString("yyyy-MM-dd")
            });

        var service = new EventService(context, userServiceMock.Object);

        var request = new EventDto
        {
            Title = "New Event",
            Category = "Workshop",
            Description = "New event description",
            StartDate = DateTime.UtcNow.AddDays(5),
            EndDate = DateTime.UtcNow.AddDays(5).AddHours(2),
            Capacity = 60,
            VenueId = 1
        };

        var result = await service.CreateAsync(
            request,
            "organizer@test.com",
            "Organizer User",
            "Organizer"
        );

        result.Should().NotBeNull();
        result.Title.Should().Be("New Event");
        result.Status.Should().Be("Upcoming");
        result.OrganizerId.Should().Be(1);

        context.Events.Should().Contain(e => e.Title == "New Event");
    }

    [Fact]
    public async Task UpdateAsync_WhenEventExists_UpdatesEvent()
    {
        var context = TestDbContextFactory.Create();

        context.Venues.Add(new Venue
        {
            Id = 1,
            Name = "Original Venue",
            Location = "Building A",
            Capacity = 100
        });

        context.Events.Add(new Event
        {
            Id = 1,
            Title = "Old Title",
            Category = "Workshop",
            Description = "Old description",
            StartDate = DateTime.UtcNow.AddDays(1),
            EndDate = DateTime.UtcNow.AddDays(1).AddHours(2),
            Capacity = 20,
            Status = "Upcoming",
            VenueId = 1
        });

        await context.SaveChangesAsync();

        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var request = new EventDto
        {
            Title = "Updated Title",
            Category = "Conference",
            Description = "Updated description",
            StartDate = DateTime.UtcNow.AddDays(3),
            EndDate = DateTime.UtcNow.AddDays(3).AddHours(2),
            Capacity = 100,
            Status = "Upcoming",
            VenueId = 1
        };

        var result = await service.UpdateAsync(1, request);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated Title");
        result.Category.Should().Be("Conference");
        result.Capacity.Should().Be(100);
    }

    [Fact]
    public async Task UpdateAsync_WhenEventDoesNotExist_ReturnsNull()
    {
        var context = TestDbContextFactory.Create();
        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var request = new EventDto
        {
            Title = "Does Not Matter",
            Category = "Workshop",
            Description = "Description",
            StartDate = DateTime.UtcNow.AddDays(1),
            EndDate = DateTime.UtcNow.AddDays(1).AddHours(2),
            Capacity = 50,
            VenueId = 1
        };

        var result = await service.UpdateAsync(999, request);

        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_WhenEventExists_DeletesEvent()
    {
        var context = TestDbContextFactory.Create();

        context.Venues.Add(new Venue
        {
            Id = 1,
            Name = "Venue",
            Location = "Location",
            Capacity = 100
        });

        context.Events.Add(new Event
        {
            Id = 1,
            Title = "Event To Delete",
            Category = "Workshop",
            Description = "Description",
            StartDate = DateTime.UtcNow.AddDays(1),
            EndDate = DateTime.UtcNow.AddDays(1).AddHours(2),
            Capacity = 50,
            Status = "Upcoming",
            VenueId = 1
        });

        await context.SaveChangesAsync();

        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.DeleteAsync(1);

        result.Should().BeTrue();
        context.Events.Should().NotContain(e => e.Id == 1);
    }

    [Fact]
    public async Task DeleteAsync_WhenEventDoesNotExist_ReturnsFalse()
    {
        var context = TestDbContextFactory.Create();
        var userServiceMock = new Mock<IUserService>();
        var service = new EventService(context, userServiceMock.Object);

        var result = await service.DeleteAsync(999);

        result.Should().BeFalse();
    }
}