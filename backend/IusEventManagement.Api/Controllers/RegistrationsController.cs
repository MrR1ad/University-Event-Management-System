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
    [Authorize]
    public class RegistrationsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public RegistrationsController(ApplicationDbContext db) { _db = db; }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        // GET api/registrations?eventId=X  — Organizer sees participants for their event
        // GET api/registrations?userId=X   — Student sees their own registrations
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? eventId, [FromQuery] string? userId)
        {
            var query = _db.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .AsQueryable();

            if (eventId.HasValue)
            {
                // Organizer can only see their own event's participants
                if (User.IsInRole("Organizer"))
                {
                    var ev = await _db.Events.FindAsync(eventId.Value);
                    if (ev == null || ev.OrganizerId != CurrentUserId)
                        return Forbid();
                }
                query = query.Where(r => r.EventId == eventId.Value);
            }
            else if (userId != null)
            {
                // Students can only see their own registrations
                if (User.IsInRole("Student") && userId != CurrentUserId)
                    return Forbid();

                query = query.Where(r => r.UserId == userId);
            }
            else if (!User.IsInRole("Admin"))
            {
                // Non-admins must filter by event or user
                return BadRequest(new { message = "Provide eventId or userId query param." });
            }

            var result = await query.Select(r => MapToResponse(r)).ToListAsync();
            return Ok(result);
        }

        // POST api/registrations — Student registers for an event
        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Register([FromBody] RegisterForEventRequest request)
        {
            var ev = await _db.Events
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == request.EventId);

            if (ev == null)
                return NotFound(new { message = "Event not found." });

            if (ev.Status == "Past" || ev.Status == "Cancelled")
                return BadRequest(new { message = "Cannot register for a past or cancelled event." });

            // Check if already registered
            var existing = await _db.Registrations
                .FirstOrDefaultAsync(r => r.EventId == request.EventId && r.UserId == CurrentUserId);

            if (existing != null)
                return BadRequest(new { message = "You are already registered for this event." });

            // Determine if confirmed or waitlisted
            var confirmedCount = ev.Registrations.Count(r => r.Status == "Confirmed");
            var status = confirmedCount < ev.Capacity ? "Confirmed" : "Waitlisted";

            var registration = new Registration
            {
                EventId      = request.EventId,
                UserId       = CurrentUserId,
                RegisteredAt = DateTime.UtcNow,
                Status       = status,
                CheckedIn    = false,
            };

            _db.Registrations.Add(registration);
            await _db.SaveChangesAsync();

            await _db.Entry(registration).Reference(r => r.Event).LoadAsync();
            await _db.Entry(registration).Reference(r => r.User).LoadAsync();

            return CreatedAtAction(nameof(GetAll), MapToResponse(registration));
        }

        // DELETE api/registrations/:id — Student cancels their own registration
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var reg = await _db.Registrations.FindAsync(id);
            if (reg == null) return NotFound();

            // Students can only cancel their own; Admin can cancel any
            if (User.IsInRole("Student") && reg.UserId != CurrentUserId)
                return Forbid();

            _db.Registrations.Remove(reg);
            await _db.SaveChangesAsync();

            // Promote first waitlisted person if there is one
            var firstWaitlisted = await _db.Registrations
                .Where(r => r.EventId == reg.EventId && r.Status == "Waitlisted")
                .OrderBy(r => r.RegisteredAt)
                .FirstOrDefaultAsync();

            if (firstWaitlisted != null)
            {
                firstWaitlisted.Status = "Confirmed";
                await _db.SaveChangesAsync();
            }

            return NoContent();
        }

        // PATCH api/registrations/:id/checkin — Organizer checks in a participant
        [HttpPatch("{id}/checkin")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<IActionResult> CheckIn(int id)
        {
            var reg = await _db.Registrations
                .Include(r => r.Event)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reg == null) return NotFound();

            // Organizer can only check in for their own events
            if (User.IsInRole("Organizer") && reg.Event.OrganizerId != CurrentUserId)
                return Forbid();

            if (reg.CheckedIn)
                return BadRequest(new { message = "Already checked in." });

            reg.CheckedIn   = true;
            reg.CheckedInAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            await _db.Entry(reg).Reference(r => r.User).LoadAsync();

            return Ok(MapToResponse(reg));
        }

        private static RegistrationResponse MapToResponse(Registration r) => new RegistrationResponse
        {
            Id           = r.Id,
            EventId      = r.EventId,
            EventTitle   = r.Event?.Title ?? string.Empty,
            UserId       = r.UserId,
            UserName     = r.User?.FullName ?? string.Empty,
            RegisteredAt = r.RegisteredAt,
            Status       = r.Status,
            CheckedIn    = r.CheckedIn,
            CheckedInAt  = r.CheckedInAt,
        };
    }

    // Small request DTO just for this controller
    public class RegisterForEventRequest
    {
        public int EventId { get; set; }
    }
}
