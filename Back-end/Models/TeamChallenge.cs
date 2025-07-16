namespace AuthBackend.Models
{
    public class TeamChallenge
    {
        public int Id { get; set; }
        
        public int TeamId { get; set; }
        
        public int ChallengeId { get; set; }
        
        public bool AlgorithmicCompleted { get; set; } = false;
        
        public bool BuildathonUnlocked { get; set; } = false;
        
        public bool BuildathonCompleted { get; set; } = false;
        
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        public int TotalPoints { get; set; } = 0;
        
        // Navigation properties
        public virtual Team Team { get; set; } = null!;
        public virtual Challenge Challenge { get; set; } = null!;
    }
}
