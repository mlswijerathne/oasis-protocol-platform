using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ITeamService _teamService;

        public DashboardController(IDashboardService dashboardService, ITeamService teamService)
        {
            _dashboardService = dashboardService;
            _teamService = teamService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int limit = 10)
        {
            var leaderboard = await _dashboardService.GetLeaderboardAsync(limit);
            return Ok(leaderboard);
        }

        [HttpGet("teams")]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams = await _teamService.GetAllTeamsAsync();
            return Ok(teams);
        }

        [HttpGet("teams/progress")]
        public async Task<IActionResult> GetAllTeamProgress()
        {
            var progress = await _dashboardService.GetAllTeamProgressAsync();
            return Ok(progress);
        }

        [HttpGet("teams/{id}/progress")]
        public async Task<IActionResult> GetTeamProgress(int id)
        {
            var progress = await _teamService.GetTeamProgressAsync(id);
            
            if (progress == null)
            {
                return NotFound(new { message = "Team not found" });
            }

            return Ok(progress);
        }

        [HttpGet("teams/{id}/submissions")]
        public async Task<IActionResult> GetTeamSubmissions(int id)
        {
            var submissions = await _teamService.GetTeamSubmissionsAsync(id);
            return Ok(submissions);
        }
    }
}
