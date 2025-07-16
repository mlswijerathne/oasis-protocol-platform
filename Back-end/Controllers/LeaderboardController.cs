using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public LeaderboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [Authorize(Roles = "Team,Admin")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int limit = 50)
        {
            var leaderboard = await _dashboardService.GetLeaderboardAsync(limit);
            return Ok(leaderboard);
        }
    }
}
