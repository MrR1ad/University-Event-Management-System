namespace IusEventManagement.Api.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Capacity { get; set; }

        public string Category { get; set; } = string.Empty;

        // "Upcoming" | "Ongoing" | "Past" | "Cancelled"
        public string Status { get; set; } = "Upcoming";

        // FK to Venue
        public int VenueId { get; set; }
        public Venue Venue { get; set; } = null!;

        // FK to Organizer (ApplicationUser)
        public string OrganizerId { get; set; } = string.Empty;
        public ApplicationUser Organizer { get; set; } = null!;

        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}
