namespace IusEventManagement.Api.DTOs
{
    // ── AUTH ──────────────────────────────────────────────────────────────────

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        // "Student" or "Organizer" — users cannot self-register as Admin
        public string Role     { get; set; } = "Student";
    }

    public class LoginRequest
    {
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token    { get; set; } = string.Empty;
        public string UserId   { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Role     { get; set; } = string.Empty;
    }

    // ── EVENTS ────────────────────────────────────────────────────────────────

    public class CreateEventRequest
    {
        public string Title       { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category    { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate   { get; set; }
        public int Capacity       { get; set; }
        public int VenueId        { get; set; }
        public string Status      { get; set; } = "Upcoming";
    }

    public class UpdateEventRequest : CreateEventRequest { }

    public class EventResponse
    {
        public int    Id            { get; set; }
        public string Title         { get; set; } = string.Empty;
        public string Description   { get; set; } = string.Empty;
        public string Category      { get; set; } = string.Empty;
        public DateTime StartDate   { get; set; }
        public DateTime EndDate     { get; set; }
        public int    Capacity      { get; set; }
        public string Status        { get; set; } = string.Empty;
        public int    VenueId       { get; set; }
        public string VenueName     { get; set; } = string.Empty;
        public string OrganizerId   { get; set; } = string.Empty;
        public string OrganizerName { get; set; } = string.Empty;
        public int    Registered    { get; set; }  // count of registrations
    }

    // ── VENUES ────────────────────────────────────────────────────────────────

    public class CreateVenueRequest
    {
        public string Name     { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int    Capacity { get; set; }
    }

    public class VenueResponse
    {
        public int    Id       { get; set; }
        public string Name     { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int    Capacity { get; set; }
    }

    // ── REGISTRATIONS ─────────────────────────────────────────────────────────

    public class RegistrationResponse
    {
        public int    Id           { get; set; }
        public int    EventId      { get; set; }
        public string EventTitle   { get; set; } = string.Empty;
        public string UserId       { get; set; } = string.Empty;
        public string UserName     { get; set; } = string.Empty;
        public DateTime RegisteredAt { get; set; }
        public string Status       { get; set; } = string.Empty;
        public bool   CheckedIn    { get; set; }
        public DateTime? CheckedInAt { get; set; }
    }

    // ── USERS (Admin view) ────────────────────────────────────────────────────

    public class UserResponse
    {
        public string Id       { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Role     { get; set; } = string.Empty;
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }

    // ── STATS ─────────────────────────────────────────────────────────────────

    public class StatsResponse
    {
        public int TotalEvents        { get; set; }
        public int UpcomingEvents     { get; set; }
        public int TotalUsers         { get; set; }
        public int TotalRegistrations { get; set; }
    }
}
