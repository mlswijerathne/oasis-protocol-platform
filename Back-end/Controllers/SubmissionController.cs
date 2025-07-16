using AuthBackend.DTOs;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;

        public SubmissionController(ISubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [HttpPost]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> CreateSubmission([FromBody] CreateSubmissionDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var submission = await _submissionService.CreateSubmissionAsync(teamId, createDto);
            
            return CreatedAtAction(nameof(GetSubmission), new { id = submission.Id }, submission);
        }

        [HttpPost("execute")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> ExecuteCode([FromBody] CodeExecutionDto executionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _submissionService.ExecuteCodeAsync(executionDto);
            return Ok(result);
        }

        [HttpPost("flag")]
        [Authorize(Roles = "Team")]
        public async Task<IActionResult> SubmitFlag([FromBody] FlagSubmissionDto flagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _submissionService.SubmitFlagAsync(teamId, flagDto);
            
            if (result.Success)
            {
                return Ok(new { message = result.Message });
            }

            return BadRequest(new { message = result.Message });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Team,Admin")]
        public async Task<IActionResult> GetSubmission(int id)
        {
            var submission = await _submissionService.GetSubmissionByIdAsync(id);
            
            if (submission == null)
            {
                return NotFound(new { message = "Submission not found" });
            }

            // Teams can only view their own submissions
            if (User.IsInRole("Team"))
            {
                var teamId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (submission.TeamId != teamId)
                {
                    return Forbid();
                }
            }

            return Ok(submission);
        }

        [HttpGet("team/{teamId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTeamSubmissions(int teamId)
        {
            var submissions = await _submissionService.GetSubmissionsByTeamAsync(teamId);
            return Ok(submissions);
        }

        [HttpGet("challenge/{challengeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetChallengeSubmissions(int challengeId)
        {
            var submissions = await _submissionService.GetSubmissionsByChallengeAsync(challengeId);
            return Ok(submissions);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _submissionService.GetAllSubmissionsAsync();
            return Ok(submissions);
        }

        [HttpPost("admin/{id}/evaluate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EvaluateSubmission(int id)
        {
            var result = await _submissionService.EvaluateSubmissionAsync(id);
            
            if (result)
            {
                return Ok(new { message = "Submission evaluated successfully" });
            }

            return BadRequest(new { message = "Failed to evaluate submission" });
        }
    }
}
