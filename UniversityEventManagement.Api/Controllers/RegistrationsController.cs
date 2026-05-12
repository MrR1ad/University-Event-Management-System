using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RegistrationsController : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public IActionResult Get([FromQuery] int? eventId)
    {
        var currentUser = GetOrCreateCurrentUser();

        var isAdminOrOrganizer =
            User.IsInRole("Admin") || User.IsInRole("Organizer");

        var query = MockDataStore.Registrations.AsEnumerable();

        if (isAdminOrOrganizer && eventId.HasValue)
        {
            query = query.Where(r => r.EventId == eventId.Value);
        }
        else
        {
            query = query.Where(r => r.UserId == currentUser.Id);
        }

        var result = query.Select(AttachEventData).ToList();

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOrStudent")]
    public IActionResult Register(RegisterRequest request)
    {
        var currentUser = GetOrCreateCurrentUser();

        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == request.EventId);

        if (eventItem is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        var existing = MockDataStore.Registrations.FirstOrDefault(r =>
            r.EventId == request.EventId &&
            r.UserId == currentUser.Id);

        if (existing is not null)
        {
            return Ok(AttachEventData(existing));
        }

        var status = eventItem.Registered >= eventItem.Capacity
            ? "Waitlisted"
            : "Confirmed";

        var registration = new RegistrationDto
        {
            Id = MockDataStore.NextRegistrationId,
            EventId = eventItem.Id,
            UserId = currentUser.Id,
            UserName = currentUser.Name,
            RegisteredAt = DateTime.Now,
            CheckedIn = false,
            Status = status
        };

        MockDataStore.Registrations.Add(registration);

        if (status == "Confirmed")
        {
            eventItem.Registered += 1;
        }

        return Ok(AttachEventData(registration));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOrStudent")]
    public IActionResult Cancel(int id)
    {
        var currentUser = GetOrCreateCurrentUser();

        var registration = MockDataStore.Registrations.FirstOrDefault(r => r.Id == id);

        if (registration is null)
        {
            return NotFound(new { message = "Registration not found." });
        }

        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin && registration.UserId != currentUser.Id)
        {
            return Forbid();
        }

        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == registration.EventId);

        if (eventItem is not null && registration.Status == "Confirmed")
        {
            eventItem.Registered = Math.Max(0, eventItem.Registered - 1);
        }

        MockDataStore.Registrations.Remove(registration);

        return NoContent();
    }

    [HttpPatch("{id:int}/checkin")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public IActionResult CheckIn(int id)
    {
        var registration = MockDataStore.Registrations.FirstOrDefault(r => r.Id == id);

        if (registration is null)
        {
            return NotFound(new { message = "Registration not found." });
        }

        registration.CheckedIn = true;

        return Ok(AttachEventData(registration));
    }

    private UserDto GetOrCreateCurrentUser()
    {
        var email = GetEmailFromClaims(User);
        var name = GetNameFromClaims(User, email);
        var role = GetPrimaryRole();

        var existing = MockDataStore.Users.FirstOrDefault(u =>
            !string.IsNullOrWhiteSpace(email) &&
            string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase));

        if (existing is not null)
        {
            existing.Name = name;
            existing.Role = role;
            return existing;
        }

        var user = new UserDto
        {
            Id = MockDataStore.NextUserId,
            Name = name,
            Email = email,
            Role = role,
            Status = "Active",
            JoinedAt = DateTime.UtcNow.ToString("yyyy-MM-dd")
        };

        MockDataStore.Users.Add(user);

        return user;
    }

    private string GetPrimaryRole()
    {
        if (User.IsInRole("Admin"))
        {
            return "Admin";
        }

        if (User.IsInRole("Organizer"))
        {
            return "Organizer";
        }

        return "Student";
    }

    private static string GetNameFromClaims(ClaimsPrincipal principal, string email)
    {
        var name =
            principal.FindFirst("name")?.Value ??
            principal.Identity?.Name ??
            string.Empty;

        return string.IsNullOrWhiteSpace(name)
            ? email
            : name;
    }

    private static string GetEmailFromClaims(ClaimsPrincipal principal)
    {
        var email =
            principal.FindFirst("preferred_username")?.Value ??
            principal.FindFirst("upn")?.Value ??
            principal.FindFirst(ClaimTypes.Upn)?.Value ??
            principal.FindFirst(ClaimTypes.Email)?.Value ??
            principal.FindFirst("email")?.Value ??
            principal.FindFirst("unique_name")?.Value ??
            string.Empty;

        if (!string.IsNullOrWhiteSpace(email) && email.Contains('@'))
        {
            return email.Trim().ToLowerInvariant();
        }

        var name =
            principal.FindFirst("name")?.Value ??
            principal.Identity?.Name ??
            string.Empty;

        var match = Regex.Match(
            name,
            @"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}",
            RegexOptions.IgnoreCase
        );

        return match.Success
            ? match.Value.Trim().ToLowerInvariant()
            : string.Empty;
    }

    private static RegistrationDto AttachEventData(RegistrationDto registration)
    {
        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == registration.EventId);

        registration.EventTitle = eventItem?.Title ?? string.Empty;
        registration.StartDate = eventItem?.StartDate ?? default;
        registration.VenueName = eventItem?.VenueName ?? string.Empty;
        registration.Category = eventItem?.Category ?? string.Empty;

        return registration;
    }
}