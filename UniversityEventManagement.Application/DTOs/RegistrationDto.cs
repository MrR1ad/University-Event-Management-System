namespace UniversityEventManagement.Application.DTOs;

public class RegistrationDto
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; }
    public bool CheckedIn { get; set; }
    public string Status { get; set; } = "Confirmed";

    public string EventTitle { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}