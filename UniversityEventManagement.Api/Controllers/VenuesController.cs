using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VenuesController : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]

    public IActionResult GetAll()
    {
        return Ok(MockDataStore.Venues);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Create(VenueDto request)
    {
        request.Id = MockDataStore.NextVenueId;
        MockDataStore.Venues.Add(request);

        return Ok(request);
    }



    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Update(int id, VenueDto request)
    {
        var venue = MockDataStore.Venues.FirstOrDefault(v => v.Id == id);

        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        venue.Name = request.Name;
        venue.Location = request.Location;
        venue.Capacity = request.Capacity;

        foreach (var eventItem in MockDataStore.Events.Where(e => e.VenueId == id))
        {
            eventItem.VenueName = venue.Name;
        }

        return Ok(venue);
    }


    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Delete(int id)
    {
        var venue = MockDataStore.Venues.FirstOrDefault(v => v.Id == id);

        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        var venueHasEvents = MockDataStore.Events.Any(e => e.VenueId == id);

        if (venueHasEvents)
        {
            return BadRequest(new { message = "Cannot delete venue because events are assigned to it." });
        }

        MockDataStore.Venues.Remove(venue);

        return NoContent();
    }
}