namespace IusEventManagement.Api.Entities
{
    public class Registration
    {
        public int Id { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; } = null!;

        // FK to ApplicationUser (string because Identity uses string GUIDs)
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        // "Confirmed" | "Waitlisted"
        public string Status { get; set; } = "Confirmed";

        public bool CheckedIn { get; set; } = false;

        public DateTime? CheckedInAt { get; set; }
    }
}
