# Oasis Protocol Platform

A modern web platform for managing algorithmic problems, buildathon challenges, and team competitions, developed for the Duothan Hackathon Challenge 2025. The platform provides a comprehensive solution for organizing and managing competitive programming events, buildathons, and team-based challenges.

## 💡 Overview

Oasis Protocol Platform is designed to facilitate:
- Competitive Programming Contests
- Team-based Hackathons
- Buildathon Challenges
- Real-time Performance Tracking
- Automated Submission Evaluation
- Interactive Leaderboards

## 🎯 Purpose
- Provide a robust platform for conducting programming competitions
- Enable fair and transparent evaluation of submissions
- Foster collaboration through team-based challenges
- Offer real-time feedback and performance metrics
- Support both individual and team-based competitions

## 🚀 Features

### User Authentication & Authorization
- Secure JWT-based authentication system
- Role-based access control (Admin, User, Team Leader)
- Email verification system
- Password encryption using BCrypt
- Session management and token refresh

### Challenge Management System
#### Algorithmic Problems
- Multiple difficulty levels (Easy, Medium, Hard)
- Automatic test case validation
- Custom input/output support
- Time and space complexity constraints
- Multiple programming language support

#### Buildathon Problems
- Project submission system
- Multiple evaluation criteria
- Resource limitation monitoring
- Project documentation support
- Version control integration

#### Team-based Challenges
- Collaborative problem solving
- Team progress tracking
- Resource sharing capabilities
- Inter-team communication features

### Team Management
- Team creation and invitation system
- Role assignment within teams
- Team size management
- Team performance analytics
- Resource allocation tracking

### Submission Handling
- Real-time submission status
- Automated code evaluation
- Performance metrics tracking
- Submission history
- Code similarity detection
- Detailed feedback system

### Real-time Leaderboard
- Live score updates
- Multiple ranking criteria
- Performance visualization
- Historical performance tracking
- Team and individual rankings

### Admin Dashboard
- User management interface
- Challenge creation and management
- System performance monitoring
- Analytics and reporting
- Access control management
- Event scheduling system

### Flag System
- Secure flag validation
- Point distribution system
- Progress tracking
- Achievement unlocking
- Anti-cheating measures

## 🛠️ Technology Stack

### Backend (.NET 8.0)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt for password hashing
- Identity Framework

### Frontend (React)
- React 19.1
- React Router DOM
- Tailwind CSS
- Framer Motion
- Recharts for data visualization
- Axios for API communication
- React Hot Toast for notifications

## 📦 Project Structure

```
├── Back-end/
│   ├── Controllers/       # API endpoints
│   ├── Data/             # Database context
│   ├── DTOs/             # Data transfer objects
│   ├── Models/           # Database entities
│   ├── Services/         # Business logic
│   └── Properties/       # Configuration files
└── Front-end/
    ├── public/           # Static files
    └── src/
        ├── components/   # Reusable UI components
        ├── contexts/     # React contexts
        ├── pages/        # Page components
        └── services/     # API services
```

## 🚦 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (Latest LTS version)
- SQL Server
- Visual Studio / VS Code

### Backend Setup
1. Clone the repository:
   ```powershell
   git clone https://github.com/JMAdikari/oasis-protocol-platform.git
   cd oasis-protocol-platform/Back-end
   ```

2. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=OasisDB;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. Install .NET dependencies:
   ```powershell
   dotnet restore
   ```

4. Run database migrations:
   ```powershell
   dotnet ef database update
   ```

5. Initialize the database with sample data (optional):
   ```powershell
   dotnet run /seed
   ```

6. Start the backend:
   ```powershell
   dotnet run
   ```

The backend will start running on `https://localhost:7123` by default.

### Frontend Setup
1. Navigate to the Front-end directory:
   ```powershell
   cd ../Front-end
   ```

2. Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://localhost:7123/api
   REACT_APP_ENV=development
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Run the development server:
   ```powershell
   npm start
   ```

The frontend will start running on `http://localhost:3000`.

### Build for Production
1. Build the frontend:
   ```powershell
   npm run build
   ```

2. Build the backend:
   ```powershell
   cd ../Back-end
   dotnet publish -c Release
   ```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Password hashing with BCrypt (cost factor 12)
- Role-based access control (RBAC)
- Email verification requirement
- Password complexity requirements
- Account lockout after failed attempts

### API Security
- HTTPS enforcement
- CORS policy configuration
- Rate limiting
- Request size limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Data Protection
- Encrypted data transmission
- Secure password storage
- Session management
- Audit logging
- Data backup and recovery
- GDPR compliance measures

### Infrastructure Security
- Regular security updates
- Firewall configuration
- DDoS protection
- Secure file upload handling
- Environment-based configurations
- Secrets management

## 🌐 API Endpoints

### Authentication Endpoints
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/verify-email` - Email verification

### User Management Endpoints
- GET `/api/users` - Get all users
- GET `/api/users/{id}` - Get user by ID
- PUT `/api/users/{id}` - Update user
- DELETE `/api/users/{id}` - Delete user
- GET `/api/users/profile` - Get current user profile

### Challenge Endpoints
- GET `/api/challenges` - List all challenges
- GET `/api/challenges/{id}` - Get challenge details
- POST `/api/challenges` - Create new challenge
- PUT `/api/challenges/{id}` - Update challenge
- DELETE `/api/challenges/{id}` - Delete challenge
- GET `/api/challenges/{id}/submissions` - Get challenge submissions

### Team Management Endpoints
- POST `/api/teams` - Create team
- GET `/api/teams` - List teams
- GET `/api/teams/{id}` - Get team details
- PUT `/api/teams/{id}` - Update team
- DELETE `/api/teams/{id}` - Delete team
- POST `/api/teams/{id}/members` - Add team member
- DELETE `/api/teams/{id}/members/{userId}` - Remove team member

### Submission Endpoints
- POST `/api/submissions` - Submit solution
- GET `/api/submissions/{id}` - Get submission details
- GET `/api/submissions/user/{userId}` - Get user submissions
- GET `/api/submissions/team/{teamId}` - Get team submissions

### Leaderboard Endpoints
- GET `/api/leaderboard` - Get global leaderboard
- GET `/api/leaderboard/teams` - Get team leaderboard
- GET `/api/leaderboard/users` - Get individual leaderboard
- GET `/api/leaderboard/challenge/{challengeId}` - Get challenge-specific leaderboard

### Flag Endpoints
- POST `/api/flags/submit` - Submit flag
- GET `/api/flags/status` - Get flag submission status
- GET `/api/flags/challenge/{challengeId}` - Get challenge flags

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contact

JMAdikari - [GitHub Profile](https://github.com/JMAdikari)
Lakshitha Wijerathne - [GitHub Profile](https://github.com/mlswijerathne)

Project Link: [https://github.com/JMAdikari/oasis-protocol-platform](https://github.com/JMAdikari/oasis-protocol-platform)
