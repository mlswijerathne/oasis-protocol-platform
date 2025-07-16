import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowLeft, Crown } from 'lucide-react';
import { AdminAuthContext } from '../../contexts/AdminAuthContext';
import MatrixBackground from '../../components/MatrixBackground';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Admin access granted. Welcome to the control center.');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Access denied. Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-purple-900 text-red-400 relative overflow-hidden">
      <MatrixBackground />
      
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 animate-pulse"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Back to home */}
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-red-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to OASIS
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Crown className="w-12 h-12 text-red-500" />
                <div className="absolute inset-0 w-12 h-12 bg-red-500 blur-lg opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                ADMIN CONTROL
              </span>
            </h1>
            <p className="text-gray-400">Restricted access - Authorized personnel only</p>
            <div className="mt-2 text-xs text-red-500/80 font-mono">
              [ CLASSIFIED - LEVEL 9 CLEARANCE REQUIRED ]
            </div>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/70 backdrop-blur-sm border border-red-900/50 rounded-lg p-8 shadow-2xl shadow-red-500/10"
          >
            {/* Warning Banner */}
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-6">
              <div className="flex items-center text-red-400 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-mono">SECURE TERMINAL ACCESS</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors font-mono"
                    placeholder="Enter admin email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors font-mono"
                    placeholder="Enter admin access key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'ACCESS CONTROL CENTER'
                )}
              </motion.button>
            </form>

            {/* Security Info */}
            <div className="mt-6 space-y-2">
              <div className="text-xs text-gray-500 text-center">
                <p className="font-mono">🔴 HIGH SECURITY ZONE</p>
                <p>All access attempts are logged and monitored</p>
              </div>
              
              {/* Demo Credentials */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mt-4">
                <div className="text-xs text-gray-400 text-center">
                  <p className="font-semibold text-yellow-400 mb-1">Demo Credentials:</p>
                  <p className="font-mono">Email: admin@oasis.com</p>
                  <p className="font-mono">Password: Admin@123456</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-xs text-red-500/80"
          >
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
              <p className="font-mono font-bold">⚠️ RESTRICTED ACCESS ⚠️</p>
              <p>Unauthorized access attempts will be prosecuted</p>
              <p>All sessions are encrypted and monitored</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>
    </div>
  );
};

export default AdminLogin;
