using UniversityEventManagement.Application.DTOs;

namespace UniversityEventManagement.Application.Interfaces;

public interface IVenueService
{
    Task<List<VenueDto>> GetAllAsync();
    Task<VenueDto> CreateAsync(VenueDto request);
    Task<VenueDto?> UpdateAsync(int id, VenueDto request);
    Task<string> DeleteAsync(int id);
}