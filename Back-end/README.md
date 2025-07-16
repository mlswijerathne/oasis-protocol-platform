# 🚀 Oasis Protocol Platform

A comprehensive Ready Player One-inspired competitive programming and buildathon platform built with ASP.NET Core 8.0.

## 🌟 Features

### 🔐 Authentication System
- **Team Registration & Login**: Secure team authentication with JWT tokens
- **Admin Authentication**: Separate admin portal with predefined credentials
- **Role-Based Access Control (RBAC)**: Protected routes and endpoints

### 👥 Team Management
- Unique team registration with email validation
- Team progress tracking and activity monitoring
- Submission history and challenge progress

### 🏆 Challenge System
- **Algorithmic Challenges**: Code problems with integrated Judge0 execution
- **Buildathon Challenges**: Project-based challenges with GitHub submission
- **Progressive Unlocking**: Buildathon unlocks after solving algorithmic problem
- **Flag Validation**: Correct algorithmic solution generates flag for buildathon access

### 💻 Code Execution
- **Judge0 CE Integration**: Real-time code execution and testing
- **Multi-Language Support**: C, C++, Java, Python, JavaScript, C#, Go, Rust, PHP, Ruby
- **Real-time Results**: Execution time, memory usage, and output display
- **Error Handling**: Compilation errors and runtime exceptions

### 📊 Admin Dashboard
- **Real-time Statistics**: Team count, active challenges, submission metrics
- **Challenge Management**: Create, edit, delete challenges, algorithmic/buildathon problems
- **Team Monitoring**: View team progress, submission history, and activity
- **Flag Management**: Create and manage challenge flags

### 🏅 Leaderboard System
- **Real-time Rankings**: Points-based team ranking
- **Progress Tracking**: Challenge completion status
- **Performance Metrics**: Submission timestamps and scores

## 🛠️ Technology Stack

- **Backend**: ASP.NET Core 8.0
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer tokens + ASP.NET Core Identity
- **Code Execution**: Judge0 CE API integration
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Swagger/OpenAPI

## 🏗️ Project Structure

```
Back-end/
├── Controllers/          # API Controllers
│   ├── TeamController.cs              # Team authentication and management
│   ├── ChallengeController.cs         # Challenge management
│   ├── SubmissionController.cs        # Code submission and execution
│   ├── DashboardController.cs         # Admin dashboard
│   ├── AlgorithmicProblemController.cs # Algorithmic problem management
│   ├── BuildathonProblemController.cs  # Buildathon problem management
│   ├── FlagController.cs              # Flag management
│   ├── LeaderboardController.cs       # Leaderboard data
│   ├── AuthController.cs              # Admin authentication
│   ├── AdminController.cs             # Admin operations
│   └── UserController.cs              # User management
├── Models/               # Data Models
│   ├── Team.cs                        # Team entity
│   ├── Challenge.cs                   # Challenge entity
│   ├── AlgorithmicProblem.cs          # Algorithmic problem entity
│   ├── BuildathonProblem.cs           # Buildathon problem entity
│   ├── Submission.cs                  # Submission entity
│   ├── Flag.cs                        # Flag entity
│   ├── TeamChallenge.cs               # Team-Challenge relationship
│   ├── User.cs                        # Admin user entity
│   ├── UserRoles.cs                   # User roles
│   └── LeaderboardEntry.cs            # Leaderboard entry
├── DTOs/                 # Data Transfer Objects
│   ├── TeamDtos.cs                    # Team-related DTOs
│   ├── ChallengeDtos.cs               # Challenge-related DTOs
│   ├── SubmissionDtos.cs              # Submission-related DTOs
│   ├── AlgorithmicProblemDtos.cs      # Algorithmic problem DTOs
│   ├── BuildathonProblemDtos.cs       # Buildathon problem DTOs
│   ├── FlagDtos.cs                    # Flag-related DTOs
│   └── DashboardDtos.cs               # Dashboard data DTOs
├── Services/             # Business Logic Services
│   ├── ITeamService.cs & TeamService.cs           # Team management
│   ├── IChallengeService.cs & ChallengeService.cs # Challenge management
│   ├── ISubmissionService.cs & SubmissionService.cs # Submission handling
│   ├── IDashboardService.cs & DashboardService.cs # Dashboard data
│   └── IAuthService.cs & AuthService.cs           # Authentication
├── Data/                 # Database Context
│   └── ApplicationDbContext.cs        # EF Core DbContext
├── Migrations/           # Database Migrations
└── Program.cs            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JMAdikari/oasis-protocol-platform.git
   cd oasis-protocol-platform/Back-end
   ```

2. **Update Connection String**
   Edit `appsettings.json` and update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Your-SQL-Server-Connection-String"
     }
   }
   ```

3. **Install Dependencies**
   ```bash
   dotnet restore
   ```

4. **Run Database Setup**
   The custom SQL script creates all necessary tables:
   ```bash
   sqlcmd -S "YourServer" -d "YourDatabase" -E -i "CreateOasisTables.sql"
   ```

5. **Run the Application**
   ```bash
   dotnet run
   ```

6. **Access the API**
   - Application: `http://localhost:5233`
   - Swagger UI: `http://localhost:5233/swagger`

### Default Admin Credentials
- **Email**: `admin@oasis.com`
- **Password**: `Admin@123456`

## 🔧 Configuration

### Judge0 API Setup
Update `appsettings.json` with Judge0 credentials:
```json
{
  "Judge0": {
    "Endpoint": "http://10.3.5.139:2358",
    "Token": "ZHVvdGhhbjUuMA=="
  }
}
```

### JWT Configuration
```json
{
  "Jwt": {
    "Key": "Your-Secret-Key-Here",
    "Issuer": "https://localhost:5001",
    "Audience": "https://localhost:5001",
    "ExpireHours": 24
  }
}
```

## 📚 API Endpoints

### Team Authentication
- `POST /api/team/register` - Team registration
- `POST /api/team/login` - Team login
- `GET /api/team/profile` - Get team profile
- `GET /api/team/progress` - Get team progress

### Challenge Management
- `GET /api/challenge` - Get active challenges (Team)
- `GET /api/challenge/{id}` - Get specific challenge (Team)
- `GET /api/challenge/admin/all` - Get all challenges (Admin)
- `POST /api/challenge/admin` - Create challenge (Admin)
- `PUT /api/challenge/admin/{id}` - Update challenge (Admin)
- `DELETE /api/challenge/admin/{id}` - Delete challenge (Admin)

### Code Execution & Submissions
- `POST /api/submission` - Submit code/solution
- `POST /api/submission/execute` - Execute code without submitting
- `POST /api/submission/flag` - Submit flag
- `GET /api/submission/{id}` - Get submission details

### Admin Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/leaderboard` - Leaderboard data
- `GET /api/dashboard/teams` - All teams
- `GET /api/dashboard/teams/progress` - All team progress

### Leaderboard
- `GET /api/leaderboard` - Public leaderboard

## 🏗️ Database Schema

### Core Tables
- **Teams**: Team registration and authentication
- **Challenges**: Challenge definitions and metadata
- **AlgorithmicProblems**: Code problems with test cases
- **BuildathonProblems**: Project-based challenge descriptions
- **Flags**: Challenge flags for validation
- **Submissions**: All team submissions and results
- **TeamChallenges**: Team progress tracking

### Relationships
- One-to-One: Challenge ↔ AlgorithmicProblem, Challenge ↔ BuildathonProblem
- One-to-Many: Challenge → Flags, Team → Submissions, Challenge → Submissions
- Many-to-Many: Teams ↔ Challenges (via TeamChallenges)

## 🎮 Game Flow

1. **Team Registration**: Teams register with unique names and credentials
2. **Challenge Access**: Teams view available algorithmic challenges
3. **Code Development**: Teams write and test code using the integrated editor
4. **Flag Generation**: Successful algorithmic solutions generate flags
5. **Buildathon Unlock**: Teams submit flags to unlock buildathon challenges
6. **Project Submission**: Teams submit GitHub links for buildathon solutions
7. **Leaderboard**: Real-time ranking based on completion and performance

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Separate admin and team access levels
- **Password Hashing**: BCrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Controlled cross-origin access

## 🚀 Judge0 Integration

The platform integrates with Judge0 CE for code execution:

### Supported Languages
- **C** (Language ID: 50)
- **C++** (Language ID: 54)
- **Java** (Language ID: 62)
- **Python** (Language ID: 71)
- **JavaScript** (Language ID: 63)
- **C#** (Language ID: 51)
- **Go** (Language ID: 60)
- **Rust** (Language ID: 73)
- **PHP** (Language ID: 68)
- **Ruby** (Language ID: 72)

### Execution Features
- Real-time code execution
- Memory and time limit enforcement
- Compilation error handling
- Runtime error detection
- Output capture and display

## 📊 Monitoring & Analytics

- **Real-time Dashboard**: Live statistics and metrics
- **Team Activity Tracking**: Login times and submission patterns
- **Performance Metrics**: Execution times and memory usage
- **Progress Monitoring**: Challenge completion rates

## 🔄 Development Workflow

1. **Code Changes**: Make changes to controllers, services, or models
2. **Build**: `dotnet build`
3. **Test**: Use Swagger UI for API testing
4. **Deploy**: `dotnet publish` for production deployment

## 🛡️ Error Handling

- **Global Exception Handling**: Centralized error management
- **Validation Responses**: Clear error messages for invalid requests
- **Judge0 Error Handling**: Compilation and runtime error capture
- **Database Error Handling**: Connection and query error management

## 📈 Performance Considerations

- **Async/Await**: All database operations are asynchronous
- **Entity Framework Optimization**: Efficient queries with Include statements
- **Caching Strategy**: Consider implementing Redis for session management
- **Judge0 Rate Limiting**: Handle API rate limits gracefully

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Built for the Buildathon 2025 - "The Oasis Protocol" challenge.

---

🎮 **Ready Player One? The OASIS awaits your code!** 🎮
