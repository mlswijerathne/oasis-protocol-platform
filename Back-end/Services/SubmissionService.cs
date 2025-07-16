using System.Text;
using System.Text.Json;
using AuthBackend.Data;
using AuthBackend.DTOs;
using AuthBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthBackend.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public SubmissionService(ApplicationDbContext context, HttpClient httpClient, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<SubmissionDto> CreateSubmissionAsync(int teamId, CreateSubmissionDto createDto)
        {
            var submission = new Submission
            {
                TeamId = teamId,
                ChallengeId = createDto.ChallengeId,
                Type = createDto.Type,
                Code = createDto.Code,
                Language = createDto.Language,
                FlagValue = createDto.FlagValue,
                GitHubLink = createDto.GitHubLink,
                Status = SubmissionStatus.Pending,
                SubmittedAt = DateTime.UtcNow
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            // Auto-evaluate if it's a flag submission
            if (createDto.Type == SubmissionType.Flag)
            {
                await EvaluateFlagSubmissionAsync(submission);
            }
            else if (createDto.Type == SubmissionType.Buildathon)
            {
                await EvaluateBuildathonSubmissionAsync(submission);
            }

            return await GetSubmissionByIdAsync(submission.Id) ?? new SubmissionDto();
        }

        public async Task<List<SubmissionDto>> GetAllSubmissionsAsync()
        {
            return await _context.Submissions
                .Include(s => s.Team)
                .Include(s => s.Challenge)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    TeamId = s.TeamId,
                    TeamName = s.Team.Name,
                    ChallengeId = s.ChallengeId,
                    ChallengeTitle = s.Challenge.Title,
                    Type = s.Type,
                    Code = s.Code,
                    Language = s.Language,
                    FlagValue = s.FlagValue,
                    GitHubLink = s.GitHubLink,
                    Status = s.Status,
                    Output = s.Output,
                    ErrorMessage = s.ErrorMessage,
                    ExecutionTime = s.ExecutionTime,
                    MemoryUsed = s.MemoryUsed,
                    Points = s.Points,
                    SubmittedAt = s.SubmittedAt,
                    EvaluatedAt = s.EvaluatedAt
                })
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();
        }

        public async Task<List<SubmissionDto>> GetSubmissionsByTeamAsync(int teamId)
        {
            return await _context.Submissions
                .Include(s => s.Team)
                .Include(s => s.Challenge)
                .Where(s => s.TeamId == teamId)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    TeamId = s.TeamId,
                    TeamName = s.Team.Name,
                    ChallengeId = s.ChallengeId,
                    ChallengeTitle = s.Challenge.Title,
                    Type = s.Type,
                    Code = s.Code,
                    Language = s.Language,
                    FlagValue = s.FlagValue,
                    GitHubLink = s.GitHubLink,
                    Status = s.Status,
                    Output = s.Output,
                    ErrorMessage = s.ErrorMessage,
                    ExecutionTime = s.ExecutionTime,
                    MemoryUsed = s.MemoryUsed,
                    Points = s.Points,
                    SubmittedAt = s.SubmittedAt,
                    EvaluatedAt = s.EvaluatedAt
                })
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();
        }

        public async Task<List<SubmissionDto>> GetSubmissionsByChallengeAsync(int challengeId)
        {
            return await _context.Submissions
                .Include(s => s.Team)
                .Include(s => s.Challenge)
                .Where(s => s.ChallengeId == challengeId)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    TeamId = s.TeamId,
                    TeamName = s.Team.Name,
                    ChallengeId = s.ChallengeId,
                    ChallengeTitle = s.Challenge.Title,
                    Type = s.Type,
                    Code = s.Code,
                    Language = s.Language,
                    FlagValue = s.FlagValue,
                    GitHubLink = s.GitHubLink,
                    Status = s.Status,
                    Output = s.Output,
                    ErrorMessage = s.ErrorMessage,
                    ExecutionTime = s.ExecutionTime,
                    MemoryUsed = s.MemoryUsed,
                    Points = s.Points,
                    SubmittedAt = s.SubmittedAt,
                    EvaluatedAt = s.EvaluatedAt
                })
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();
        }

        public async Task<SubmissionDto?> GetSubmissionByIdAsync(int id)
        {
            return await _context.Submissions
                .Include(s => s.Team)
                .Include(s => s.Challenge)
                .Where(s => s.Id == id)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    TeamId = s.TeamId,
                    TeamName = s.Team.Name,
                    ChallengeId = s.ChallengeId,
                    ChallengeTitle = s.Challenge.Title,
                    Type = s.Type,
                    Code = s.Code,
                    Language = s.Language,
                    FlagValue = s.FlagValue,
                    GitHubLink = s.GitHubLink,
                    Status = s.Status,
                    Output = s.Output,
                    ErrorMessage = s.ErrorMessage,
                    ExecutionTime = s.ExecutionTime,
                    MemoryUsed = s.MemoryUsed,
                    Points = s.Points,
                    SubmittedAt = s.SubmittedAt,
                    EvaluatedAt = s.EvaluatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ExecutionResultDto> ExecuteCodeAsync(CodeExecutionDto executionDto)
        {
            try
            {
                var languageId = GetLanguageId(executionDto.Language);
                var judge0Endpoint = _configuration["Judge0:Endpoint"];
                var judge0Token = _configuration["Judge0:Token"];

                var requestBody = new
                {
                    source_code = executionDto.Code,
                    language_id = languageId,
                    stdin = executionDto.Input,
                    cpu_time_limit = 2,
                    memory_limit = 128000
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("X-Auth-Token", judge0Token);

                var response = await _httpClient.PostAsync($"{judge0Endpoint}/submissions?wait=true", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

                return new ExecutionResultDto
                {
                    Output = result.TryGetProperty("stdout", out var stdout) ? stdout.GetString() : null,
                    ErrorMessage = result.TryGetProperty("stderr", out var stderr) ? stderr.GetString() : 
                                  result.TryGetProperty("compile_output", out var compile) ? compile.GetString() : null,
                    ExecutionTime = result.TryGetProperty("time", out var time) ? 
                                   (int?)(time.GetDecimal() * 1000) : null,
                    MemoryUsed = result.TryGetProperty("memory", out var memory) ? memory.GetInt32() : null,
                    Status = result.TryGetProperty("status", out var status) && 
                            status.TryGetProperty("description", out var desc) ? desc.GetString() ?? "Unknown" : "Unknown"
                };
            }
            catch (Exception ex)
            {
                return new ExecutionResultDto
                {
                    ErrorMessage = $"Execution error: {ex.Message}",
                    Status = "Error"
                };
            }
        }

        public async Task<(bool Success, string Message)> SubmitFlagAsync(int teamId, FlagSubmissionDto flagDto)
        {
            var submission = new Submission
            {
                TeamId = teamId,
                ChallengeId = flagDto.ChallengeId,
                Type = SubmissionType.Flag,
                FlagValue = flagDto.FlagValue,
                Status = SubmissionStatus.Pending,
                SubmittedAt = DateTime.UtcNow
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            var result = await EvaluateFlagSubmissionAsync(submission);
            return result ? (true, "Flag accepted! Buildathon phase unlocked.") : (false, "Invalid flag.");
        }

        public async Task<bool> EvaluateSubmissionAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .Include(s => s.Challenge)
                .ThenInclude(c => c.AlgorithmicProblem)
                .FirstOrDefaultAsync(s => s.Id == submissionId);

            if (submission == null) return false;

            if (submission.Type == SubmissionType.Flag)
            {
                return await EvaluateFlagSubmissionAsync(submission);
            }
            else if (submission.Type == SubmissionType.Algorithmic)
            {
                return await EvaluateAlgorithmicSubmissionAsync(submission);
            }
            else if (submission.Type == SubmissionType.Buildathon)
            {
                return await EvaluateBuildathonSubmissionAsync(submission);
            }

            return false;
        }

        private async Task<bool> EvaluateFlagSubmissionAsync(Submission submission)
        {
            var correctFlag = await _context.Flags
                .FirstOrDefaultAsync(f => f.ChallengeId == submission.ChallengeId && 
                                         f.IsActive && 
                                         f.Value == submission.FlagValue);

            if (correctFlag != null)
            {
                submission.Status = SubmissionStatus.Accepted;
                submission.Points = submission.Challenge?.Points ?? 0;
                submission.EvaluatedAt = DateTime.UtcNow;

                // Unlock buildathon phase
                await UnlockBuildathonPhaseAsync(submission.TeamId, submission.ChallengeId);
                
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                submission.Status = SubmissionStatus.WrongAnswer;
                submission.EvaluatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return false;
            }
        }

        private async Task<bool> EvaluateAlgorithmicSubmissionAsync(Submission submission)
        {
            // This would involve running the code against test cases
            // For now, we'll simulate the evaluation
            submission.Status = SubmissionStatus.Accepted;
            submission.Points = (submission.Challenge?.Points ?? 100) / 2; // Half points for algorithmic
            submission.EvaluatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<bool> EvaluateBuildathonSubmissionAsync(Submission submission)
        {
            // Validate GitHub link
            if (string.IsNullOrEmpty(submission.GitHubLink) || !IsValidGitHubUrl(submission.GitHubLink))
            {
                submission.Status = SubmissionStatus.Rejected;
                submission.ErrorMessage = "Invalid GitHub link";
                submission.EvaluatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return false;
            }

            submission.Status = SubmissionStatus.Accepted;
            submission.Points = (submission.Challenge?.Points ?? 100) / 2; // Half points for buildathon
            submission.EvaluatedAt = DateTime.UtcNow;

            // Mark buildathon as completed
            await CompleteBuildathonPhaseAsync(submission.TeamId, submission.ChallengeId);
            
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task UnlockBuildathonPhaseAsync(int teamId, int challengeId)
        {
            var teamChallenge = await _context.TeamChallenges
                .FirstOrDefaultAsync(tc => tc.TeamId == teamId && tc.ChallengeId == challengeId);

            if (teamChallenge == null)
            {
                teamChallenge = new TeamChallenge
                {
                    TeamId = teamId,
                    ChallengeId = challengeId,
                    StartedAt = DateTime.UtcNow
                };
                _context.TeamChallenges.Add(teamChallenge);
            }

            teamChallenge.AlgorithmicCompleted = true;
            teamChallenge.BuildathonUnlocked = true;
            await _context.SaveChangesAsync();
        }

        private async Task CompleteBuildathonPhaseAsync(int teamId, int challengeId)
        {
            var teamChallenge = await _context.TeamChallenges
                .FirstOrDefaultAsync(tc => tc.TeamId == teamId && tc.ChallengeId == challengeId);

            if (teamChallenge != null)
            {
                teamChallenge.BuildathonCompleted = true;
                teamChallenge.CompletedAt = DateTime.UtcNow;
                
                // Calculate total points for this challenge
                var totalPoints = await _context.Submissions
                    .Where(s => s.TeamId == teamId && s.ChallengeId == challengeId && s.Status == SubmissionStatus.Accepted)
                    .SumAsync(s => s.Points);
                
                teamChallenge.TotalPoints = totalPoints;
                await _context.SaveChangesAsync();
            }
        }

        private bool IsValidGitHubUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uri) && 
                   (uri.Host.Equals("github.com", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.Equals("www.github.com", StringComparison.OrdinalIgnoreCase));
        }

        private int GetLanguageId(string language)
        {
            return language.ToLower() switch
            {
                "c" => 50,
                "cpp" or "c++" => 54,
                "java" => 62,
                "python" or "python3" => 71,
                "javascript" or "js" => 63,
                "csharp" or "c#" => 51,
                "go" => 60,
                "rust" => 73,
                "php" => 68,
                "ruby" => 72,
                _ => 71 // Default to Python
            };
        }
    }
}
