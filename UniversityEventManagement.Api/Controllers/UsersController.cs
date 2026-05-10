using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(MockDataStore.Users);
    }

    [HttpPatch("{id:int}/role")]
    public IActionResult UpdateRole(int id, RoleUpdateRequest request)
    {
        var user = MockDataStore.Users.FirstOrDefault(u => u.Id == id);

        if (user is null)
        {
            return NotFound(new { message = "User not found." });
        }

        var allowedRoles = new[] { "Student", "Organizer", "Admin" };

        if (!allowedRoles.Contains(request.Role))
        {
            return BadRequest(new { message = "Invalid role." });
        }

        user.Role = request.Role;

        return Ok(user);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var user = MockDataStore.Users.FirstOrDefault(u => u.Id == id);

        if (user is null)
        {
            return NotFound(new { message = "User not found." });
        }

        MockDataStore.Users.Remove(user);
        MockDataStore.Registrations.RemoveAll(r => r.UserId == id);

        return NoContent();
    }
}