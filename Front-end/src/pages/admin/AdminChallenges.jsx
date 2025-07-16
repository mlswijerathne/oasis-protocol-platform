import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Trophy, 
  Code, 
  Flag, 
  Search,
  Filter,
  Eye,
  Save,
  X
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { challengeAPI, algorithmicProblemAPI, buildathonProblemAPI, flagAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    points: 100,
    isActive: true,
    algorithmicProblem: {
      title: '',
      description: '',
      constraints: '',
      sampleInput: '',
      sampleOutput: '',
      timeLimit: 1000,
      memoryLimit: 256
    },
    buildathonProblem: {
      title: '',
      description: '',
      requirements: ''
    },
    flag: {
      value: '',
      description: ''
    }
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await challengeAPI.getAdminAll();
      setChallenges(response.data.challenges || response.data);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      // Mock data for demo
      setChallenges([
        {
          id: 1,
          title: 'The Cipher Genesis',
          description: 'The first layer of OASIS encryption',
          points: 100,
          isActive: true,
          algorithmicProblem: {
            id: 1,
            title: 'Decode the Matrix',
            description: 'Decrypt the binary message to find the hidden flag.',
            constraints: 'Input: Binary string\nOutput: Decoded message',
            sampleInput: '01001000 01100101 01101100 01101100 01101111',
            sampleOutput: 'Hello',
            timeLimit: 1000,
            memoryLimit: 256
          },
          buildathonProblem: {
            id: 1,
            title: 'Build the Decryption Engine',
            description: 'Create a web application that can decrypt various cipher types.',
            requirements: 'Must support at least 3 cipher types: Caesar, Vigenère, and Binary'
          },
          flag: {
            id: 1,
            value: 'OASIS{d3c0d3_th3_m4tr1x}',
            description: 'Flag for the cipher challenge'
          }
        },
        {
          id: 2,
          title: 'Neural Network Breach',
          description: 'Penetrate the AI defense systems',
          points: 200,
          isActive: true,
          algorithmicProblem: {
            id: 2,
            title: 'Pattern Recognition',
            description: 'Find the pattern in the neural network data.',
            constraints: 'Input: Array of integers\nOutput: Next number in sequence',
            sampleInput: '[2, 4, 8, 16]',
            sampleOutput: '32',
            timeLimit: 2000,
            memoryLimit: 512
          },
          buildathonProblem: {
            id: 2,
            title: 'AI Vulnerability Scanner',
            description: 'Build a tool to scan and identify vulnerabilities in AI systems.',
            requirements: 'Must include pattern analysis and vulnerability reporting'
          },
          flag: {
            id: 2,
            value: 'OASIS{n3ur4l_h4ck3d}',
            description: 'Flag for the AI challenge'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChallenge) {
        await challengeAPI.update(editingChallenge.id, challengeForm);
        toast.success('Challenge updated successfully!');
      } else {
        await challengeAPI.create(challengeForm);
        toast.success('Challenge created successfully!');
      }
      fetchChallenges();
      resetForm();
    } catch (error) {
      toast.error('Operation failed!');
    }
  };

  const handleDelete = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await challengeAPI.delete(challengeId);
        toast.success('Challenge deleted successfully!');
        fetchChallenges();
      } catch (error) {
        toast.error('Failed to delete challenge!');
      }
    }
  };

  const resetForm = () => {
    setChallengeForm({
      title: '',
      description: '',
      points: 100,
      isActive: true,
      algorithmicProblem: {
        title: '',
        description: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        timeLimit: 1000,
        memoryLimit: 256
      },
      buildathonProblem: {
        title: '',
        description: '',
        requirements: ''
      },
      flag: {
        value: '',
        description: ''
      }
    });
    setEditingChallenge(null);
    setShowCreateModal(false);
  };

  const startEdit = (challenge) => {
    setChallengeForm(challenge);
    setEditingChallenge(challenge);
    setShowCreateModal(true);
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && challenge.isActive) ||
                         (filterStatus === 'inactive' && !challenge.isActive);
    return matchesSearch && matchesFilter;
  });

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
              Challenge Management
            </h1>
            <p className="text-gray-400 mt-1">Create and manage algorithmic & buildathon challenges</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Challenge
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
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
              <option value="all">All Challenges</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      challenge.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{challenge.description}</p>
                  <div className="text-yellow-400 font-semibold">{challenge.points} points</div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(challenge)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Challenge Components */}
              <div className="space-y-3">
                {/* Algorithmic Problem */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Code className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-cyan-400 font-medium">Algorithmic Problem</span>
                  </div>
                  <p className="text-gray-300 text-sm">{challenge.algorithmicProblem.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{challenge.algorithmicProblem.description.substring(0, 100)}...</p>
                </div>

                {/* Buildathon Problem */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-green-400 font-medium">Buildathon Problem</span>
                  </div>
                  <p className="text-gray-300 text-sm">{challenge.buildathonProblem.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{challenge.buildathonProblem.description.substring(0, 100)}...</p>
                </div>

                {/* Flag */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Flag className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 font-medium">Flag</span>
                  </div>
                  <code className="text-green-400 text-sm font-mono bg-gray-900 px-2 py-1 rounded">
                    {challenge.flag.value}
                  </code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Challenges Found</h3>
            <p className="text-gray-500">Create your first challenge to get started</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Challenge Title
                    </label>
                    <input
                      type="text"
                      required
                      value={challengeForm.title}
                      onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={challengeForm.points}
                      onChange={(e) => setChallengeForm({...challengeForm, points: parseInt(e.target.value)})}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Algorithmic Problem */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Algorithmic Problem</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Problem Title
                      </label>
                      <input
                        type="text"
                        required
                        value={challengeForm.algorithmicProblem.title}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          algorithmicProblem: {...challengeForm.algorithmicProblem, title: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Time Limit (ms)
                        </label>
                        <input
                          type="number"
                          required
                          value={challengeForm.algorithmicProblem.timeLimit}
                          onChange={(e) => setChallengeForm({
                            ...challengeForm,
                            algorithmicProblem: {...challengeForm.algorithmicProblem, timeLimit: parseInt(e.target.value)}
                          })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Memory (MB)
                        </label>
                        <input
                          type="number"
                          required
                          value={challengeForm.algorithmicProblem.memoryLimit}
                          onChange={(e) => setChallengeForm({
                            ...challengeForm,
                            algorithmicProblem: {...challengeForm.algorithmicProblem, memoryLimit: parseInt(e.target.value)}
                          })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Problem Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={challengeForm.algorithmicProblem.description}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          algorithmicProblem: {...challengeForm.algorithmicProblem, description: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Constraints
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={challengeForm.algorithmicProblem.constraints}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          algorithmicProblem: {...challengeForm.algorithmicProblem, constraints: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sample Input
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={challengeForm.algorithmicProblem.sampleInput}
                          onChange={(e) => setChallengeForm({
                            ...challengeForm,
                            algorithmicProblem: {...challengeForm.algorithmicProblem, sampleInput: e.target.value}
                          })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expected Output
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={challengeForm.algorithmicProblem.sampleOutput}
                          onChange={(e) => setChallengeForm({
                            ...challengeForm,
                            algorithmicProblem: {...challengeForm.algorithmicProblem, sampleOutput: e.target.value}
                          })}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buildathon Problem */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-4">Buildathon Problem</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Buildathon Title
                      </label>
                      <input
                        type="text"
                        required
                        value={challengeForm.buildathonProblem.title}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          buildathonProblem: {...challengeForm.buildathonProblem, title: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={challengeForm.buildathonProblem.description}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          buildathonProblem: {...challengeForm.buildathonProblem, description: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Requirements
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={challengeForm.buildathonProblem.requirements}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          buildathonProblem: {...challengeForm.buildathonProblem, requirements: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Flag */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Flag Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Flag Value
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="OASIS{your_flag_here}"
                        value={challengeForm.flag.value}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          flag: {...challengeForm.flag, value: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Flag Description
                      </label>
                      <input
                        type="text"
                        required
                        value={challengeForm.flag.description}
                        onChange={(e) => setChallengeForm({
                          ...challengeForm,
                          flag: {...challengeForm.flag, description: e.target.value}
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={challengeForm.isActive}
                    onChange={(e) => setChallengeForm({...challengeForm, isActive: e.target.checked})}
                    className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-300">
                    Challenge is active and visible to teams
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChallenges;
