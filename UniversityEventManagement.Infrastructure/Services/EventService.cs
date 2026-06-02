using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;
using UniversityEventManagement.Domain.Entities;
using UniversityEventManagement.Infrastructure.Data;

namespace UniversityEventManagement.Infrastructure.Services;

public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;
    private readonly IUserService _userService;

    public EventService(ApplicationDbContext context, IUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<List<EventDto>> GetAllAsync()
    {
        return await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Organizer)
            .Include(e => e.Registrations)
            .OrderBy(e => e.StartDate)
            .Select(e => ToDto(e))
            .ToListAsync();
    }

    public async Task<EventDto?> GetByIdAsync(int id)
    {
        var eventItem = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Organizer)
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Id == id);

        return eventItem is null ? null : ToDto(eventItem);
    }

    public async Task<EventDto> CreateAsync(EventDto request, string currentUserEmail, string currentUserName, string currentUserRole)
    {
        var organizer = await _userService.GetOrCreateCurrentUserAsync(
            currentUserEmail,
            currentUserName,
            currentUserRole
        );

        var venue = await _context.Venues.FindAsync(request.VenueId);

        var eventItem = new Event
        {
            Title = request.Title,
            Category = request.Category,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Capacity = request.Capacity,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Upcoming" : request.Status,
            VenueId = request.VenueId,
            OrganizerId = organizer.Id,
            Image = request.Image
        };

        _context.Events.Add(eventItem);
        await _context.SaveChangesAsync();

        eventItem.Venue = venue;
        eventItem.Organizer = await _context.Users.FindAsync(organizer.Id);

        return ToDto(eventItem);
    }

    public async Task<EventDto?> UpdateAsync(int id, EventDto request)
    {
        var existing = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Organizer)
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (existing is null)
        {
            return null;
        }

        existing.Title = request.Title;
        existing.Category = request.Category;
        existing.Description = request.Description;
        existing.StartDate = request.StartDate;
        existing.EndDate = request.EndDate;
        existing.Capacity = request.Capacity;
        existing.Status = string.IsNullOrWhiteSpace(request.Status) ? "Upcoming" : request.Status;
        existing.VenueId = request.VenueId;
        existing.Image = request.Image;

        await _context.SaveChangesAsync();

        existing = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Organizer)
            .Include(e => e.Registrations)
            .FirstAsync(e => e.Id == id);

        return ToDto(existing);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Events.FindAsync(id);

        if (existing is null)
        {
            return false;
        }

        _context.Events.Remove(existing);
        await _context.SaveChangesAsync();

        return true;
    }

    private static EventDto ToDto(Event eventItem)
    {
        return new EventDto
        {
            Id = eventItem.Id,
            Title = eventItem.Title,
            Category = eventItem.Category,
            Description = eventItem.Description,
            StartDate = eventItem.StartDate,
            EndDate = eventItem.EndDate,
            Capacity = eventItem.Capacity,
            Registered = eventItem.Registrations.Count(r => r.Status == "Confirmed"),
            Status = eventItem.Status,
            VenueId = eventItem.VenueId,
            VenueName = eventItem.Venue?.Name ?? string.Empty,
            OrganizerId = eventItem.OrganizerId ?? 0,
            OrganizerName = eventItem.Organizer?.Name ?? string.Empty,
            Image = eventItem.Image
        };
    }
}