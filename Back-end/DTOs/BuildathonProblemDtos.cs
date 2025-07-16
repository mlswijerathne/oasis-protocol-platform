using System.ComponentModel.DataAnnotations;

namespace AuthBackend.DTOs
{
    public class CreateBuildathonProblemDto
    {
        [Required]
        public int ChallengeId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Requirements { get; set; } = string.Empty;
        public string Deliverables { get; set; } = string.Empty;
        public string EvaluationCriteria { get; set; } = string.Empty;

        [Range(1, 72)]
        public int TimeLimit { get; set; } = 24;
    }

    public class UpdateBuildathonProblemDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Requirements { get; set; } = string.Empty;
        public string Deliverables { get; set; } = string.Empty;
        public string EvaluationCriteria { get; set; } = string.Empty;

        [Range(1, 72)]
        public int TimeLimit { get; set; } = 24;
    }

    public class BuildathonProblemDto
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Deliverables { get; set; } = string.Empty;
        public string EvaluationCriteria { get; set; } = string.Empty;
        public int TimeLimit { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
