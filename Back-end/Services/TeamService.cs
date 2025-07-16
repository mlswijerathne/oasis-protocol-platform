using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthBackend.Data;
using AuthBackend.DTOs;
using AuthBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AuthBackend.Services
{
    public class TeamService : ITeamService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public TeamService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool Success, string Message, TeamDto? Team)> RegisterTeamAsync(TeamRegistrationDto registration)
        {
            // Check if team name already exists
            if (await _context.Teams.AnyAsync(t => t.Name == registration.Name))
            {
                return (false, "Team name already exists", null);
            }

            // Check if email already exists
            if (await _context.Teams.AnyAsync(t => t.Email == registration.Email))
            {
                return (false, "Email already exists", null);
            }

            // Create new team
            var team = new Team
            {
                Name = registration.Name,
                Email = registration.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registration.Password),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            var teamDto = new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Email = team.Email,
                CreatedAt = team.CreatedAt,
                LastLoginAt = team.LastLoginAt,
                IsActive = team.IsActive,
                TotalPoints = 0,
                ChallengesCompleted = 0
            };

            return (true, "Team registered successfully", teamDto);
        }

        public async Task<(bool Success, string Message, string? Token)> LoginTeamAsync(TeamLoginDto login)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(t => t.Email == login.Email);
            
            if (team == null || !BCrypt.Net.BCrypt.Verify(login.Password, team.PasswordHash))
            {
                return (false, "Invalid email or password", null);
            }

            if (!team.IsActive)
            {
                return (false, "Team account is deactivated", null);
            }

            // Update last login
            team.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(team);
            
            return (true, "Login successful", token);
        }

        public async Task<List<TeamDto>> GetAllTeamsAsync()
        {
            return await _context.Teams
                .Select(t => new TeamDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Email = t.Email,
                    CreatedAt = t.CreatedAt,
                    LastLoginAt = t.LastLoginAt,
                    IsActive = t.IsActive,
                    TotalPoints = t.TeamChallenges.Sum(tc => tc.TotalPoints),
                    ChallengesCompleted = t.TeamChallenges.Count(tc => tc.BuildathonCompleted)
                })
                .OrderBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<TeamDto?> GetTeamByIdAsync(int id)
        {
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == id);

            if (team == null) return null;

            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Email = team.Email,
                CreatedAt = team.CreatedAt,
                LastLoginAt = team.LastLoginAt,
                IsActive = team.IsActive,
                TotalPoints = 0, // Set to 0 for now
                ChallengesCompleted = 0 // Set to 0 for now
            };
        }

        public async Task<TeamDto?> GetTeamByEmailAsync(string email)
        {
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Email == email);

            if (team == null) return null;

            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Email = team.Email,
                CreatedAt = team.CreatedAt,
                LastLoginAt = team.LastLoginAt,
                IsActive = team.IsActive,
                TotalPoints = 0, // Set to 0 for now
                ChallengesCompleted = 0 // Set to 0 for now
            };
        }

        public async Task<List<SubmissionDto>> GetTeamSubmissionsAsync(int teamId)
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

        public async Task<bool> UpdateTeamActivityAsync(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return false;

            team.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TeamProgressDto?> GetTeamProgressAsync(int teamId)
        {
            var team = await _context.Teams
                .Include(t => t.TeamChallenges)
                    .ThenInclude(tc => tc.Challenge)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null) return null;

            var lastSubmission = await _context.Submissions
                .Where(s => s.TeamId == teamId)
                .OrderByDescending(s => s.SubmittedAt)
                .FirstOrDefaultAsync();

            return new TeamProgressDto
            {
                TeamId = team.Id,
                TeamName = team.Name,
                TotalPoints = team.TeamChallenges.Sum(tc => tc.TotalPoints),
                ChallengesStarted = team.TeamChallenges.Count,
                ChallengesCompleted = team.TeamChallenges.Count(tc => tc.BuildathonCompleted),
                LastActivity = lastSubmission?.SubmittedAt,
                ChallengeProgress = team.TeamChallenges.Select(tc => new ChallengeProgressDto
                {
                    ChallengeId = tc.ChallengeId,
                    ChallengeTitle = tc.Challenge.Title,
                    AlgorithmicCompleted = tc.AlgorithmicCompleted,
                    BuildathonUnlocked = tc.BuildathonUnlocked,
                    BuildathonCompleted = tc.BuildathonCompleted,
                    Points = tc.TotalPoints,
                    StartedAt = tc.StartedAt,
                    CompletedAt = tc.CompletedAt
                }).ToList()
            };
        }

        private string GenerateJwtToken(Team team)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, team.Id.ToString()),
                new Claim(ClaimTypes.Name, team.Name),
                new Claim(ClaimTypes.Email, team.Email),
                new Claim(ClaimTypes.Role, "Team")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
