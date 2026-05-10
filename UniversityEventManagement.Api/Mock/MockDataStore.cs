namespace UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

public static class MockDataStore
{
    public static List<VenueDto> Venues { get; } =
    [
        new VenueDto { Id = 1, Name = "Main Auditorium", Location = "Building A, Floor 1", Capacity = 300 },
        new VenueDto { Id = 2, Name = "Seminar Room 101", Location = "Building B, Floor 1", Capacity = 40 },
        new VenueDto { Id = 3, Name = "Computer Lab 3", Location = "Building C, Floor 2", Capacity = 60 },
        new VenueDto { Id = 4, Name = "Open Courtyard", Location = "Campus Center", Capacity = 500 },
        new VenueDto { Id = 5, Name = "Conference Hall", Location = "Building A, Floor 3", Capacity = 120 }
    ];

    public static List<EventDto> Events { get; } =
    [
        new EventDto
        {
            Id = 1,
            Title = "AI & Machine Learning Workshop",
            Category = "Workshop",
            Description = "Hands-on workshop covering the fundamentals of machine learning using Python and scikit-learn.",
            StartDate = DateTime.Parse("2026-04-15T10:00"),
            EndDate = DateTime.Parse("2026-04-15T14:00"),
            Capacity = 60,
            Registered = 3,
            Status = "Upcoming",
            VenueId = 3,
            VenueName = "Computer Lab 3",
            OrganizerId = 1,
            OrganizerName = "Organizer"
        },
        new EventDto
        {
            Id = 2,
            Title = "IUS Spring Cultural Night",
            Category = "Cultural",
            Description = "An evening celebrating the diverse cultures of IUS students.",
            StartDate = DateTime.Parse("2026-04-20T18:00"),
            EndDate = DateTime.Parse("2026-04-20T22:00"),
            Capacity = 300,
            Registered = 2,
            Status = "Upcoming",
            VenueId = 1,
            VenueName = "Main Auditorium",
            OrganizerId = 1,
            OrganizerName = "Organizer"
        },
        new EventDto
        {
            Id = 3,
            Title = "Research Paper Writing Seminar",
            Category = "Seminar",
            Description = "Learn how to structure, write and publish academic research papers.",
            StartDate = DateTime.Parse("2026-04-10T09:00"),
            EndDate = DateTime.Parse("2026-04-10T11:00"),
            Capacity = 40,
            Registered = 1,
            Status = "Upcoming",
            VenueId = 2,
            VenueName = "Seminar Room 101",
            OrganizerId = 1,
            OrganizerName = "Organizer"
        },
        new EventDto
        {
            Id = 4,
            Title = "Career Fair 2026",
            Category = "Academic",
            Description = "Meet representatives from companies and bring your CV.",
            StartDate = DateTime.Parse("2026-03-20T10:00"),
            EndDate = DateTime.Parse("2026-03-20T17:00"),
            Capacity = 500,
            Registered = 20,
            Status = "Past",
            VenueId = 4,
            VenueName = "Open Courtyard",
            OrganizerId = 1,
            OrganizerName = "Organizer"
        }
    ];

    public static List<UserDto> Users { get; } =
    [
        new UserDto { Id = 1, Name = "Student", Email = "student@ius.edu.ba", Role = "Student", Status = "Active", JoinedAt = "2025-09-10" },
        new UserDto { Id = 2, Name = "Organizer", Email = "organizer@ius.edu.ba", Role = "Organizer", Status = "Active", JoinedAt = "2025-09-05" },
        new UserDto { Id = 3, Name = "Admin User", Email = "admin@ius.edu.ba", Role = "Admin", Status = "Active", JoinedAt = "2025-09-01" },
        new UserDto { Id = 4, Name = "Lejla Muratovic", Email = "lejla@ius.edu.ba", Role = "Student", Status = "Active", JoinedAt = "2025-09-12" }
    ];

    public static List<RegistrationDto> Registrations { get; } =
    [
        new RegistrationDto
        {
            Id = 1,
            EventId = 1,
            UserId = 1,
            UserName = "Student",
            RegisteredAt = DateTime.Parse("2026-04-01T10:22"),
            CheckedIn = false,
            Status = "Confirmed"
        },
        new RegistrationDto
        {
            Id = 2,
            EventId = 2,
            UserId = 1,
            UserName = "Student",
            RegisteredAt = DateTime.Parse("2026-04-02T08:14"),
            CheckedIn = false,
            Status = "Confirmed"
        },
        new RegistrationDto
        {
            Id = 3,
            EventId = 1,
            UserId = 4,
            UserName = "Lejla Muratovic",
            RegisteredAt = DateTime.Parse("2026-04-01T11:00"),
            CheckedIn = true,
            Status = "Confirmed"
        }
    ];

    public static int NextEventId => Events.Count == 0 ? 1 : Events.Max(e => e.Id) + 1;
    public static int NextVenueId => Venues.Count == 0 ? 1 : Venues.Max(v => v.Id) + 1;
    public static int NextUserId => Users.Count == 0 ? 1 : Users.Max(u => u.Id) + 1;
    public static int NextRegistrationId => Registrations.Count == 0 ? 1 : Registrations.Max(r => r.Id) + 1;
}

