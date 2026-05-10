namespace UniversityEventManagement.Application.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Student";
    public string Status { get; set; } = "Active";
    public string JoinedAt { get; set; } = string.Empty;
}