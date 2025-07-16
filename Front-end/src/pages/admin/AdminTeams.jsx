import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  UserX, 
  Trophy, 
  Flag, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Mail,
  Calendar,
  Activity,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { teamAPI, userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAdminAll();
      setTeams(response.data.teams || response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      // Mock data for demo
      setTeams([
        {
          id: 1,
          name: 'Gunters United',
          leader: 'Wade Watts',
          email: 'wade@gunters.oasis',
          members: [
            { id: 1, name: 'Wade Watts', email: 'wade@gunters.oasis', role: 'Leader' },
            { id: 2, name: 'Art3mis', email: 'art3mis@gunters.oasis', role: 'Member' },
            { id: 3, name: 'Aech', email: 'aech@gunters.oasis', role: 'Member' }
          ],
          score: 1250,
          solvedChallenges: 5,
          lastActivity: '2024-01-15T10:30:00Z',
          isActive: true,
          registeredAt: '2024-01-10T09:00:00Z',
          submissions: [
            { id: 1, challengeTitle: 'The Cipher Genesis', points: 100, submittedAt: '2024-01-15T08:30:00Z', status: 'Accepted' },
            { id: 2, challengeTitle: 'Neural Network Breach', points: 200, submittedAt: '2024-01-14T16:45:00Z', status: 'Accepted' },
            { id: 3, challengeTitle: 'Quantum Encryption', points: 300, submittedAt: '2024-01-13T12:20:00Z', status: 'Accepted' }
          ]
        },
        {
          id: 2,
          name: 'IOI Resistance',
          leader: 'Samantha Cook',
          email: 'sam@resistance.oasis',
          members: [
            { id: 4, name: 'Samantha Cook', email: 'sam@resistance.oasis', role: 'Leader' },
            { id: 5, name: 'Daito', email: 'daito@resistance.oasis', role: 'Member' },
            { id: 6, name: 'Shoto', email: 'shoto@resistance.oasis', role: 'Member' },
            { id: 7, name: 'Og Morrow', email: 'og@resistance.oasis', role: 'Member' }
          ],
          score: 950,
          solvedChallenges: 4,
          lastActivity: '2024-01-14T14:20:00Z',
          isActive: true,
          registeredAt: '2024-01-09T11:30:00Z',
          submissions: [
            { id: 4, challengeTitle: 'The Cipher Genesis', points: 100, submittedAt: '2024-01-14T10:15:00Z', status: 'Accepted' },
            { id: 5, challengeTitle: 'Neural Network Breach', points: 200, submittedAt: '2024-01-13T09:30:00Z', status: 'Accepted' }
          ]
        },
        {
          id: 3,
          name: 'High Five',
          leader: 'Helen Harris',
          email: 'helen@highfive.oasis',
          members: [
            { id: 8, name: 'Helen Harris', email: 'helen@highfive.oasis', role: 'Leader' },
            { id: 9, name: 'James Halliday', email: 'anorak@highfive.oasis', role: 'Member' }
          ],
          score: 650,
          solvedChallenges: 2,
          lastActivity: '2024-01-12T18:45:00Z',
          isActive: false,
          registeredAt: '2024-01-08T15:20:00Z',
          submissions: [
            { id: 6, challengeTitle: 'The Cipher Genesis', points: 100, submittedAt: '2024-01-12T16:30:00Z', status: 'Accepted' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTeamStatus = async (teamId, currentStatus) => {
    try {
      await teamAPI.updateStatus(teamId, !currentStatus);
      toast.success(`Team ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      fetchTeams();
    } catch (error) {
      toast.error('Failed to update team status!');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await teamAPI.delete(teamId);
        toast.success('Team deleted successfully!');
        fetchTeams();
      } catch (error) {
        toast.error('Failed to delete team!');
      }
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && team.isActive) ||
                         (filterStatus === 'inactive' && !team.isActive);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-green-400 bg-green-500/20';
      case 'Wrong Answer': return 'text-red-400 bg-red-500/20';
      case 'Time Limit Exceeded': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

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
              Team Management
            </h1>
            <p className="text-gray-400 mt-1">Monitor and manage team activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{teams.length}</div>
              <div className="text-sm text-gray-400">Total Teams</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{teams.filter(t => t.isActive).length}</div>
              <div className="text-sm text-gray-400">Active Teams</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams, leaders, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
            >
              <option value="all">All Teams</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-red-500/50 transition-colors"
            >
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-cyan-400 mr-2" />
                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      team.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {team.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-1">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>{team.leader}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{team.email}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowDetails(true);
                    }}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleTeamStatus(team.id, team.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      team.isActive 
                        ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400' 
                        : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                    }`}
                    title={team.isActive ? 'Deactivate Team' : 'Activate Team'}
                  >
                    {team.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    title="Delete Team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{team.score}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{team.solvedChallenges}</div>
                  <div className="text-xs text-gray-400">Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{team.members.length}</div>
                  <div className="text-xs text-gray-400">Members</div>
                </div>
              </div>

              {/* Activity Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Registered: {formatDate(team.registeredAt)}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Activity className="w-4 h-4 mr-2" />
                  <span>Last Active: {formatDate(team.lastActivity)}</span>
                </div>
              </div>

              {/* Members Preview */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Team Members:</div>
                <div className="flex flex-wrap gap-1">
                  {team.members.slice(0, 3).map((member, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded text-xs ${
                      member.role === 'Leader' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600/50 text-gray-300'
                    }`}>
                      {member.name}
                    </span>
                  ))}
                  {team.members.length > 3 && (
                    <span className="px-2 py-1 rounded text-xs bg-gray-600/50 text-gray-300">
                      +{team.members.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Teams Found</h3>
            <p className="text-gray-500">No teams match your current search and filter criteria</p>
          </div>
        )}

        {/* Team Details Modal */}
        {showDetails && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Users className="w-6 h-6 mr-2 text-cyan-400" />
                    {selectedTeam.name}
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTeam.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedTeam.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </h2>
                  <p className="text-gray-400">Detailed team information and activity</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Info */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Team Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Team Name:</span>
                        <span className="text-white font-medium">{selectedTeam.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leader:</span>
                        <span className="text-white font-medium">{selectedTeam.leader}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white font-medium">{selectedTeam.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Score:</span>
                        <span className="text-yellow-400 font-bold">{selectedTeam.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Challenges Solved:</span>
                        <span className="text-green-400 font-bold">{selectedTeam.solvedChallenges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registered:</span>
                        <span className="text-white">{formatDate(selectedTeam.registeredAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Activity:</span>
                        <span className="text-white">{formatDate(selectedTeam.lastActivity)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Team Members ({selectedTeam.members.length})</h3>
                    <div className="space-y-3">
                      {selectedTeam.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-gray-400 text-sm">{member.email}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            member.role === 'Leader' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-gray-600/50 text-gray-300'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submissions History */}
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Submission History</h3>
                    <div className="space-y-3">
                      {selectedTeam.submissions.map((submission) => (
                        <div key={submission.id} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{submission.challengeTitle}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-yellow-400">+{submission.points} points</span>
                            <span className="text-gray-400">{formatDate(submission.submittedAt)}</span>
                          </div>
                        </div>
                      ))}
                      {selectedTeam.submissions.length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                          No submissions yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Actions */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Team Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleToggleTeamStatus(selectedTeam.id, selectedTeam.isActive)}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          selectedTeam.isActive 
                            ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400' 
                            : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                        }`}
                      >
                        {selectedTeam.isActive ? <Ban className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        {selectedTeam.isActive ? 'Deactivate Team' : 'Activate Team'}
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteTeam(selectedTeam.id);
                          setShowDetails(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeams;
