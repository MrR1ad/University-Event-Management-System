using IusEventManagement.Api.DTOs;
using IusEventManagement.Api.Entities;
using IusEventManagement.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IusEventManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser>  _userManager;
        private readonly RoleManager<IdentityRole>     _roleManager;
        private readonly JwtService                    _jwtService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole>    roleManager,
            JwtService                   jwtService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtService  = jwtService;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Block self-registration as Admin
            if (request.Role == "Admin")
                return BadRequest(new { message = "Cannot self-register as Admin." });

            // Validate role
            var allowedRoles = new[] { "Student", "Organizer" };
            if (!allowedRoles.Contains(request.Role))
                return BadRequest(new { message = "Role must be Student or Organizer." });

            var user = new ApplicationUser
            {
                FullName = request.FullName,
                Email    = request.Email,
                UserName = request.Email,   // Identity uses UserName for login
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = string.Join(" ", errors) });
            }

            // Make sure the role exists in the DB, then assign it
            if (!await _roleManager.RoleExistsAsync(request.Role))
                await _roleManager.CreateAsync(new IdentityRole(request.Role));

            await _userManager.AddToRoleAsync(user, request.Role);

            var token = _jwtService.GenerateToken(user, request.Role);

            return Ok(new AuthResponse
            {
                Token    = token,
                UserId   = user.Id,
                FullName = user.FullName,
                Email    = user.Email!,
                Role     = request.Role,
            });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            var passwordOk = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordOk)
                return Unauthorized(new { message = "Invalid email or password." });

            var roles = await _userManager.GetRolesAsync(user);
            var role  = roles.FirstOrDefault() ?? "Student";

            var token = _jwtService.GenerateToken(user, role);

            return Ok(new AuthResponse
            {
                Token    = token,
                UserId   = user.Id,
                FullName = user.FullName,
                Email    = user.Email!,
                Role     = role,
            });
        }
    }
}
