using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Application.DTOs;
using UniversityEventManagement.Application.Interfaces;
using UniversityEventManagement.Domain.Entities;
using UniversityEventManagement.Infrastructure.Data;

namespace UniversityEventManagement.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .OrderBy(u => u.Name)
            .Select(u => ToDto(u))
            .ToListAsync();
    }

    public async Task<UserDto?> UpdateRoleAsync(int id, RoleUpdateRequest request)
    {
        var allowedRoles = new[] { "Student", "Organizer", "Admin" };

        if (!allowedRoles.Contains(request.Role))
        {
            return null;
        }

        var user = await _context.Users.FindAsync(id);

        if (user is null)
        {
            return null;
        }

        user.Role = request.Role;

        await _context.SaveChangesAsync();

        return ToDto(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users
            .Include(u => u.Registrations)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
        {
            return false;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UserDto> GetOrCreateCurrentUserAsync(string email, string name, string role)
    {
        email = email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (user is not null)
        {
            user.Name = string.IsNullOrWhiteSpace(name) ? user.Name : name;
            user.Role = role;
            user.Status = "Active";

            await _context.SaveChangesAsync();

            return ToDto(user);
        }

        user = new User
        {
            Name = string.IsNullOrWhiteSpace(name) ? email : name,
            Email = email,
            Role = role,
            Status = "Active",
            JoinedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return ToDto(user);
    }

    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Status = user.Status,
            JoinedAt = user.JoinedAt.ToString("yyyy-MM-dd")
        };
    }
}