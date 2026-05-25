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
public class RegistrationsController : ControllerBase
{
    private readonly IRegistrationService _registrationService;

    public RegistrationsController(IRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public async Task<IActionResult> Get([FromQuery] int? eventId)
    {
        var email = GetEmailFromClaims(User);
        var name = GetNameFromClaims(User, email);
        var role = GetPrimaryRole();

        var isAdminOrOrganizer = User.IsInRole("Admin") || User.IsInRole("Organizer");

        var registrations = await _registrationService.GetAsync(
            eventId,
            email,
            name,
            role,
            isAdminOrOrganizer
        );

        return Ok(registrations);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOrStudent")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var email = GetEmailFromClaims(User);
        var name = GetNameFromClaims(User, email);
        var role = GetPrimaryRole();

        var registration = await _registrationService.RegisterAsync(
            request,
            email,
            name,
            role
        );

        if (registration is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        return Ok(registration);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOrStudent")]
    public async Task<IActionResult> Cancel(int id)
    {
        var email = GetEmailFromClaims(User);
        var name = GetNameFromClaims(User, email);
        var role = GetPrimaryRole();

        var result = await _registrationService.CancelAsync(
            id,
            email,
            name,
            role,
            User.IsInRole("Admin")
        );

        if (result == "NotFound")
        {
            return NotFound(new { message = "Registration not found." });
        }

        if (result == "Forbidden")
        {
            return Forbid();
        }

        return NoContent();
    }

    [HttpPatch("{id:int}/checkin")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public async Task<IActionResult> CheckIn(int id)
    {
        var registration = await _registrationService.CheckInAsync(id);

        if (registration is null)
        {
            return NotFound(new { message = "Registration not found." });
        }

        return Ok(registration);
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