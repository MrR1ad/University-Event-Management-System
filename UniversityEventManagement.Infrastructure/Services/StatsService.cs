using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Application.Interfaces;
using UniversityEventManagement.Infrastructure.Data;

namespace UniversityEventManagement.Infrastructure.Services;

public class StatsService : IStatsService
{
    private readonly ApplicationDbContext _context;

    public StatsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetAsync()
    {
        return new
        {
            totalEvents = await _context.Events.CountAsync(),
            upcomingEvents = await _context.Events.CountAsync(e => e.Status == "Upcoming"),
            totalUsers = await _context.Users.CountAsync(),
            totalRegistrations = await _context.Registrations.CountAsync()
        };
    }
}