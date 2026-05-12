using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public IActionResult GetAll()
    {
        return Ok(MockDataStore.Events.OrderBy(e => e.StartDate));
    }



    [HttpGet("{id:int}")]
    [Authorize(Policy = "AnyAppRole")]
    public IActionResult GetById(int id)
    {
        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == id);

        if (eventItem is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        return Ok(eventItem);
    }


    [HttpPost]
    [Authorize(Policy = "AdminOrOrganizer")]
    public IActionResult Create(EventDto request)
    {
        var venue = MockDataStore.Venues.FirstOrDefault(v => v.Id == request.VenueId);

        request.Id = MockDataStore.NextEventId;
        request.Registered = 0;
        request.VenueName = venue?.Name ?? request.VenueName;
        request.Status = string.IsNullOrWhiteSpace(request.Status) ? "Upcoming" : request.Status;

        MockDataStore.Events.Add(request);

        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }


    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public IActionResult Update(int id, EventDto request)
    {
        var existing = MockDataStore.Events.FirstOrDefault(e => e.Id == id);

        if (existing is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        var venue = MockDataStore.Venues.FirstOrDefault(v => v.Id == request.VenueId);

        existing.Title = request.Title;
        existing.Category = request.Category;
        existing.Description = request.Description;
        existing.StartDate = request.StartDate;
        existing.EndDate = request.EndDate;
        existing.Capacity = request.Capacity;
        existing.Status = request.Status;
        existing.VenueId = request.VenueId;
        existing.VenueName = venue?.Name ?? request.VenueName;
        existing.OrganizerId = request.OrganizerId;
        existing.OrganizerName = request.OrganizerName;

        return Ok(existing);
    }


    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public IActionResult Delete(int id)
    {
        var existing = MockDataStore.Events.FirstOrDefault(e => e.Id == id);

        if (existing is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        MockDataStore.Events.Remove(existing);
        MockDataStore.Registrations.RemoveAll(r => r.EventId == id);

        return NoContent();
    }
}