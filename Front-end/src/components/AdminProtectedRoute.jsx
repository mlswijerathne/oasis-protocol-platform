import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminAuthContext } from '../contexts/AdminAuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminProtectedRoute = () => {
  const { admin, loading } = useContext(AdminAuthContext);

  console.log('AdminProtectedRoute - admin:', admin, 'loading:', loading);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!admin) {
    console.log('No admin found, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Admin authenticated, rendering outlet');
  return <Outlet />;
};

export default AdminProtectedRoute;
