using AuthBackend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuthBackend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<AlgorithmicProblem> AlgorithmicProblems { get; set; }
        public DbSet<BuildathonProblem> BuildathonProblems { get; set; }
        public DbSet<Flag> Flags { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<TeamChallenge> TeamChallenges { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Team entity
            modelBuilder.Entity<Team>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure Challenge relationships
            modelBuilder.Entity<AlgorithmicProblem>(entity =>
            {
                entity.HasOne(a => a.Challenge)
                    .WithOne(c => c.AlgorithmicProblem)
                    .HasForeignKey<AlgorithmicProblem>(a => a.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BuildathonProblem>(entity =>
            {
                entity.HasOne(b => b.Challenge)
                    .WithOne(c => c.BuildathonProblem)
                    .HasForeignKey<BuildathonProblem>(b => b.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Flag>(entity =>
            {
                entity.HasOne(f => f.Challenge)
                    .WithMany(c => c.Flags)
                    .HasForeignKey(f => f.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Submission relationships
            modelBuilder.Entity<Submission>(entity =>
            {
                entity.HasOne(s => s.Team)
                    .WithMany(t => t.Submissions)
                    .HasForeignKey(s => s.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Challenge)
                    .WithMany(c => c.Submissions)
                    .HasForeignKey(s => s.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure TeamChallenge relationships
            modelBuilder.Entity<TeamChallenge>(entity =>
            {
                entity.HasOne(tc => tc.Team)
                    .WithMany(t => t.TeamChallenges)
                    .HasForeignKey(tc => tc.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tc => tc.Challenge)
                    .WithMany(c => c.TeamChallenges)
                    .HasForeignKey(tc => tc.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.TeamId, e.ChallengeId }).IsUnique();
            });

            // Configure enum conversions
            modelBuilder.Entity<Submission>()
                .Property(e => e.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Submission>()
                .Property(e => e.Status)
                .HasConversion<string>();
        }
    }
}