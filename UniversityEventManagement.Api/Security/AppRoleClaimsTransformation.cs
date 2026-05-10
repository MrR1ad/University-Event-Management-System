using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.Text.RegularExpressions;

namespace UniversityEventManagement.Api.Security;

public sealed class AppRoleClaimsTransformation : IClaimsTransformation
{
    private readonly IConfiguration _configuration;

    public AppRoleClaimsTransformation(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated)
        {
            return Task.FromResult(principal);
        }

        var email = GetEmailFromClaims(principal);

        var existingRoles = principal
            .FindAll(ClaimTypes.Role)
            .Select(c => c.Value)
            .Concat(principal.FindAll("roles").Select(c => c.Value))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var role in existingRoles)
        {
            AddRoleIfMissing(identity, role);
        }

        var mappedRole = GetMappedRole(email);
        AddRoleIfMissing(identity, mappedRole);

        return Task.FromResult(principal);
    }

    private string GetMappedRole(string email)
    {
        var adminEmails = _configuration
            .GetSection("RoleMapping:AdminEmails")
            .Get<string[]>() ?? [];

        var organizerEmails = _configuration
            .GetSection("RoleMapping:OrganizerEmails")
            .Get<string[]>() ?? [];

        if (adminEmails.Contains(email, StringComparer.OrdinalIgnoreCase))
        {
            return "Admin";
        }

        if (organizerEmails.Contains(email, StringComparer.OrdinalIgnoreCase))
        {
            return "Organizer";
        }

        return "Student";
    }

    private static void AddRoleIfMissing(ClaimsIdentity identity, string role)
    {
        var alreadyExists = identity.Claims.Any(c =>
            c.Type == ClaimTypes.Role &&
            string.Equals(c.Value, role, StringComparison.OrdinalIgnoreCase));

        if (!alreadyExists)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }
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