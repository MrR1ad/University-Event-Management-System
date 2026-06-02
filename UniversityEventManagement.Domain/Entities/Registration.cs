namespace UniversityEventManagement.Domain.Entities;

public class Registration
{
    public int Id { get; set; }

    public int EventId { get; set; }

    public Event? Event { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    public bool CheckedIn { get; set; }

    public string Status { get; set; } = "Confirmed";
}