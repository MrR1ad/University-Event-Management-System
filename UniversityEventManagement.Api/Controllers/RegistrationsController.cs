using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniversityEventManagement.Api.Mock;
using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RegistrationsController : ControllerBase
{

    [HttpGet]
    [Authorize(Policy = "AnyAppRole")]
    public IActionResult Get([FromQuery] int? userId, [FromQuery] int? eventId)
    {
        var query = MockDataStore.Registrations.AsEnumerable();

        if (userId.HasValue)
        {
            query = query.Where(r => r.UserId == userId.Value);
        }

        if (eventId.HasValue)
        {
            query = query.Where(r => r.EventId == eventId.Value);
        }

        var result = query.Select(AttachEventData).ToList();

        return Ok(result);
    }


    [HttpPost]
    [Authorize(Policy = "AdminOrStudent")]
    public IActionResult Register(RegisterRequest request)
    {
        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == request.EventId);

        if (eventItem is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        var existing = MockDataStore.Registrations.FirstOrDefault(r =>
            r.EventId == request.EventId &&
            r.UserId == request.UserId);

        if (existing is not null)
        {
            return Ok(AttachEventData(existing));
        }

        var user = MockDataStore.Users.FirstOrDefault(u => u.Id == request.UserId)
                   ?? MockDataStore.Users.First();

        var status = eventItem.Registered >= eventItem.Capacity
            ? "Waitlisted"
            : "Confirmed";

        var registration = new RegistrationDto
        {
            Id = MockDataStore.NextRegistrationId,
            EventId = eventItem.Id,
            UserId = user.Id,
            UserName = user.Name,
            RegisteredAt = DateTime.Now,
            CheckedIn = false,
            Status = status
        };

        MockDataStore.Registrations.Add(registration);

        if (status == "Confirmed")
        {
            eventItem.Registered += 1;
        }

        return Ok(AttachEventData(registration));
    }


    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOrStudent")]
    public IActionResult Cancel(int id)
    {
        var registration = MockDataStore.Registrations.FirstOrDefault(r => r.Id == id);

        if (registration is null)
        {
            return NotFound(new { message = "Registration not found." });
        }

        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == registration.EventId);

        if (eventItem is not null && registration.Status == "Confirmed")
        {
            eventItem.Registered = Math.Max(0, eventItem.Registered - 1);
        }

        MockDataStore.Registrations.Remove(registration);

        return NoContent();
    }

    [HttpPatch("{id:int}/checkin")]
    [Authorize(Policy = "AdminOrOrganizer")]
    public IActionResult CheckIn(int id)
    {
        var registration = MockDataStore.Registrations.FirstOrDefault(r => r.Id == id);

        if (registration is null)
        {
            return NotFound(new { message = "Registration not found." });
        }

        registration.CheckedIn = true;

        return Ok(AttachEventData(registration));
    }

    private static RegistrationDto AttachEventData(RegistrationDto registration)
    {
        var eventItem = MockDataStore.Events.FirstOrDefault(e => e.Id == registration.EventId);

        registration.EventTitle = eventItem?.Title ?? string.Empty;
        registration.StartDate = eventItem?.StartDate ?? default;
        registration.VenueName = eventItem?.VenueName ?? string.Empty;
        registration.Category = eventItem?.Category ?? string.Empty;

        return registration;
    }
}