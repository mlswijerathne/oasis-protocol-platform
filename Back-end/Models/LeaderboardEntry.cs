namespace AuthBackend.Models
{
    public class LeaderboardEntry
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int TotalPoints { get; set; }
        public int ChallengesCompleted { get; set; }
        public DateTime? LastSubmission { get; set; }
        public int Rank { get; set; }
    }
}
