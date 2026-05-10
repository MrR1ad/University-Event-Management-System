using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AuthController : ControllerBase
{
    [HttpGet("me")]
    public IActionResult Me()
    {
        var roles = User
            .FindAll(ClaimTypes.Role)
            .Select(c => c.Value)
            .Distinct()
            .ToArray();

        var email = GetEmailFromClaims(User);

        var name =
            User.FindFirst("name")?.Value ??
            User.Identity?.Name ??
            email;

        return Ok(new
        {
            id = User.FindFirst("oid")?.Value,
            tenantId = User.FindFirst("tid")?.Value,
            name,
            email,
            roles,
            primaryRole =
            roles.Contains("Admin") ? "Admin" :
            roles.Contains("Organizer") ? "Organizer" :
            "Student"
        });
    }

    [HttpGet("admin-test")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult AdminTest()
    {
        return Ok(new { message = "Admin access works." });
    }

    [HttpGet("organizer-test")]
    [Authorize(Policy = "OrganizerOnly")]
    public IActionResult OrganizerTest()
    {
        return Ok(new { message = "Organizer access works." });
    }

    [HttpGet("student-test")]
    [Authorize(Policy = "StudentOnly")]
    public IActionResult StudentTest()
    {
        return Ok(new { message = "Student access works." });
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
}