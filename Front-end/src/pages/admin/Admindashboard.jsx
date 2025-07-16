import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  FileText, 
  Activity, 
  TrendingUp, 
  Clock,
  Shield,
  Settings,
  LogOut,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeTeams: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    totalSubmissions: 0,
    todaySubmissions: 0,
    topTeams: [],
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  // Mock chart data
  const submissionData = [
    { name: '00:00', submissions: 4 },
    { name: '04:00', submissions: 7 },
    { name: '08:00', submissions: 12 },
    { name: '12:00', submissions: 18 },
    { name: '16:00', submissions: 25 },
    { name: '20:00', submissions: 15 },
    { name: '24:00', submissions: 8 }
  ];

  const teamProgressData = [
    { name: 'CyberHackers', progress: 85 },
    { name: 'Code Warriors', progress: 72 },
    { name: 'Digital Rebels', progress: 68 },
    { name: 'Matrix Breakers', progress: 55 },
    { name: 'Neon Coders', progress: 45 }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set mock data for demo
      setStats({
        totalTeams: 24,
        activeTeams: 18,
        totalChallenges: 8,
        activeChallenges: 5,
        totalSubmissions: 156,
        todaySubmissions: 23,
        topTeams: [
          { teamName: 'CyberHackers', totalPoints: 850, rank: 1 },
          { teamName: 'Code Warriors', totalPoints: 720, rank: 2 },
          { teamName: 'Digital Rebels', totalPoints: 680, rank: 3 },
          { teamName: 'Matrix Breakers', totalPoints: 550, rank: 4 },
          { teamName: 'Neon Coders', totalPoints: 450, rank: 5 }
        ],
        recentSubmissions: [
          { teamName: 'CyberHackers', challengeTitle: 'Crypto Cipher', type: 'Flag', status: 'Accepted', submittedAt: new Date() },
          { teamName: 'Code Warriors', challengeTitle: 'Binary Forest', type: 'Code', status: 'Processing', submittedAt: new Date() },
          { teamName: 'Digital Rebels', challengeTitle: 'Neural Network', type: 'Flag', status: 'Rejected', submittedAt: new Date() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-400 mt-1`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 text-${color}-400 mr-1`} />
              <span className={`text-sm text-${color}-400`}>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              Control Center
            </h1>
            <p className="text-gray-400 mt-1">OASIS Protocol Administration Dashboard</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Teams"
            value={stats.totalTeams}
            icon={Users}
            color="cyan"
            trend="+12% from last week"
          />
          <StatCard
            title="Active Challenges"
            value={stats.activeChallenges}
            icon={Trophy}
            color="green"
            trend="5 ongoing"
          />
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon={FileText}
            color="yellow"
            trend="+23 today"
          />
          <StatCard
            title="System Status"
            value="ONLINE"
            icon={Activity}
            color="red"
            trend="99.9% uptime"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 text-cyan-400 mr-2" />
              Submission Activity (24h)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Team Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              Top Team Progress
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="progress" fill="#EAB308" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              Top Teams
            </h3>
            <div className="space-y-3">
              {stats.topTeams && Array.isArray(stats.topTeams) && stats.topTeams.map((team, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {team.rank}
                    </div>
                    <span className="text-white font-medium">{team.teamName}</span>
                  </div>
                  <span className="text-cyan-400 font-semibold">{team.totalPoints} pts</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 text-green-400 mr-2" />
              Recent Submissions
            </h3>
            <div className="space-y-3">
              {stats.recentSubmissions && Array.isArray(stats.recentSubmissions) && stats.recentSubmissions.map((submission, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{submission.teamName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                      submission.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{submission.challengeTitle}</span>
                    <span>{submission.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 text-purple-400 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              Manage Teams
            </button>
            <button className="flex items-center justify-center p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 transition-colors">
              <Trophy className="w-5 h-5 mr-2" />
              Add Challenge
            </button>
            <button className="flex items-center justify-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-400 transition-colors">
              <Eye className="w-5 h-5 mr-2" />
              View Submissions
            </button>
            <button className="flex items-center justify-center p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors">
              <Shield className="w-5 h-5 mr-2" />
              System Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;