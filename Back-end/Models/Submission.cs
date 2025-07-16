using System.ComponentModel.DataAnnotations;

namespace AuthBackend.Models
{
    public enum SubmissionType
    {
        Algorithmic,
        Flag,
        Buildathon
    }

    public enum SubmissionStatus
    {
        Pending,
        Accepted,
        WrongAnswer,
        TimeLimitExceeded,
        RuntimeError,
        CompilationError,
        MemoryLimitExceeded,
        Rejected
    }

    public class Submission
    {
        public int Id { get; set; }
        
        public int TeamId { get; set; }
        
        public int ChallengeId { get; set; }
        
        public SubmissionType Type { get; set; }
        
        public string Code { get; set; } = string.Empty;
        
        public string Language { get; set; } = string.Empty;
        
        public string? FlagValue { get; set; }
        
        public string? GitHubLink { get; set; }
        
        public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;
        
        public string? Output { get; set; }
        
        public string? ErrorMessage { get; set; }
        
        public int? ExecutionTime { get; set; } // milliseconds
        
        public int? MemoryUsed { get; set; } // KB
        
        public int Points { get; set; } = 0;
        
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? EvaluatedAt { get; set; }
        
        // Navigation properties
        public virtual Team Team { get; set; } = null!;
        public virtual Challenge Challenge { get; set; } = null!;
    }
}
