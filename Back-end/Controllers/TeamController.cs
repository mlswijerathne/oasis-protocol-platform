using AuthBackend.DTOs;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] TeamRegistrationDto registration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _teamService.RegisterTeamAsync(registration);
            
            if (result.Success)
            {
                return Ok(new { message = result.Message, team = result.Team });
            }

            return BadRequest(new { message = result.Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] TeamLoginDto login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _teamService.LoginTeamAsync(login);
            
            if (result.Success)
            {
                return Ok(new { message = result.Message, token = result.Token });
            }

            return BadRequest(new { message = result.Message });
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> GetProfile()
        {
            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var team = await _teamService.GetTeamByIdAsync(teamId);
            
            if (team == null)
            {
                return NotFound(new { message = "Team not found" });
            }

            return Ok(team);
        }

        [HttpGet("progress")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> GetProgress()
        {
            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var progress = await _teamService.GetTeamProgressAsync(teamId);
            
            if (progress == null)
            {
                return NotFound(new { message = "Team not found" });
            }

            return Ok(progress);
        }

        [HttpGet("submissions")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> GetSubmissions()
        {
            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var submissions = await _teamService.GetTeamSubmissionsAsync(teamId);
            
            return Ok(submissions);
        }

        [HttpPost("activity")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> UpdateActivity()
        {
            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _teamService.UpdateTeamActivityAsync(teamId);
            
            return Ok(new { success = result });
        }
    }
}
