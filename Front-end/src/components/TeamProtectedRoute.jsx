import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TeamAuthContext } from '../contexts/TeamAuthContext';
import LoadingSpinner from './LoadingSpinner';

const TeamProtectedRoute = () => {
  const { team, loading } = useContext(TeamAuthContext);

  console.log('TeamProtectedRoute - loading:', loading, 'team:', team); // Debug log

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!team) {
    console.log('No team found, redirecting to login'); // Debug log
    return <Navigate to="/team/login" replace />;
  }

  console.log('Team found, rendering protected content'); // Debug log
  return <Outlet />;
};

export default TeamProtectedRoute;
