using IusEventManagement.Api.Data;
using IusEventManagement.Api.DTOs;
using IusEventManagement.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IusEventManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]   // entire controller = Admin only
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext          _db;

        public UsersController(UserManager<ApplicationUser> userManager, ApplicationDbContext db)
        {
            _userManager = userManager;
            _db          = db;
        }

        // GET api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserResponse>();

            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                result.Add(new UserResponse
                {
                    Id       = u.Id,
                    FullName = u.FullName,
                    Email    = u.Email!,
                    Role     = roles.FirstOrDefault() ?? "Student",
                });
            }

            return Ok(result);
        }

        // PATCH api/users/:id/role
        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            var allowed = new[] { "Student", "Organizer", "Admin" };
            if (!allowed.Contains(request.Role))
                return BadRequest(new { message = "Invalid role." });

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, request.Role);

            return Ok(new { message = $"Role updated to {request.Role}." });
        }

        // DELETE api/users/:id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            await _userManager.DeleteAsync(user);
            return NoContent();
        }
    }

    // ── Stats controller ──────────────────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class StatsController : ControllerBase
    {
        private readonly ApplicationDbContext          _db;
        private readonly UserManager<ApplicationUser>  _userManager;

        public StatsController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db          = db;
            _userManager = userManager;
        }

        // GET api/stats
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var totalEvents    = await _db.Events.CountAsync();
            var upcomingEvents = await _db.Events.CountAsync(e => e.Status == "Upcoming");
            var totalUsers     = await _userManager.Users.CountAsync();
            var totalRegs      = await _db.Registrations.CountAsync();

            return Ok(new StatsResponse
            {
                TotalEvents        = totalEvents,
                UpcomingEvents     = upcomingEvents,
                TotalUsers         = totalUsers,
                TotalRegistrations = totalRegs,
            });
        }
    }
}
