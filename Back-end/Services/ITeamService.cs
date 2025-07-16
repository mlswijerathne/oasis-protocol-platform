using AuthBackend.DTOs;
using AuthBackend.Models;

namespace AuthBackend.Services
{
    public interface ITeamService
    {
        Task<(bool Success, string Message, TeamDto? Team)> RegisterTeamAsync(TeamRegistrationDto registration);
        Task<(bool Success, string Message, string? Token)> LoginTeamAsync(TeamLoginDto login);
        Task<List<TeamDto>> GetAllTeamsAsync();
        Task<TeamDto?> GetTeamByIdAsync(int id);
        Task<List<SubmissionDto>> GetTeamSubmissionsAsync(int teamId);
        Task<bool> UpdateTeamActivityAsync(int teamId);
        Task<TeamProgressDto?> GetTeamProgressAsync(int teamId);
    }
}
