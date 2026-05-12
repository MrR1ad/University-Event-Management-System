using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class StatsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            totalEvents = MockDataStore.Events.Count,
            upcomingEvents = MockDataStore.Events.Count(e => e.Status == "Upcoming"),
            totalUsers = MockDataStore.Users.Count,
            totalRegistrations = MockDataStore.Registrations.Count
        });
    }
}