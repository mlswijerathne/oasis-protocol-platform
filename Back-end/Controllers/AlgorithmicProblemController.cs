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
    public class AlgorithmicProblemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AlgorithmicProblemController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAlgorithmicProblem([FromBody] CreateAlgorithmicProblemDto createDto)
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

            // Check if algorithmic problem already exists for this challenge
            var existingProblem = await _context.AlgorithmicProblems
                .FirstOrDefaultAsync(ap => ap.ChallengeId == createDto.ChallengeId);
            
            if (existingProblem != null)
            {
                return BadRequest(new { message = "Algorithmic problem already exists for this challenge" });
            }

            var problem = new AlgorithmicProblem
            {
                ChallengeId = createDto.ChallengeId,
                Title = createDto.Title,
                ProblemStatement = createDto.ProblemStatement,
                InputFormat = createDto.InputFormat,
                OutputFormat = createDto.OutputFormat,
                Constraints = createDto.Constraints,
                SampleInput = createDto.SampleInput,
                SampleOutput = createDto.SampleOutput,
                TestCases = createDto.TestCases,
                TimeLimit = createDto.TimeLimit,
                MemoryLimit = createDto.MemoryLimit,
                CreatedAt = DateTime.UtcNow
            };

            _context.AlgorithmicProblems.Add(problem);
            await _context.SaveChangesAsync();

            var problemDto = new AlgorithmicProblemDto
            {
                Id = problem.Id,
                ChallengeId = problem.ChallengeId,
                Title = problem.Title,
                ProblemStatement = problem.ProblemStatement,
                InputFormat = problem.InputFormat,
                OutputFormat = problem.OutputFormat,
                Constraints = problem.Constraints,
                SampleInput = problem.SampleInput,
                SampleOutput = problem.SampleOutput,
                TestCases = problem.TestCases,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                CreatedAt = problem.CreatedAt
            };

            return CreatedAtAction(nameof(GetAlgorithmicProblem), new { id = problem.Id }, problemDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlgorithmicProblem(int id)
        {
            var problem = await _context.AlgorithmicProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Algorithmic problem not found" });
            }

            var problemDto = new AlgorithmicProblemDto
            {
                Id = problem.Id,
                ChallengeId = problem.ChallengeId,
                Title = problem.Title,
                ProblemStatement = problem.ProblemStatement,
                InputFormat = problem.InputFormat,
                OutputFormat = problem.OutputFormat,
                Constraints = problem.Constraints,
                SampleInput = problem.SampleInput,
                SampleOutput = problem.SampleOutput,
                TestCases = problem.TestCases,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                CreatedAt = problem.CreatedAt
            };

            return Ok(problemDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAlgorithmicProblem(int id, [FromBody] UpdateAlgorithmicProblemDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var problem = await _context.AlgorithmicProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Algorithmic problem not found" });
            }

            problem.Title = updateDto.Title;
            problem.ProblemStatement = updateDto.ProblemStatement;
            problem.InputFormat = updateDto.InputFormat;
            problem.OutputFormat = updateDto.OutputFormat;
            problem.Constraints = updateDto.Constraints;
            problem.SampleInput = updateDto.SampleInput;
            problem.SampleOutput = updateDto.SampleOutput;
            problem.TestCases = updateDto.TestCases;
            problem.TimeLimit = updateDto.TimeLimit;
            problem.MemoryLimit = updateDto.MemoryLimit;

            await _context.SaveChangesAsync();

            return await GetAlgorithmicProblem(id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlgorithmicProblem(int id)
        {
            var problem = await _context.AlgorithmicProblems.FindAsync(id);
            
            if (problem == null)
            {
                return NotFound(new { message = "Algorithmic problem not found" });
            }

            _context.AlgorithmicProblems.Remove(problem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Algorithmic problem deleted successfully" });
        }

        [HttpGet("challenge/{challengeId}")]
        public async Task<IActionResult> GetByChallenge(int challengeId)
        {
            var problem = await _context.AlgorithmicProblems
                .FirstOrDefaultAsync(ap => ap.ChallengeId == challengeId);

            if (problem == null)
            {
                return NotFound(new { message = "No algorithmic problem found for this challenge" });
            }

            return await GetAlgorithmicProblem(problem.Id);
        }
    }
}
