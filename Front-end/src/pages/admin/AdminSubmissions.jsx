import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  FileText,
  Flag,
  Activity,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { submissionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChallenge, setFilterChallenge] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusColors = {
    'Accepted': 'text-green-400 bg-green-500/20',
    'Wrong Answer': 'text-red-400 bg-red-500/20',
    'Time Limit Exceeded': 'text-yellow-400 bg-yellow-500/20',
    'Runtime Error': 'text-orange-400 bg-orange-500/20',
    'Compilation Error': 'text-purple-400 bg-purple-500/20',
    'Pending': 'text-blue-400 bg-blue-500/20'
  };

  const statusIcons = {
    'Accepted': CheckCircle,
    'Wrong Answer': XCircle,
    'Time Limit Exceeded': Clock,
    'Runtime Error': AlertTriangle,
    'Compilation Error': AlertTriangle,
    'Pending': RefreshCw
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await submissionAPI.getAdminAll();
      setSubmissions(response.data.submissions || response.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      // Mock data for demo
      setSubmissions([
        {
          id: 1,
          teamId: 1,
          teamName: 'Gunters United',
          challengeId: 1,
          challengeTitle: 'The Cipher Genesis',
          algorithmicProblemId: 1,
          buildathonProblemId: null,
          code: `#include <iostream>
#include <string>
#include <bitset>
using namespace std;

string binaryToAscii(string binary) {
    string result = "";
    for (int i = 0; i < binary.length(); i += 8) {
        string byte = binary.substr(i, 8);
        char ascii = (char)stoi(byte, 0, 2);
        result += ascii;
    }
    return result;
}

int main() {
    string input;
    getline(cin, input);
    
    // Remove spaces
    string cleanBinary = "";
    for (char c : input) {
        if (c != ' ') cleanBinary += c;
    }
    
    cout << binaryToAscii(cleanBinary) << endl;
    return 0;
}`,
          language: 'cpp',
          status: 'Accepted',
          score: 100,
          executionTime: 0.023,
          memoryUsed: 1.2,
          submittedAt: '2024-01-15T08:30:00Z',
          judgedAt: '2024-01-15T08:30:15Z',
          testCasesPassed: 10,
          totalTestCases: 10,
          errorMessage: null,
          buildathonUrl: null
        },
        {
          id: 2,
          teamId: 2,
          teamName: 'IOI Resistance',
          challengeId: 1,
          challengeTitle: 'The Cipher Genesis',
          algorithmicProblemId: 1,
          buildathonProblemId: null,
          code: `def binary_to_ascii(binary_string):
    # Remove spaces and convert binary to ASCII
    clean_binary = binary_string.replace(' ', '')
    result = ''
    
    for i in range(0, len(clean_binary), 8):
        byte = clean_binary[i:i+8]
        if len(byte) == 8:
            ascii_char = chr(int(byte, 2))
            result += ascii_char
    
    return result

# Read input
binary_input = input().strip()
print(binary_to_ascii(binary_input))`,
          language: 'python',
          status: 'Wrong Answer',
          score: 0,
          executionTime: 0.045,
          memoryUsed: 3.4,
          submittedAt: '2024-01-14T16:20:00Z',
          judgedAt: '2024-01-14T16:20:12Z',
          testCasesPassed: 7,
          totalTestCases: 10,
          errorMessage: 'Output does not match expected result for test case 8',
          buildathonUrl: null
        },
        {
          id: 3,
          teamId: 1,
          teamName: 'Gunters United',
          challengeId: 2,
          challengeTitle: 'Neural Network Breach',
          algorithmicProblemId: 2,
          buildathonProblemId: 2,
          code: `function findPattern(arr) {
    if (arr.length < 2) return null;
    
    // Check for geometric progression
    const ratio = arr[1] / arr[0];
    let isGeometric = true;
    
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] / arr[i-1] !== ratio) {
            isGeometric = false;
            break;
        }
    }
    
    if (isGeometric) {
        return arr[arr.length - 1] * ratio;
    }
    
    // Check for arithmetic progression
    const diff = arr[1] - arr[0];
    let isArithmetic = true;
    
    for (let i = 2; i < arr.length; i++) {
        if (arr[i] - arr[i-1] !== diff) {
            isArithmetic = false;
            break;
        }
    }
    
    if (isArithmetic) {
        return arr[arr.length - 1] + diff;
    }
    
    return null;
}

const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
console.log(findPattern(input));`,
          language: 'javascript',
          status: 'Accepted',
          score: 200,
          executionTime: 0.078,
          memoryUsed: 12.8,
          submittedAt: '2024-01-14T16:45:00Z',
          judgedAt: '2024-01-14T16:45:18Z',
          testCasesPassed: 15,
          totalTestCases: 15,
          errorMessage: null,
          buildathonUrl: 'https://neural-scanner.gunters-united.oasis'
        },
        {
          id: 4,
          teamId: 3,
          teamName: 'High Five',
          challengeId: 1,
          challengeTitle: 'The Cipher Genesis',
          algorithmicProblemId: 1,
          buildathonProblemId: null,
          code: `import java.util.Scanner;

public class BinaryDecoder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        
        // This will cause a compilation error
        String result = binaryToAscii(input;  // Missing closing parenthesis
        System.out.println(result);
    }
}`,
          language: 'java',
          status: 'Compilation Error',
          score: 0,
          executionTime: 0,
          memoryUsed: 0,
          submittedAt: '2024-01-12T18:45:00Z',
          judgedAt: '2024-01-12T18:45:03Z',
          testCasesPassed: 0,
          totalTestCases: 10,
          errorMessage: 'Compilation failed: missing ) in line 8',
          buildathonUrl: null
        },
        {
          id: 5,
          teamId: 2,
          teamName: 'IOI Resistance',
          challengeId: 3,
          challengeTitle: 'Quantum Encryption',
          algorithmicProblemId: 3,
          buildathonProblemId: null,
          code: 'print("Processing quantum encryption...")',
          language: 'python',
          status: 'Pending',
          score: 0,
          executionTime: 0,
          memoryUsed: 0,
          submittedAt: '2024-01-15T14:30:00Z',
          judgedAt: null,
          testCasesPassed: 0,
          totalTestCases: 12,
          errorMessage: null,
          buildathonUrl: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const challenges = [...new Set(submissions.map(s => s.challengeTitle))];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesChallenge = filterChallenge === 'all' || submission.challengeTitle === filterChallenge;
    return matchesSearch && matchesStatus && matchesChallenge;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      'cpp': 'text-blue-400 bg-blue-500/20',
      'python': 'text-green-400 bg-green-500/20',
      'javascript': 'text-yellow-400 bg-yellow-500/20',
      'java': 'text-red-400 bg-red-500/20',
      'c': 'text-gray-400 bg-gray-500/20'
    };
    return colors[language] || 'text-gray-400 bg-gray-500/20';
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
              Submission Monitor
            </h1>
            <p className="text-gray-400 mt-1">Real-time tracking of all team submissions</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{submissions.length}</div>
              <div className="text-sm text-gray-400">Total Submissions</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {submissions.filter(s => s.status === 'Accepted').length}
              </div>
              <div className="text-sm text-gray-400">Accepted</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {submissions.filter(s => s.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by team, challenge, or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-auto lg:flex lg:space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full lg:w-auto pl-10 pr-8 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit</option>
                <option value="Runtime Error">Runtime Error</option>
                <option value="Compilation Error">Compile Error</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterChallenge}
                onChange={(e) => setFilterChallenge(e.target.value)}
                className="w-full lg:w-auto pl-10 pr-8 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Challenges</option>
                {challenges.map(challenge => (
                  <option key={challenge} value={challenge}>{challenge}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Team</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Challenge</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Language</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Score</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Time</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Submitted</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission, index) => {
                  const StatusIcon = statusIcons[submission.status];
                  return (
                    <motion.tr
                      key={submission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-gray-700 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-cyan-400 mr-2" />
                          <span className="text-white font-medium">{submission.teamName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-white">{submission.challengeTitle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(submission.language)}`}>
                          {submission.language.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <StatusIcon className={`w-4 h-4 mr-2 ${statusColors[submission.status]?.split(' ')[0]}`} />
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[submission.status]}`}>
                            {submission.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${submission.score > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {submission.score}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-white">{submission.executionTime}s</div>
                          <div className="text-gray-400">{submission.memoryUsed}MB</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-white">{formatDate(submission.submittedAt)}</div>
                          {submission.judgedAt && (
                            <div className="text-gray-400">Judged: {formatDate(submission.judgedAt)}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDetails(true);
                          }}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Submissions Found</h3>
              <p className="text-gray-500">No submissions match your current search and filter criteria</p>
            </div>
          )}
        </div>

        {/* Submission Details Modal */}
        {showDetails && selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Code className="w-6 h-6 mr-2 text-cyan-400" />
                    Submission #{selectedSubmission.id}
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedSubmission.status]}`}>
                      {selectedSubmission.status}
                    </span>
                  </h2>
                  <p className="text-gray-400">
                    {selectedSubmission.teamName} • {selectedSubmission.challengeTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Submission Info */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Submission Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Team:</span>
                        <span className="text-white font-medium">{selectedSubmission.teamName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Challenge:</span>
                        <span className="text-white font-medium">{selectedSubmission.challengeTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(selectedSubmission.language)}`}>
                          {selectedSubmission.language.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Score:</span>
                        <span className={`font-bold ${selectedSubmission.score > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {selectedSubmission.score} points
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Execution Time:</span>
                        <span className="text-white">{selectedSubmission.executionTime}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory Used:</span>
                        <span className="text-white">{selectedSubmission.memoryUsed} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Test Cases:</span>
                        <span className={`font-medium ${selectedSubmission.testCasesPassed === selectedSubmission.totalTestCases ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedSubmission.testCasesPassed}/{selectedSubmission.totalTestCases}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white text-sm">{formatDate(selectedSubmission.submittedAt)}</span>
                      </div>
                      {selectedSubmission.judgedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Judged:</span>
                          <span className="text-white text-sm">{formatDate(selectedSubmission.judgedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSubmission.buildathonUrl && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Buildathon Submission</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-green-400">
                          <Flag className="w-4 h-4 mr-2" />
                          <span>Project URL Available</span>
                        </div>
                        <a
                          href={selectedSubmission.buildathonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-center"
                        >
                          View Project
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedSubmission.errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details</h3>
                      <p className="text-red-300 text-sm font-mono">{selectedSubmission.errorMessage}</p>
                    </div>
                  )}
                </div>

                {/* Code Display */}
                <div className="xl:col-span-2">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Source Code</h3>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                        <code>{selectedSubmission.code}</code>
                      </pre>
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

export default AdminSubmissions;
