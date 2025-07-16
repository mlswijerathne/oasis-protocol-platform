import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TeamAuthProvider } from './contexts/TeamAuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Components
import TeamProtectedRoute from './components/TeamProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import TeamLogin from './pages/team/TeamLogin';
import TeamRegister from './pages/team/TeamRegister';
import ChallengePortal from './pages/team/ChallengePortal';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminChallenges from './pages/admin/AdminChallenges';
import AdminTeams from './pages/admin/AdminTeams';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <TeamAuthProvider>
      <AdminAuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Team Routes */}
            <Route path="/team/login" element={<TeamLogin />} />
            <Route path="/team/register" element={<TeamRegister />} />
            
            {/* Protected Team Routes */}
            <Route path="/team" element={<TeamProtectedRoute />}>
              <Route path="challenges" element={<ChallengePortal />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="challenges" element={<AdminChallenges />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="submissions" element={<AdminSubmissions />} />
            </Route>
          </Routes>
        </div>
      </AdminAuthProvider>
    </TeamAuthProvider>
  );
}

export default App;
