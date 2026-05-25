using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public async Task<IActionResult> GetAll()
    {
        var events = await _eventService.GetAllAsync();
        return Ok(events.OrderBy(e => e.StartDate));
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = "AnyAppRole")]
    public async Task<IActionResult> GetById(int id)
    {
        var eventItem = await _eventService.GetByIdAsync(id);

        if (eventItem is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        return Ok(eventItem);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOrOrganizer")]
    public async Task<IActionResult> Create(EventDto request)
    {
        var email = GetEmailFromClaims(User);
        var name = GetNameFromClaims(User, email);
        var role = GetPrimaryRole();

        var created = await _eventService.CreateAsync(request, email, name, role);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public async Task<IActionResult> Update(int id, EventDto request)
    {
        var updated = await _eventService.UpdateAsync(id, request);

        if (updated is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _eventService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = "Event not found." });
        }

        return NoContent();
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
        var name = principal.FindFirst("name")?.Value
            ?? principal.Identity?.Name
            ?? string.Empty;

        return string.IsNullOrWhiteSpace(name) ? email : name;
    }

    private static string GetEmailFromClaims(ClaimsPrincipal principal)
    {
        var email = principal.FindFirst("preferred_username")?.Value
            ?? principal.FindFirst("upn")?.Value
            ?? principal.FindFirst(ClaimTypes.Upn)?.Value
            ?? principal.FindFirst(ClaimTypes.Email)?.Value
            ?? principal.FindFirst("email")?.Value
            ?? principal.FindFirst("unique_name")?.Value
            ?? string.Empty;

        if (!string.IsNullOrWhiteSpace(email) && email.Contains('@'))
        {
            return email.Trim().ToLowerInvariant();
        }

        var name = principal.FindFirst("name")?.Value
            ?? principal.Identity?.Name
            ?? string.Empty;

        var match = Regex.Match(
            name,
            @"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}",
            RegexOptions.IgnoreCase
        );

        return match.Success ? match.Value.Trim().ToLowerInvariant() : string.Empty;
    }
}