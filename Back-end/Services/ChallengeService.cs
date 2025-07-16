using AuthBackend.Data;
using AuthBackend.DTOs;
using AuthBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthBackend.Services
{
    public class ChallengeService : IChallengeService
    {
        private readonly ApplicationDbContext _context;

        public ChallengeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChallengeListDto>> GetAllChallengesAsync()
        {
            return await _context.Challenges
                .Include(c => c.AlgorithmicProblem)
                .Include(c => c.BuildathonProblem)
                .Include(c => c.Flags)
                .Include(c => c.Submissions)
                .Select(c => new ChallengeListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Points = c.Points,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    HasAlgorithmicProblem = c.AlgorithmicProblem != null,
                    HasBuildathonProblem = c.BuildathonProblem != null,
                    FlagCount = c.Flags.Count(f => f.IsActive),
                    SubmissionCount = c.Submissions.Count
                })
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<ChallengeDto?> GetChallengeByIdAsync(int id)
        {
            var challenge = await _context.Challenges
                .Include(c => c.AlgorithmicProblem)
                .Include(c => c.BuildathonProblem)
                .Include(c => c.Flags.Where(f => f.IsActive))
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null) return null;

            return new ChallengeDto
            {
                Id = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Points = challenge.Points,
                IsActive = challenge.IsActive,
                CreatedAt = challenge.CreatedAt,
                UpdatedAt = challenge.UpdatedAt,
                AlgorithmicProblem = challenge.AlgorithmicProblem != null ? new AlgorithmicProblemDto
                {
                    Id = challenge.AlgorithmicProblem.Id,
                    ChallengeId = challenge.AlgorithmicProblem.ChallengeId,
                    Title = challenge.AlgorithmicProblem.Title,
                    ProblemStatement = challenge.AlgorithmicProblem.ProblemStatement,
                    InputFormat = challenge.AlgorithmicProblem.InputFormat,
                    OutputFormat = challenge.AlgorithmicProblem.OutputFormat,
                    Constraints = challenge.AlgorithmicProblem.Constraints,
                    SampleInput = challenge.AlgorithmicProblem.SampleInput,
                    SampleOutput = challenge.AlgorithmicProblem.SampleOutput,
                    TestCases = challenge.AlgorithmicProblem.TestCases,
                    TimeLimit = challenge.AlgorithmicProblem.TimeLimit,
                    MemoryLimit = challenge.AlgorithmicProblem.MemoryLimit,
                    CreatedAt = challenge.AlgorithmicProblem.CreatedAt
                } : null,
                BuildathonProblem = challenge.BuildathonProblem != null ? new BuildathonProblemDto
                {
                    Id = challenge.BuildathonProblem.Id,
                    ChallengeId = challenge.BuildathonProblem.ChallengeId,
                    Title = challenge.BuildathonProblem.Title,
                    Description = challenge.BuildathonProblem.Description,
                    Requirements = challenge.BuildathonProblem.Requirements,
                    Deliverables = challenge.BuildathonProblem.Deliverables,
                    EvaluationCriteria = challenge.BuildathonProblem.EvaluationCriteria,
                    TimeLimit = challenge.BuildathonProblem.TimeLimit,
                    CreatedAt = challenge.BuildathonProblem.CreatedAt
                } : null,
                Flags = challenge.Flags.Select(f => new FlagDto
                {
                    Id = f.Id,
                    ChallengeId = f.ChallengeId,
                    Value = f.Value,
                    IsActive = f.IsActive,
                    CreatedAt = f.CreatedAt
                }).ToList()
            };
        }

        public async Task<ChallengeDto> CreateChallengeAsync(CreateChallengeDto createDto)
        {
            var challenge = new Challenge
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Points = createDto.Points,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            return new ChallengeDto
            {
                Id = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Points = challenge.Points,
                IsActive = challenge.IsActive,
                CreatedAt = challenge.CreatedAt,
                UpdatedAt = challenge.UpdatedAt,
                AlgorithmicProblem = null,
                BuildathonProblem = null,
                Flags = new List<FlagDto>()
            };
        }

        public async Task<ChallengeDto?> UpdateChallengeAsync(int id, UpdateChallengeDto updateDto)
        {
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null) return null;

            challenge.Title = updateDto.Title;
            challenge.Description = updateDto.Description;
            challenge.Points = updateDto.Points;
            challenge.IsActive = updateDto.IsActive;
            challenge.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetChallengeByIdAsync(id);
        }

        public async Task<bool> DeleteChallengeAsync(int id)
        {
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null) return false;

            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ChallengeListDto>> GetActiveChallengesAsync()
        {
            return await _context.Challenges
                .Include(c => c.AlgorithmicProblem)
                .Include(c => c.BuildathonProblem)
                .Include(c => c.Flags)
                .Include(c => c.Submissions)
                .Where(c => c.IsActive)
                .Select(c => new ChallengeListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Points = c.Points,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    HasAlgorithmicProblem = c.AlgorithmicProblem != null,
                    HasBuildathonProblem = c.BuildathonProblem != null,
                    FlagCount = c.Flags.Count(f => f.IsActive),
                    SubmissionCount = c.Submissions.Count
                })
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<ChallengeDto?> GetChallengeForTeamAsync(int challengeId, int teamId)
        {
            var challenge = await GetChallengeByIdAsync(challengeId);
            if (challenge == null || !challenge.IsActive) return null;

            // Check if team has unlocked buildathon phase
            var teamChallenge = await _context.TeamChallenges
                .FirstOrDefaultAsync(tc => tc.TeamId == teamId && tc.ChallengeId == challengeId);

            // If buildathon is not unlocked, hide buildathon problem
            if (teamChallenge == null || !teamChallenge.BuildathonUnlocked)
            {
                challenge.BuildathonProblem = null;
            }

            return challenge;
        }
    }
}
