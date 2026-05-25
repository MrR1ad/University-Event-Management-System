using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;

namespace UniversityEventManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VenuesController : ControllerBase
{
    private readonly IVenueService _venueService;

    public VenuesController(IVenueService venueService)
    {
        _venueService = venueService;
    }

    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public async Task<IActionResult> GetAll()
    {
        var venues = await _venueService.GetAllAsync();
        return Ok(venues);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create(VenueDto request)
    {
        var venue = await _venueService.CreateAsync(request);
        return Ok(venue);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(int id, VenueDto request)
    {
        var venue = await _venueService.UpdateAsync(id, request);

        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        return Ok(venue);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _venueService.DeleteAsync(id);

        if (result == "NotFound")
        {
            return NotFound(new { message = "Venue not found." });
        }

        if (result == "HasEvents")
        {
            return BadRequest(new { message = "Cannot delete venue because events are assigned to it." });
        }

        return NoContent();
    }
}