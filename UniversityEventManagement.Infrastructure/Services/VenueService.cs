using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;
using UniversityEventManagement.Domain.Entities;
using UniversityEventManagement.Infrastructure.Data;

namespace UniversityEventManagement.Infrastructure.Services;

public class VenueService : IVenueService
{
    private readonly ApplicationDbContext _context;

    public VenueService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<VenueDto>> GetAllAsync()
    {
        return await _context.Venues
            .OrderBy(v => v.Name)
            .Select(v => ToDto(v))
            .ToListAsync();
    }

    public async Task<VenueDto> CreateAsync(VenueDto request)
    {
        var venue = new Venue
        {
            Name = request.Name,
            Location = request.Location,
            Capacity = request.Capacity
        };

        _context.Venues.Add(venue);
        await _context.SaveChangesAsync();

        return ToDto(venue);
    }

    public async Task<VenueDto?> UpdateAsync(int id, VenueDto request)
    {
        var venue = await _context.Venues.FindAsync(id);

        if (venue is null)
        {
            return null;
        }

        venue.Name = request.Name;
        venue.Location = request.Location;
        venue.Capacity = request.Capacity;

        await _context.SaveChangesAsync();

        return ToDto(venue);
    }

    public async Task<string> DeleteAsync(int id)
    {
        var venue = await _context.Venues
            .Include(v => v.Events)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (venue is null)
        {
            return "NotFound";
        }

        if (venue.Events.Any())
        {
            return "HasEvents";
        }

        _context.Venues.Remove(venue);
        await _context.SaveChangesAsync();

        return "Deleted";
    }

    private static VenueDto ToDto(Venue venue)
    {
        return new VenueDto
        {
            Id = venue.Id,
            Name = venue.Name,
            Location = venue.Location,
            Capacity = venue.Capacity
        };
    }
}