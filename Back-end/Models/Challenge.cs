using System.ComponentModel.DataAnnotations;

namespace AuthBackend.Models
{
    public class Challenge
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public int Points { get; set; } = 100;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual AlgorithmicProblem? AlgorithmicProblem { get; set; }
        public virtual BuildathonProblem? BuildathonProblem { get; set; }
        public virtual ICollection<Flag> Flags { get; set; } = new List<Flag>();
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<TeamChallenge> TeamChallenges { get; set; } = new List<TeamChallenge>();
    }
}
