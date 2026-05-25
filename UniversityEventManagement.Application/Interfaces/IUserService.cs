using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Application.Interfaces;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto?> UpdateRoleAsync(int id, RoleUpdateRequest request);
    Task<bool> DeleteAsync(int id);
    Task<UserDto> GetOrCreateCurrentUserAsync(string email, string name, string role);
}