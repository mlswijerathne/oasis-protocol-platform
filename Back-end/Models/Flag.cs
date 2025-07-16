using System.ComponentModel.DataAnnotations;

namespace AuthBackend.Models
{
    public class Flag
    {
        public int Id { get; set; }
        
        public int ChallengeId { get; set; }
        
        [Required]
        public string Value { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Challenge Challenge { get; set; } = null!;
    }
}
