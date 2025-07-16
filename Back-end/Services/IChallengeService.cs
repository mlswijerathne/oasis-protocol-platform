using AuthBackend.DTOs;
using AuthBackend.Models;

namespace AuthBackend.Services
{
    public interface IChallengeService
    {
        Task<List<ChallengeListDto>> GetAllChallengesAsync();
        Task<ChallengeDto?> GetChallengeByIdAsync(int id);
        Task<ChallengeDto> CreateChallengeAsync(CreateChallengeDto createDto);
        Task<ChallengeDto?> UpdateChallengeAsync(int id, UpdateChallengeDto updateDto);
        Task<bool> DeleteChallengeAsync(int id);
        Task<List<ChallengeListDto>> GetActiveChallengesAsync();
        Task<ChallengeDto?> GetChallengeForTeamAsync(int challengeId, int teamId);
    }
}
