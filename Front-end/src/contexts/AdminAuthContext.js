import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAuthAPI } from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Checking auth status, token:', token);
      if (token) {
        const response = await adminAuthAPI.getProfile();
        console.log('Profile response:', response.data);
        setAdmin(response.data);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      const response = await adminAuthAPI.login(email, password);
      console.log('Login response:', response.data);
      const { token, admin: adminData } = response.data;
      
      localStorage.setItem('adminToken', token);
      console.log('Setting admin data:', adminData);
      setAdmin(adminData);
      
      // Add a small delay to ensure state is set before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return adminData;
    } catch (error) {
      console.log('Login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const logout = async () => {
    try {
      await adminAuthAPI.logout();
    } catch (error) {
      // Logout even if API call fails
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export { AdminAuthContext };
