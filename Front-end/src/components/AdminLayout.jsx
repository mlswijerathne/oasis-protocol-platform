import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Crown,
  BarChart3,
  Users,
  Trophy,
  Settings,
  FileText,
  LogOut,
  Shield,
  Activity
} from 'lucide-react';
import { AdminAuthContext } from '../contexts/AdminAuthContext';
import MatrixBackground from './MatrixBackground';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const { admin, logout } = useContext(AdminAuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Admin logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Challenges', href: '/admin/challenges', icon: Trophy },
    { name: 'Submissions', href: '/admin/submissions', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-purple-900 text-red-400 relative">
      <MatrixBackground />
      
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 animate-pulse"></div>

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-sm border-r border-red-900/50 z-20"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <Crown className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              ADMIN CONTROL
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-red-600/30 text-red-300 border border-red-500/50'
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">Administrator</span>
            </div>
            <p className="text-xs text-gray-400">{admin?.username || 'admin'}</p>
            <div className="flex items-center mt-2 text-xs text-green-400">
              <Activity className="w-3 h-3 mr-1" />
              <span>System Online</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center space-x-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-b border-red-900/50"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                OASIS Protocol • Admin Panel • Classified Access
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Server Time: {new Date().toLocaleTimeString()}</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Security Warning */}
      <div className="fixed bottom-4 right-4 z-30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-red-900/80 border border-red-700/50 rounded-lg p-3 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2 text-xs text-red-300">
            <Shield className="w-3 h-3" />
            <span>SECURE SESSION ACTIVE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLayout;
