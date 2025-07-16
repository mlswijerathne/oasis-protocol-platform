using AuthBackend.DTOs;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChallengeController : ControllerBase
    {
        private readonly IChallengeService _challengeService;

        public ChallengeController(IChallengeService challengeService)
        {
            _challengeService = challengeService;
        }

        [HttpGet]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> GetActiveChallenges()
        {
            var challenges = await _challengeService.GetActiveChallengesAsync();
            return Ok(challenges);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> GetChallenge(int id)
        {
            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var challenge = await _challengeService.GetChallengeForTeamAsync(id, teamId);
            
            if (challenge == null)
            {
                return NotFound(new { message = "Challenge not found or not accessible" });
            }

            return Ok(challenge);
        }

        // Admin-only endpoints
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllChallenges()
        {
            var challenges = await _challengeService.GetAllChallengesAsync();
            return Ok(challenges);
        }

        [HttpGet("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetChallengeForAdmin(int id)
        {
            var challenge = await _challengeService.GetChallengeByIdAsync(id);
            
            if (challenge == null)
            {
                return NotFound(new { message = "Challenge not found" });
            }

            return Ok(challenge);
        }

        [HttpPost("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateChallenge([FromBody] CreateChallengeDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var challenge = await _challengeService.CreateChallengeAsync(createDto);
            return CreatedAtAction(nameof(GetChallengeForAdmin), new { id = challenge.Id }, challenge);
        }

        [HttpPut("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateChallenge(int id, [FromBody] UpdateChallengeDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var challenge = await _challengeService.UpdateChallengeAsync(id, updateDto);
            
            if (challenge == null)
            {
                return NotFound(new { message = "Challenge not found" });
            }

            return Ok(challenge);
        }

        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteChallenge(int id)
        {
            var result = await _challengeService.DeleteChallengeAsync(id);
            
            if (!result)
            {
                return NotFound(new { message = "Challenge not found" });
            }

            return Ok(new { message = "Challenge deleted successfully" });
        }
    }
}
