using System.ComponentModel.DataAnnotations;
using AuthBackend.Models;

namespace AuthBackend.DTOs
{
    public class CreateSubmissionDto
    {
        [Required]
        public int ChallengeId { get; set; }

        [Required]
        public SubmissionType Type { get; set; }

        public string Code { get; set; } = string.Empty;

        public string Language { get; set; } = string.Empty;

        public string? FlagValue { get; set; }

        [Url]
        public string? GitHubLink { get; set; }
    }

    public class SubmissionDto
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int ChallengeId { get; set; }
        public string ChallengeTitle { get; set; } = string.Empty;
        public SubmissionType Type { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string? FlagValue { get; set; }
        public string? GitHubLink { get; set; }
        public SubmissionStatus Status { get; set; }
        public string? Output { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ExecutionTime { get; set; }
        public int? MemoryUsed { get; set; }
        public int Points { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? EvaluatedAt { get; set; }
    }

    public class SubmissionListDto
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public int ChallengeId { get; set; }
        public string ChallengeTitle { get; set; } = string.Empty;
        public SubmissionType Type { get; set; }
        public string Language { get; set; } = string.Empty;
        public SubmissionStatus Status { get; set; }
        public int Points { get; set; }
        public DateTime SubmittedAt { get; set; }
    }

    public class CodeExecutionDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Language { get; set; } = string.Empty;

        public string Input { get; set; } = string.Empty;
    }

    public class ExecutionResultDto
    {
        public string? Output { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ExecutionTime { get; set; }
        public int? MemoryUsed { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
