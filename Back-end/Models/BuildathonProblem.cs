using System.ComponentModel.DataAnnotations;

namespace AuthBackend.Models
{
    public class BuildathonProblem
    {
        public int Id { get; set; }
        
        public int ChallengeId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        public string Requirements { get; set; } = string.Empty;
        
        public string Deliverables { get; set; } = string.Empty;
        
        public string EvaluationCriteria { get; set; } = string.Empty;
        
        public int TimeLimit { get; set; } = 24; // hours
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Challenge Challenge { get; set; } = null!;
    }
}
