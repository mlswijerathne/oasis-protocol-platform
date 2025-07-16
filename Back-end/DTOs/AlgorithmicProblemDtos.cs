using System.ComponentModel.DataAnnotations;

namespace AuthBackend.DTOs
{
    public class CreateAlgorithmicProblemDto
    {
        [Required]
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
        public string TestCases { get; set; } = string.Empty;

        [Range(1, 60)]
        public int TimeLimit { get; set; } = 2;

        [Range(16, 512)]
        public int MemoryLimit { get; set; } = 128;
    }

    public class UpdateAlgorithmicProblemDto
    {
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
        public string TestCases { get; set; } = string.Empty;

        [Range(1, 60)]
        public int TimeLimit { get; set; } = 2;

        [Range(16, 512)]
        public int MemoryLimit { get; set; } = 128;
    }

    public class AlgorithmicProblemDto
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ProblemStatement { get; set; } = string.Empty;
        public string InputFormat { get; set; } = string.Empty;
        public string OutputFormat { get; set; } = string.Empty;
        public string Constraints { get; set; } = string.Empty;
        public string SampleInput { get; set; } = string.Empty;
        public string SampleOutput { get; set; } = string.Empty;
        public string TestCases { get; set; } = string.Empty;
        public int TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
