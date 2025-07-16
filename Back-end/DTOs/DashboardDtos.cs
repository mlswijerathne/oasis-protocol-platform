namespace AuthBackend.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalTeams { get; set; }
        public int ActiveTeams { get; set; }
        public int TotalChallenges { get; set; }
        public int ActiveChallenges { get; set; }
        public int TotalSubmissions { get; set; }
        public int TodaySubmissions { get; set; }
        public List<LeaderboardEntryDto> TopTeams { get; set; } = new List<LeaderboardEntryDto>();
        public List<RecentSubmissionDto> RecentSubmissions { get; set; } = new List<RecentSubmissionDto>();
    }

    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int ChallengesCompleted { get; set; }
        public DateTime? LastSubmission { get; set; }
    }

    public class RecentSubmissionDto
    {
        public int Id { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string ChallengeTitle { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }

    public class TeamProgressDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int ChallengesStarted { get; set; }
        public int ChallengesCompleted { get; set; }
        public DateTime? LastActivity { get; set; }
        public List<ChallengeProgressDto> ChallengeProgress { get; set; } = new List<ChallengeProgressDto>();
    }

    public class ChallengeProgressDto
    {
        public int ChallengeId { get; set; }
        public string ChallengeTitle { get; set; } = string.Empty;
        public bool AlgorithmicCompleted { get; set; }
        public bool BuildathonUnlocked { get; set; }
        public bool BuildathonCompleted { get; set; }
        public int Points { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
