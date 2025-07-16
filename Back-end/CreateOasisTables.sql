-- Script to create only the new Oasis Protocol tables (not Identity tables)

-- Create Teams table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Teams' AND xtype='U')
CREATE TABLE [Teams] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Email] nvarchar(450) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [LastLoginAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Teams] PRIMARY KEY ([Id])
);

-- Create unique indexes for Teams
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Teams_Name')
CREATE UNIQUE INDEX [IX_Teams_Name] ON [Teams] ([Name]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Teams_Email')
CREATE UNIQUE INDEX [IX_Teams_Email] ON [Teams] ([Email]);

-- Create Challenges table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Challenges' AND xtype='U')
CREATE TABLE [Challenges] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Points] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Challenges] PRIMARY KEY ([Id])
);

-- Create AlgorithmicProblems table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AlgorithmicProblems' AND xtype='U')
CREATE TABLE [AlgorithmicProblems] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ChallengeId] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [ProblemStatement] nvarchar(max) NOT NULL,
    [InputFormat] nvarchar(max) NOT NULL,
    [OutputFormat] nvarchar(max) NOT NULL,
    [Constraints] nvarchar(max) NOT NULL,
    [SampleInput] nvarchar(max) NOT NULL,
    [SampleOutput] nvarchar(max) NOT NULL,
    [TestCases] nvarchar(max) NOT NULL,
    [TimeLimit] int NOT NULL,
    [MemoryLimit] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_AlgorithmicProblems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AlgorithmicProblems_Challenges_ChallengeId] FOREIGN KEY ([ChallengeId]) REFERENCES [Challenges] ([Id]) ON DELETE CASCADE
);

-- Create BuildathonProblems table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BuildathonProblems' AND xtype='U')
CREATE TABLE [BuildathonProblems] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ChallengeId] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Requirements] nvarchar(max) NOT NULL,
    [Deliverables] nvarchar(max) NOT NULL,
    [EvaluationCriteria] nvarchar(max) NOT NULL,
    [TimeLimit] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_BuildathonProblems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BuildathonProblems_Challenges_ChallengeId] FOREIGN KEY ([ChallengeId]) REFERENCES [Challenges] ([Id]) ON DELETE CASCADE
);

-- Create Flags table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Flags' AND xtype='U')
CREATE TABLE [Flags] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ChallengeId] int NOT NULL,
    [Value] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Flags] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Flags_Challenges_ChallengeId] FOREIGN KEY ([ChallengeId]) REFERENCES [Challenges] ([Id]) ON DELETE CASCADE
);

-- Create Submissions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Submissions' AND xtype='U')
CREATE TABLE [Submissions] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TeamId] int NOT NULL,
    [ChallengeId] int NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [Code] nvarchar(max) NOT NULL,
    [Language] nvarchar(max) NOT NULL,
    [FlagValue] nvarchar(max) NULL,
    [GitHubLink] nvarchar(max) NULL,
    [Status] nvarchar(max) NOT NULL,
    [Output] nvarchar(max) NULL,
    [ErrorMessage] nvarchar(max) NULL,
    [ExecutionTime] int NULL,
    [MemoryUsed] int NULL,
    [Points] int NOT NULL,
    [SubmittedAt] datetime2 NOT NULL,
    [EvaluatedAt] datetime2 NULL,
    CONSTRAINT [PK_Submissions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Submissions_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Submissions_Challenges_ChallengeId] FOREIGN KEY ([ChallengeId]) REFERENCES [Challenges] ([Id]) ON DELETE CASCADE
);

-- Create TeamChallenges table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TeamChallenges' AND xtype='U')
CREATE TABLE [TeamChallenges] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TeamId] int NOT NULL,
    [ChallengeId] int NOT NULL,
    [AlgorithmicCompleted] bit NOT NULL,
    [BuildathonUnlocked] bit NOT NULL,
    [BuildathonCompleted] bit NOT NULL,
    [StartedAt] datetime2 NOT NULL,
    [CompletedAt] datetime2 NULL,
    [TotalPoints] int NOT NULL,
    CONSTRAINT [PK_TeamChallenges] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TeamChallenges_Teams_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [Teams] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TeamChallenges_Challenges_ChallengeId] FOREIGN KEY ([ChallengeId]) REFERENCES [Challenges] ([Id]) ON DELETE CASCADE
);

-- Create unique index for TeamChallenges
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_TeamChallenges_TeamId_ChallengeId')
CREATE UNIQUE INDEX [IX_TeamChallenges_TeamId_ChallengeId] ON [TeamChallenges] ([TeamId], [ChallengeId]);

-- Create indexes for foreign keys
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_AlgorithmicProblems_ChallengeId')
CREATE INDEX [IX_AlgorithmicProblems_ChallengeId] ON [AlgorithmicProblems] ([ChallengeId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_BuildathonProblems_ChallengeId')
CREATE INDEX [IX_BuildathonProblems_ChallengeId] ON [BuildathonProblems] ([ChallengeId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Flags_ChallengeId')
CREATE INDEX [IX_Flags_ChallengeId] ON [Flags] ([ChallengeId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Submissions_TeamId')
CREATE INDEX [IX_Submissions_TeamId] ON [Submissions] ([TeamId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Submissions_ChallengeId')
CREATE INDEX [IX_Submissions_ChallengeId] ON [Submissions] ([ChallengeId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_TeamChallenges_TeamId')
CREATE INDEX [IX_TeamChallenges_TeamId] ON [TeamChallenges] ([TeamId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_TeamChallenges_ChallengeId')
CREATE INDEX [IX_TeamChallenges_ChallengeId] ON [TeamChallenges] ([ChallengeId]);

PRINT 'Oasis Protocol tables created successfully!';
