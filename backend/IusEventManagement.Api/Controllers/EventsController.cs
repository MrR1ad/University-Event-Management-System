using System.Security.Claims;
using IusEventManagement.Api.Data;
using IusEventManagement.Api.DTOs;
using IusEventManagement.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IusEventManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]   // all endpoints require a valid JWT by default
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public EventsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Helper: get the current user's ID from the JWT token
        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        // ── GET all events (anyone logged in can see) ─────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _db.Events
                .Include(e => e.Venue)
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                .Select(e => MapToResponse(e))
                .ToListAsync();

            return Ok(events);
        }

        // ── GET single event ──────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _db.Events
                .Include(e => e.Venue)
                .Include(e => e.Organizer)
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return NotFound(new { message = "Event not found." });

            return Ok(MapToResponse(ev));
        }

        // ── CREATE event (Organizer or Admin only) ────────────────────────────
        [HttpPost]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateEventRequest request)
        {
            // Validate venue exists
            var venue = await _db.Venues.FindAsync(request.VenueId);
            if (venue == null)
                return BadRequest(new { message = "Venue not found." });

            var ev = new Event
            {
                Title       = request.Title,
                Description = request.Description,
                Category    = request.Category,
                StartDate   = request.StartDate,
                EndDate     = request.EndDate,
                Capacity    = request.Capacity,
                Status      = request.Status,
                VenueId     = request.VenueId,
                OrganizerId = CurrentUserId,
            };

            _db.Events.Add(ev);
            await _db.SaveChangesAsync();

            // Reload with navigation properties for the response
            await _db.Entry(ev).Reference(e => e.Venue).LoadAsync();
            await _db.Entry(ev).Reference(e => e.Organizer).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = ev.Id }, MapToResponse(ev));
        }

        // ── UPDATE event (owner Organizer or Admin) ───────────────────────────
        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventRequest request)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound(new { message = "Event not found." });

            // Organizers can only edit their own events
            if (User.IsInRole("Organizer") && ev.OrganizerId != CurrentUserId)
                return Forbid();

            ev.Title       = request.Title;
            ev.Description = request.Description;
            ev.Category    = request.Category;
            ev.StartDate   = request.StartDate;
            ev.EndDate     = request.EndDate;
            ev.Capacity    = request.Capacity;
            ev.Status      = request.Status;
            ev.VenueId     = request.VenueId;

            await _db.SaveChangesAsync();

            await _db.Entry(ev).Reference(e => e.Venue).LoadAsync();
            await _db.Entry(ev).Reference(e => e.Organizer).LoadAsync();
            await _db.Entry(ev).Collection(e => e.Registrations).LoadAsync();

            return Ok(MapToResponse(ev));
        }

        // ── DELETE event (owner Organizer or Admin) ───────────────────────────
        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound(new { message = "Event not found." });

            if (User.IsInRole("Organizer") && ev.OrganizerId != CurrentUserId)
                return Forbid();

            _db.Events.Remove(ev);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // ── Map entity → DTO (static so Select() can use it) ─────────────────
        private static EventResponse MapToResponse(Event e) => new EventResponse
        {
            Id            = e.Id,
            Title         = e.Title,
            Description   = e.Description,
            Category      = e.Category,
            StartDate     = e.StartDate,
            EndDate       = e.EndDate,
            Capacity      = e.Capacity,
            Status        = e.Status,
            VenueId       = e.VenueId,
            VenueName     = e.Venue?.Name ?? string.Empty,
            OrganizerId   = e.OrganizerId,
            OrganizerName = e.Organizer?.FullName ?? string.Empty,
            Registered    = e.Registrations?.Count ?? 0,
        };
    }
}
