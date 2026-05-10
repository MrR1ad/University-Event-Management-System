using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        var email =
            User.FindFirst("preferred_username")?.Value ??
            User.FindFirst("upn")?.Value ??
            User.FindFirst(ClaimTypes.Email)?.Value ??
            string.Empty;

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
            primaryRole = roles.FirstOrDefault() ?? "Student"
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
}