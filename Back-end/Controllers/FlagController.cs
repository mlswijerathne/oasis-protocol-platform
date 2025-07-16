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
    public class FlagController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FlagController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlag([FromBody] CreateFlagDto createDto)
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

            var flag = new Flag
            {
                ChallengeId = createDto.ChallengeId,
                Value = createDto.Value,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Flags.Add(flag);
            await _context.SaveChangesAsync();

            var flagDto = new FlagDto
            {
                Id = flag.Id,
                ChallengeId = flag.ChallengeId,
                Value = flag.Value,
                IsActive = flag.IsActive,
                CreatedAt = flag.CreatedAt
            };

            return CreatedAtAction(nameof(GetFlag), new { id = flag.Id }, flagDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlag(int id)
        {
            var flag = await _context.Flags.FindAsync(id);
            
            if (flag == null)
            {
                return NotFound(new { message = "Flag not found" });
            }

            var flagDto = new FlagDto
            {
                Id = flag.Id,
                ChallengeId = flag.ChallengeId,
                Value = flag.Value,
                IsActive = flag.IsActive,
                CreatedAt = flag.CreatedAt
            };

            return Ok(flagDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlag(int id, [FromBody] UpdateFlagDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var flag = await _context.Flags.FindAsync(id);
            
            if (flag == null)
            {
                return NotFound(new { message = "Flag not found" });
            }

            flag.Value = updateDto.Value;
            flag.IsActive = updateDto.IsActive;

            await _context.SaveChangesAsync();

            return await GetFlag(id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlag(int id)
        {
            var flag = await _context.Flags.FindAsync(id);
            
            if (flag == null)
            {
                return NotFound(new { message = "Flag not found" });
            }

            _context.Flags.Remove(flag);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Flag deleted successfully" });
        }

        [HttpGet("challenge/{challengeId}")]
        public async Task<IActionResult> GetFlagsByChallenge(int challengeId)
        {
            var flags = await _context.Flags
                .Where(f => f.ChallengeId == challengeId)
                .Select(f => new FlagDto
                {
                    Id = f.Id,
                    ChallengeId = f.ChallengeId,
                    Value = f.Value,
                    IsActive = f.IsActive,
                    CreatedAt = f.CreatedAt
                })
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return Ok(flags);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFlags()
        {
            var flags = await _context.Flags
                .Include(f => f.Challenge)
                .Select(f => new
                {
                    Id = f.Id,
                    ChallengeId = f.ChallengeId,
                    ChallengeTitle = f.Challenge.Title,
                    Value = f.Value,
                    IsActive = f.IsActive,
                    CreatedAt = f.CreatedAt
                })
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return Ok(flags);
        }
    }
}
