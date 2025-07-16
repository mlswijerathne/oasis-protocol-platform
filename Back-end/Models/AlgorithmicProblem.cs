using System.ComponentModel.DataAnnotations;

namespace AuthBackend.Models
{
    public class AlgorithmicProblem
    {
        public int Id { get; set; }
        
        public int ChallengeId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string ProblemStatement { get; set; } = string.Empty;
        
        public string InputFormat { get; set; } = string.Empty;
        
        public string OutputFormat { get; set; } = string.Empty;
        
        public string Constraints { get; set; } = string.Empty;
        
        public string SampleInput { get; set; } = string.Empty;
        
        public string SampleOutput { get; set; } = string.Empty;
        
        public string TestCases { get; set; } = string.Empty; // JSON format
        
        public int TimeLimit { get; set; } = 2; // seconds
        
        public int MemoryLimit { get; set; } = 128; // MB
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Challenge Challenge { get; set; } = null!;
    }
}
