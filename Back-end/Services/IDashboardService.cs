using AuthBackend.DTOs;

namespace AuthBackend.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(int limit = 10);
        Task<List<TeamProgressDto>> GetAllTeamProgressAsync();
    }
}
