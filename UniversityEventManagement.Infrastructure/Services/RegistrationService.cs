using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;
using UniversityEventManagement.Domain.Entities;
using UniversityEventManagement.Infrastructure.Data;

namespace UniversityEventManagement.Infrastructure.Services;

public class RegistrationService : IRegistrationService
{
    private readonly ApplicationDbContext _context;
    private readonly IUserService _userService;

    public RegistrationService(ApplicationDbContext context, IUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<List<RegistrationDto>> GetAsync(
        int? eventId,
        string currentUserEmail,
        string currentUserName,
        string currentUserRole,
        bool isAdminOrOrganizer)
    {
        var currentUser = await _userService.GetOrCreateCurrentUserAsync(
            currentUserEmail,
            currentUserName,
            currentUserRole
        );

        var query = _context.Registrations
            .Include(r => r.Event)
                .ThenInclude(e => e!.Venue)
            .Include(r => r.User)
            .AsQueryable();

        if (isAdminOrOrganizer && eventId.HasValue)
        {
            query = query.Where(r => r.EventId == eventId.Value);
        }
        else
        {
            query = query.Where(r => r.UserId == currentUser.Id);
        }

        return await query
            .OrderByDescending(r => r.RegisteredAt)
            .Select(r => ToDto(r))
            .ToListAsync();
    }

    public async Task<RegistrationDto?> RegisterAsync(
        RegisterRequest request,
        string currentUserEmail,
        string currentUserName,
        string currentUserRole)
    {
        var currentUser = await _userService.GetOrCreateCurrentUserAsync(
            currentUserEmail,
            currentUserName,
            currentUserRole
        );

        var eventItem = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Registrations)
            .FirstOrDefaultAsync(e => e.Id == request.EventId);

        if (eventItem is null)
        {
            return null;
        }

        var existing = await _context.Registrations
            .Include(r => r.Event)
                .ThenInclude(e => e!.Venue)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.EventId == request.EventId && r.UserId == currentUser.Id);

        if (existing is not null)
        {
            return ToDto(existing);
        }

        var confirmedCount = eventItem.Registrations.Count(r => r.Status == "Confirmed");
        var status = confirmedCount >= eventItem.Capacity ? "Waitlisted" : "Confirmed";

        var registration = new Registration
        {
            EventId = eventItem.Id,
            UserId = currentUser.Id,
            RegisteredAt = DateTime.UtcNow,
            CheckedIn = false,
            Status = status
        };

        _context.Registrations.Add(registration);
        await _context.SaveChangesAsync();

        registration = await _context.Registrations
            .Include(r => r.Event)
                .ThenInclude(e => e!.Venue)
            .Include(r => r.User)
            .FirstAsync(r => r.Id == registration.Id);

        return ToDto(registration);
    }

    public async Task<string> CancelAsync(
        int id,
        string currentUserEmail,
        string currentUserName,
        string currentUserRole,
        bool isAdmin)
    {
        var currentUser = await _userService.GetOrCreateCurrentUserAsync(
            currentUserEmail,
            currentUserName,
            currentUserRole
        );

        var registration = await _context.Registrations.FindAsync(id);

        if (registration is null)
        {
            return "NotFound";
        }

        if (!isAdmin && registration.UserId != currentUser.Id)
        {
            return "Forbidden";
        }

        _context.Registrations.Remove(registration);
        await _context.SaveChangesAsync();

        return "Deleted";
    }

    public async Task<RegistrationDto?> CheckInAsync(int id)
    {
        var registration = await _context.Registrations
            .Include(r => r.Event)
                .ThenInclude(e => e!.Venue)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registration is null)
        {
            return null;
        }

        registration.CheckedIn = true;

        await _context.SaveChangesAsync();

        return ToDto(registration);
    }

    private static RegistrationDto ToDto(Registration registration)
    {
        return new RegistrationDto
        {
            Id = registration.Id,
            EventId = registration.EventId,
            UserId = registration.UserId,
            UserName = registration.User?.Name ?? string.Empty,
            RegisteredAt = registration.RegisteredAt,
            CheckedIn = registration.CheckedIn,
            Status = registration.Status,
            EventTitle = registration.Event?.Title ?? string.Empty,
            StartDate = registration.Event?.StartDate ?? default,
            VenueName = registration.Event?.Venue?.Name ?? string.Empty,
            Category = registration.Event?.Category ?? string.Empty
        };
    }
}