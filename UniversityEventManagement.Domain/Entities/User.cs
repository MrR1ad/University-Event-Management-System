namespace UniversityEventManagement.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = "Student";

    public string Status { get; set; } = "Active";

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();

    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}