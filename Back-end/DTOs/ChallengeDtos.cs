using System.ComponentModel.DataAnnotations;

namespace AuthBackend.DTOs
{
    public class CreateChallengeDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(1, 1000)]
        public int Points { get; set; } = 100;
    }

    public class UpdateChallengeDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(1, 1000)]
        public int Points { get; set; } = 100;

        public bool IsActive { get; set; } = true;
    }

    public class ChallengeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Points { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public AlgorithmicProblemDto? AlgorithmicProblem { get; set; }
        public BuildathonProblemDto? BuildathonProblem { get; set; }
        public List<FlagDto> Flags { get; set; } = new List<FlagDto>();
    }

    public class ChallengeListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Points { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool HasAlgorithmicProblem { get; set; }
        public bool HasBuildathonProblem { get; set; }
        public int FlagCount { get; set; }
        public int SubmissionCount { get; set; }
    }
}
