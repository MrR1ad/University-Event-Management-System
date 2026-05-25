namespace UniversityEventManagement.Domain.Entities;

public class Event
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int Capacity { get; set; }

    public string Status { get; set; } = "Upcoming";

    public string? Image { get; set; }

    public int VenueId { get; set; }

    public Venue? Venue { get; set; }

    public int? OrganizerId { get; set; }

    public User? Organizer { get; set; }

    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}