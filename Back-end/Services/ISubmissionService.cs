using AuthBackend.DTOs;

namespace AuthBackend.Services
{
    public interface ISubmissionService
    {
        Task<SubmissionDto> CreateSubmissionAsync(int teamId, CreateSubmissionDto createDto);
        Task<List<SubmissionDto>> GetAllSubmissionsAsync();
        Task<List<SubmissionDto>> GetSubmissionsByTeamAsync(int teamId);
        Task<List<SubmissionDto>> GetSubmissionsByChallengeAsync(int challengeId);
        Task<SubmissionDto?> GetSubmissionByIdAsync(int id);
        Task<ExecutionResultDto> ExecuteCodeAsync(CodeExecutionDto executionDto);
        Task<(bool Success, string Message)> SubmitFlagAsync(int teamId, FlagSubmissionDto flagDto);
        Task<bool> EvaluateSubmissionAsync(int submissionId);
    }
}
