using System.ComponentModel.DataAnnotations;

namespace AuthBackend.DTOs
{
    public class CreateFlagDto
    {
        [Required]
        public int ChallengeId { get; set; }

        [Required]
        public string Value { get; set; } = string.Empty;
    }

    public class UpdateFlagDto
    {
        [Required]
        public string Value { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }

    public class FlagDto
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public string Value { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class FlagSubmissionDto
    {
        [Required]
        public int ChallengeId { get; set; }

        [Required]
        public string FlagValue { get; set; } = string.Empty;
    }
}
