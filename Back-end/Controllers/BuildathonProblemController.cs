using AuthBackend.Data;
using AuthBackend.DTOs;
using AuthBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class BuildathonProblemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BuildathonProblemController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBuildathonProblem([FromBody] CreateBuildathonProblemDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if challenge exists
            var challenge = await _context.Challenges.FindAsync(createDto.ChallengeId);
            if (challenge == null)
            {
                return NotFound(new { message = "Challenge not found" });
            }

            // Check if buildathon problem already exists for this challenge
            var existingProblem = await _context.BuildathonProblems
                .FirstOrDefaultAsync(bp => bp.ChallengeId == createDto.ChallengeId);
            
            if (existingProblem != null)
            {
                return BadRequest(new { message = "Buildathon problem already exists for this challenge" });
            }

            var problem = new BuildathonProblem
            {
                ChallengeId = createDto.ChallengeId,
                Title = createDto.Title,
                Description = createDto.Description,
                Requirements = createDto.Requirements,
                Deliverables = createDto.Deliverables,
                EvaluationCriteria = createDto.EvaluationCriteria,
                TimeLimit = createDto.TimeLimit,
                CreatedAt = DateTime.UtcNow
            };

            _context.BuildathonProblems.Add(problem);
            await _context.SaveChangesAsync();

            var problemDto = new BuildathonProblemDto
            {
                Id = problem.Id,
                ChallengeId = problem.ChallengeId,
                Title = problem.Title,
                Description = problem.Description,
                Requirements = problem.Requirements,
                Deliverables = problem.Deliverables,
                EvaluationCriteria = problem.EvaluationCriteria,
                TimeLimit = problem.TimeLimit,
                CreatedAt = problem.CreatedAt
            };

            return CreatedAtAction(nameof(GetBuildathonProblem), new { id = problem.Id }, problemDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuildathonProblem(int id)
        {
            var problem = await _context.BuildathonProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Buildathon problem not found" });
            }

            var problemDto = new BuildathonProblemDto
            {
                Id = problem.Id,
                ChallengeId = problem.ChallengeId,
                Title = problem.Title,
                Description = problem.Description,
                Requirements = problem.Requirements,
                Deliverables = problem.Deliverables,
                EvaluationCriteria = problem.EvaluationCriteria,
                TimeLimit = problem.TimeLimit,
                CreatedAt = problem.CreatedAt
            };

            return Ok(problemDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBuildathonProblem(int id, [FromBody] UpdateBuildathonProblemDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var problem = await _context.BuildathonProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Buildathon problem not found" });
            }

            problem.Title = updateDto.Title;
            problem.Description = updateDto.Description;
            problem.Requirements = updateDto.Requirements;
            problem.Deliverables = updateDto.Deliverables;
            problem.EvaluationCriteria = updateDto.EvaluationCriteria;
            problem.TimeLimit = updateDto.TimeLimit;

            await _context.SaveChangesAsync();

            return await GetBuildathonProblem(id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuildathonProblem(int id)
        {
            var problem = await _context.BuildathonProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Buildathon problem not found" });
            }

            _context.BuildathonProblems.Remove(problem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Buildathon problem deleted successfully" });
        }

        [HttpGet("challenge/{challengeId}")]
        public async Task<IActionResult> GetByChallenge(int challengeId)
        {
            var problem = await _context.BuildathonProblems
                .FirstOrDefaultAsync(bp => bp.ChallengeId == challengeId);

            if (problem == null)
            {
                return NotFound(new { message = "No buildathon problem found for this challenge" });
            }

            return await GetBuildathonProblem(problem.Id);
        }
    }
}
