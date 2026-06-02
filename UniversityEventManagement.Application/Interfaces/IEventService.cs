using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Application.Interfaces;

public interface IEventService
{
    Task<List<EventDto>> GetAllAsync();
    Task<EventDto?> GetByIdAsync(int id);
    Task<EventDto> CreateAsync(EventDto request, string currentUserEmail, string currentUserName, string currentUserRole);
    Task<EventDto?> UpdateAsync(int id, EventDto request);
    Task<bool> DeleteAsync(int id);
}