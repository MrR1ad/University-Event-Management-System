using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace UEM.Tests.Integration.Auth;

public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Test-Role", out var roleHeader))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var role = roleHeader.ToString();

        var email = role switch
        {
            "Admin" => "admin@test.com",
            "Organizer" => "organizer@test.com",
            "Student" => "student@test.com",
            _ => "student@test.com"
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user-id"),
            new Claim(ClaimTypes.Name, "Test User"),
            new Claim("name", "Test User"),
            new Claim(ClaimTypes.Email, email),
            new Claim("preferred_username", email),
            new Claim(ClaimTypes.Role, role),
            new Claim("roles", role)
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}