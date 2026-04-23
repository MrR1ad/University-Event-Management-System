using Microsoft.AspNetCore.Identity;

namespace IusEventManagement.Api.Entities
{
    // Extends ASP.NET Identity's built-in user
    // Identity gives us: Id, Email, PasswordHash, UserName, etc. for free
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        // Navigation: registrations this user has made
        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}
