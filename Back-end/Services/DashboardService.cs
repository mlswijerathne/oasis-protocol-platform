using AuthBackend.Data;
using AuthBackend.DTOs;
using AuthBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthBackend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var today = DateTime.UtcNow.Date;

            var stats = new DashboardStatsDto
            {
                TotalTeams = await _context.Teams.CountAsync(),
                ActiveTeams = await _context.Teams.CountAsync(t => t.IsActive),
                TotalChallenges = await _context.Challenges.CountAsync(),
                ActiveChallenges = await _context.Challenges.CountAsync(c => c.IsActive),
                TotalSubmissions = await _context.Submissions.CountAsync(),
                TodaySubmissions = await _context.Submissions.CountAsync(s => s.SubmittedAt.Date == today),
                TopTeams = await GetLeaderboardAsync(5),
                RecentSubmissions = await GetRecentSubmissionsAsync(10)
            };

            return stats;
        }

        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync(int limit = 10)
        {
            var leaderboard = await _context.Teams
                .Where(t => t.IsActive)
                .Select(t => new
                {
                    TeamId = t.Id,
                    TeamName = t.Name,
                    TotalPoints = t.TeamChallenges.Sum(tc => tc.TotalPoints),
                    ChallengesCompleted = t.TeamChallenges.Count(tc => tc.BuildathonCompleted),
                    LastSubmission = t.Submissions.OrderByDescending(s => s.SubmittedAt).FirstOrDefault() != null ?
                                   t.Submissions.OrderByDescending(s => s.SubmittedAt).First().SubmittedAt : (DateTime?)null
                })
                .OrderByDescending(t => t.TotalPoints)
                .ThenByDescending(t => t.ChallengesCompleted)
                .ThenBy(t => t.LastSubmission)
                .Take(limit)
                .ToListAsync();

            var result = new List<LeaderboardEntryDto>();
            for (int i = 0; i < leaderboard.Count; i++)
            {
                var team = leaderboard[i];
                result.Add(new LeaderboardEntryDto
                {
                    Rank = i + 1,
                    TeamId = team.TeamId,
                    TeamName = team.TeamName,
                    TotalPoints = team.TotalPoints,
                    ChallengesCompleted = team.ChallengesCompleted,
                    LastSubmission = team.LastSubmission
                });
            }

            return result;
        }

        public async Task<List<TeamProgressDto>> GetAllTeamProgressAsync()
        {
            var teams = await _context.Teams
                .Include(t => t.TeamChallenges)
                    .ThenInclude(tc => tc.Challenge)
                .Include(t => t.Submissions)
                .Where(t => t.IsActive)
                .ToListAsync();

            var result = new List<TeamProgressDto>();

            foreach (var team in teams)
            {
                var lastSubmission = team.Submissions.OrderByDescending(s => s.SubmittedAt).FirstOrDefault();

                var teamProgress = new TeamProgressDto
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

                result.Add(teamProgress);
            }

            return result.OrderByDescending(tp => tp.TotalPoints)
                        .ThenByDescending(tp => tp.ChallengesCompleted)
                        .ToList();
        }

        private async Task<List<RecentSubmissionDto>> GetRecentSubmissionsAsync(int limit)
        {
            return await _context.Submissions
                .Include(s => s.Team)
                .Include(s => s.Challenge)
                .OrderByDescending(s => s.SubmittedAt)
                .Take(limit)
                .Select(s => new RecentSubmissionDto
                {
                    Id = s.Id,
                    TeamName = s.Team.Name,
                    ChallengeTitle = s.Challenge.Title,
                    Type = s.Type.ToString(),
                    Status = s.Status.ToString(),
                    SubmittedAt = s.SubmittedAt
                })
                .ToListAsync();
        }
    }
}
