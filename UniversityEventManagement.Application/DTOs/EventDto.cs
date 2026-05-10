namespace UniversityEventManagement.Application.DTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Capacity { get; set; }
    public int Registered { get; set; }
    public string Status { get; set; } = "Upcoming";
    public int VenueId { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public int OrganizerId { get; set; }
    public string OrganizerName { get; set; } = string.Empty;
    public string? Image { get; set; }
}