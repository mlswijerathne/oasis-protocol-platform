import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Star, Clock, Target } from 'lucide-react';
import { leaderboardAPI } from '../services/api';
import MatrixBackground from '../components/MatrixBackground';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.get(20);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Mock data for demo
      setLeaderboard([
        { rank: 1, teamName: 'CyberHackers', totalPoints: 850, challengesCompleted: 8, lastSubmission: new Date() },
        { rank: 2, teamName: 'Code Warriors', totalPoints: 720, challengesCompleted: 7, lastSubmission: new Date() },
        { rank: 3, teamName: 'Digital Rebels', totalPoints: 680, challengesCompleted: 6, lastSubmission: new Date() },
        { rank: 4, teamName: 'Matrix Breakers', totalPoints: 550, challengesCompleted: 5, lastSubmission: new Date() },
        { rank: 5, teamName: 'Neon Coders', totalPoints: 450, challengesCompleted: 4, lastSubmission: new Date() },
        { rank: 6, teamName: 'Binary Phantoms', totalPoints: 380, challengesCompleted: 3, lastSubmission: new Date() },
        { rank: 7, teamName: 'Quantum Minds', totalPoints: 320, challengesCompleted: 3, lastSubmission: new Date() },
        { rank: 8, teamName: 'Zero Day Squad', totalPoints: 280, challengesCompleted: 2, lastSubmission: new Date() },
        { rank: 9, teamName: 'Firewall Breakers', totalPoints: 220, challengesCompleted: 2, lastSubmission: new Date() },
        { rank: 10, teamName: 'Code Ninjas', totalPoints: 180, challengesCompleted: 1, lastSubmission: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-600" />;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-600/50';
      default:
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        <MatrixBackground />
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                LEADERBOARD
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">Hall of Fame - OASIS Protocol Champions</p>
          <p className="text-gray-400">Real-time rankings of the most skilled teams</p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {leaderboard.slice(0, 3).map((team, index) => (
            <motion.div
              key={team.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative overflow-hidden rounded-lg border p-6 text-center ${getRankStyle(team.rank)} ${
                team.rank === 1 ? 'md:order-2 transform md:scale-110' : 
                team.rank === 2 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              {/* Glowing effect for winner */}
              {team.rank === 1 && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  {getRankIcon(team.rank)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{team.teamName}</h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{team.totalPoints}</div>
                <div className="text-sm text-gray-400">points</div>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    <span>{team.challengesCompleted} challenges</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              Complete Rankings
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Team</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Points</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Challenges</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Last Activity</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.map((team, index) => (
                  <motion.tr
                    key={team.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className={`hover:bg-gray-800/50 transition-colors ${
                      team.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                          team.rank === 1 ? 'bg-yellow-500 text-black' :
                          team.rank === 2 ? 'bg-gray-400 text-black' :
                          team.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {team.rank}
                        </div>
                        {team.rank <= 3 && getRankIcon(team.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{team.teamName}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-400 font-bold text-lg">{team.totalPoints}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Target className="w-4 h-4 text-cyan-400 mr-1" />
                        <span className="text-cyan-400">{team.challengesCompleted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{team.lastSubmission ? new Date(team.lastSubmission).toLocaleDateString() : 'No activity'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        team.challengesCompleted > 5 ? 'bg-green-500/20 text-green-400' :
                        team.challengesCompleted > 2 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {team.challengesCompleted > 5 ? 'Expert' :
                         team.challengesCompleted > 2 ? 'Advanced' : 'Beginner'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{leaderboard.length}</div>
            <div className="text-gray-400">Active Teams</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {leaderboard.reduce((sum, team) => sum + team.challengesCompleted, 0)}
            </div>
            <div className="text-gray-400">Total Challenges Solved</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {leaderboard.reduce((sum, team) => sum + team.totalPoints, 0)}
            </div>
            <div className="text-gray-400">Total Points Earned</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
