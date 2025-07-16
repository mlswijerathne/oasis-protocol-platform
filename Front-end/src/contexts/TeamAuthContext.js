import React, { createContext, useState, useContext, useEffect } from 'react';
import { teamAuthAPI } from '../services/api';

const TeamAuthContext = createContext();

export const useTeamAuth = () => {
  const context = useContext(TeamAuthContext);
  if (!context) {
    throw new Error('useTeamAuth must be used within a TeamAuthProvider');
  }
  return context;
};

export const TeamAuthProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('teamToken');
      if (token) {
        const response = await teamAuthAPI.getProfile();
        setTeam(response.data);
      }
    } catch (error) {
      localStorage.removeItem('teamToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await teamAuthAPI.login(email, password);
      console.log('Login response:', response.data); // Debug log
      const { token, team: teamData } = response.data;
      
      localStorage.setItem('teamToken', token);
      setTeam(teamData);
      console.log('Team set in context:', teamData); // Debug log
      
      return teamData;
    } catch (error) {
      console.error('Login error:', error); // Debug log
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (teamName, email, password) => {
    try {
      const response = await teamAuthAPI.register(teamName, email, password);
      const { token, team: teamData } = response.data;
      
      localStorage.setItem('teamToken', token);
      setTeam(teamData);
      
      return teamData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await teamAuthAPI.logout();
    } catch (error) {
      // Logout even if API call fails
    } finally {
      localStorage.removeItem('teamToken');
      setTeam(null);
    }
  };

  const value = {
    team,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!team
  };

  return (
    <TeamAuthContext.Provider value={value}>
      {children}
    </TeamAuthContext.Provider>
  );
};

export { TeamAuthContext };
