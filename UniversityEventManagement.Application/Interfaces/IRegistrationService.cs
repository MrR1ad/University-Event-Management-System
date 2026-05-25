using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Application.Interfaces;

public interface IRegistrationService
{
    Task<List<RegistrationDto>> GetAsync(int? eventId, string currentUserEmail, string currentUserName, string currentUserRole, bool isAdminOrOrganizer);
    Task<RegistrationDto?> RegisterAsync(RegisterRequest request, string currentUserEmail, string currentUserName, string currentUserRole);
    Task<string> CancelAsync(int id, string currentUserEmail, string currentUserName, string currentUserRole, bool isAdmin);
    Task<RegistrationDto?> CheckInAsync(int id);
}