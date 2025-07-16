import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Lock, 
  Unlock, 
  Play, 
  Clock, 
  Flag, 
  Upload,
  Trophy,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import TeamLayout from '../../components/TeamLayout';
import CodeEditor from '../../components/CodeEditor';
import { challengeAPI, submissionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ChallengePortal = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('algorithmic');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [flagSubmission, setFlagSubmission] = useState('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [githubLink, setGithubLink] = useState('');
  const [isSubmittingBuildathon, setIsSubmittingBuildathon] = useState(false);
  const [loading, setLoading] = useState(true);

  const languages = [
    { id: 'python', name: 'Python', judge0Id: 71 },
    { id: 'javascript', name: 'JavaScript', judge0Id: 63 },
    { id: 'java', name: 'Java', judge0Id: 62 },
    { id: 'cpp', name: 'C++', judge0Id: 54 },
    { id: 'c', name: 'C', judge0Id: 50 }
  ];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await challengeAPI.getAll();
      setChallenges(response.data);
      if (response.data.length > 0) {
        setSelectedChallenge(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      // Mock data for demo
      const mockChallenges = [
        {
          id: 1,
          title: 'The Cipher Genesis',
          description: 'The first layer of OASIS encryption',
          algorithmicProblem: {
            title: 'Decode the Matrix',
            description: 'Decrypt the binary message to find the hidden flag.',
            constraints: 'Input: Binary string\nOutput: Decoded message',
            sampleInput: '01001000 01100101 01101100 01101100 01101111',
            sampleOutput: 'Hello',
            timeLimit: 1000,
            memoryLimit: 256
          },
          buildathonProblem: {
            title: 'Build the Decryption Engine',
            description: 'Create a web application that can decrypt various cipher types.',
            requirements: 'Must support at least 3 cipher types: Caesar, Vigenère, and Binary'
          },
          isUnlocked: true,
          algorithmicCompleted: false,
          buildathonUnlocked: false,
          buildathonCompleted: false,
          points: 100
        },
        {
          id: 2,
          title: 'Neural Network Breach',
          description: 'Penetrate the AI defense systems',
          algorithmicProblem: {
            title: 'Pattern Recognition',
            description: 'Find the pattern in the neural network data.',
            constraints: 'Input: Array of integers\nOutput: Next number in sequence',
            sampleInput: '[2, 4, 8, 16]',
            sampleOutput: '32',
            timeLimit: 2000,
            memoryLimit: 512
          },
          buildathonProblem: {
            title: 'AI Vulnerability Scanner',
            description: 'Build a tool to scan and identify vulnerabilities in AI systems.',
            requirements: 'Must include pattern analysis and vulnerability reporting'
          },
          isUnlocked: false,
          algorithmicCompleted: false,
          buildathonUnlocked: false,
          buildathonCompleted: false,
          points: 200
        }
      ];
      setChallenges(mockChallenges);
      setSelectedChallenge(mockChallenges[0]);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setIsRunning(true);
    setOutput('');

    try {
      const selectedLang = languages.find(lang => lang.id === language);
      const response = await submissionAPI.executeCode({
        source_code: code,
        language_id: selectedLang.judge0Id,
        stdin: selectedChallenge?.algorithmicProblem?.sampleInput || ''
      });

      // Poll for result
      let result = response.data;
      while (result.status.id <= 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await submissionAPI.getSubmissionStatus(result.token);
        result = statusResponse.data;
      }

      if (result.status.id === 3) {
        setOutput(result.stdout || 'No output');
      } else {
        setOutput(result.stderr || result.compile_output || 'Execution failed');
      }
    } catch (error) {
      setOutput('Error: Failed to execute code');
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const submitFlag = async () => {
    if (!flagSubmission.trim()) {
      toast.error('Please enter a flag!');
      return;
    }

    if (!selectedChallenge?.id) {
      toast.error('No challenge selected!');
      return;
    }

    setIsSubmittingFlag(true);

    try {
      await submissionAPI.submitFlag({
        challengeId: selectedChallenge.id,
        flag: flagSubmission
      });

      toast.success('Flag accepted! Buildathon challenge unlocked!');
      setSelectedChallenge({
        ...selectedChallenge,
        algorithmicCompleted: true,
        buildathonUnlocked: true
      });
      setActiveTab('buildathon');
      setFlagSubmission('');
    } catch (error) {
      toast.error('Invalid flag. Try again!');
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const submitBuildathon = async () => {
    if (!githubLink.trim()) {
      toast.error('Please enter a GitHub repository link!');
      return;
    }

    if (!githubLink.includes('github.com')) {
      toast.error('Please enter a valid GitHub link!');
      return;
    }

    if (!selectedChallenge?.id) {
      toast.error('No challenge selected!');
      return;
    }

    setIsSubmittingBuildathon(true);

    try {
      await submissionAPI.submitBuildathon({
        challengeId: selectedChallenge.id,
        githubLink: githubLink
      });

      toast.success('Buildathon submission successful! Challenge completed!');
      setSelectedChallenge({
        ...selectedChallenge,
        buildathonCompleted: true
      });
      setGithubLink('');
    } catch (error) {
      toast.error('Submission failed. Please try again!');
    } finally {
      setIsSubmittingBuildathon(false);
    }
  };

  if (loading) {
    return (
      <TeamLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeamLayout>
    );
  }

  return (
    <TeamLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Challenge List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              Challenges
            </h2>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                    selectedChallenge?.id === challenge.id
                      ? 'bg-cyan-500/20 border-cyan-500'
                      : challenge.isUnlocked
                      ? 'bg-gray-800/50 border-gray-600 hover:border-cyan-500/50'
                      : 'bg-gray-800/30 border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{challenge.title}</span>
                    {challenge.isUnlocked ? (
                      <Unlock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-sm font-medium">{challenge.points} pts</span>
                    <div className="flex space-x-1">
                      {challenge.algorithmicCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {challenge.buildathonCompleted && (
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="lg:col-span-3">
          {selectedChallenge ? (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">{selectedChallenge.title}</h1>
                  <p className="text-gray-400 mt-1">{selectedChallenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold text-xl">{selectedChallenge.points} pts</div>
                  <div className="text-gray-400 text-sm">Reward</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('algorithmic')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'algorithmic'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4 inline-block mr-2" />
                  Algorithmic Challenge
                </button>
                <button
                  onClick={() => setActiveTab('buildathon')}
                  disabled={!selectedChallenge?.buildathonUnlocked}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'buildathon'
                      ? 'bg-green-500 text-white'
                      : selectedChallenge?.buildathonUnlocked
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedChallenge?.buildathonUnlocked ? (
                    <Unlock className="w-4 h-4 inline-block mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 inline-block mr-2" />
                  )}
                  Buildathon Phase
                </button>
              </div>

              {/* Content */}
              {activeTab === 'algorithmic' && (
                <div className="space-y-6">
                  {/* Problem Description */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">{selectedChallenge.algorithmicProblem?.title}</h3>
                    <p className="text-gray-300 mb-4">{selectedChallenge.algorithmicProblem?.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Sample Input:</h4>
                        <code className="block bg-gray-900 p-2 rounded text-green-400 text-sm">
                          {selectedChallenge.algorithmicProblem?.sampleInput}
                        </code>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Expected Output:</h4>
                        <code className="block bg-gray-900 p-2 rounded text-green-400 text-sm">
                          {selectedChallenge.algorithmicProblem?.sampleOutput}
                        </code>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      <p><span className="text-yellow-400">Constraints:</span> {selectedChallenge.algorithmicProblem?.constraints}</p>
                      <p><span className="text-yellow-400">Time Limit:</span> {selectedChallenge.algorithmicProblem?.timeLimit}ms</p>
                      <p><span className="text-yellow-400">Memory Limit:</span> {selectedChallenge.algorithmicProblem?.memoryLimit}MB</p>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
                      >
                        {languages.map((lang) => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={language}
                      height="300px"
                    />

                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isRunning ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {isRunning ? 'Running...' : 'Run Code'}
                      </button>
                    </div>
                  </div>

                  {/* Output */}
                  {output && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Output</h3>
                      <pre className="bg-gray-900 p-3 rounded text-green-400 text-sm whitespace-pre-wrap">
                        {output}
                      </pre>
                    </div>
                  )}

                  {/* Flag Submission */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Flag className="w-5 h-5 text-yellow-400 mr-2" />
                      Submit Flag
                    </h3>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={flagSubmission}
                        onChange={(e) => setFlagSubmission(e.target.value)}
                        placeholder="Enter the flag here..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        disabled={selectedChallenge?.algorithmicCompleted}
                      />
                      <button
                        onClick={submitFlag}
                        disabled={isSubmittingFlag || selectedChallenge?.algorithmicCompleted}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSubmittingFlag ? 'Submitting...' : selectedChallenge?.algorithmicCompleted ? 'Completed' : 'Submit'}
                      </button>
                    </div>
                    {selectedChallenge?.algorithmicCompleted && (
                      <div className="mt-2 flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Flag accepted! Buildathon phase unlocked.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'buildathon' && (
                <div className="space-y-6">
                  {selectedChallenge?.buildathonUnlocked ? (
                    <>
                      {/* Buildathon Description */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">{selectedChallenge.buildathonProblem?.title}</h3>
                        <p className="text-gray-300 mb-4">{selectedChallenge.buildathonProblem?.description}</p>
                        <div className="text-sm text-gray-400">
                          <p><span className="text-green-400">Requirements:</span> {selectedChallenge.buildathonProblem?.requirements}</p>
                        </div>
                      </div>

                      {/* Submission */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Upload className="w-5 h-5 text-green-400 mr-2" />
                          Submit Your Solution
                        </h3>
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/username/repository"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            disabled={selectedChallenge?.buildathonCompleted}
                          />
                          <button
                            onClick={submitBuildathon}
                            disabled={isSubmittingBuildathon || selectedChallenge?.buildathonCompleted}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isSubmittingBuildathon ? 'Submitting...' : selectedChallenge?.buildathonCompleted ? 'Completed' : 'Submit Repository'}
                          </button>
                        </div>
                        {selectedChallenge?.buildathonCompleted && (
                          <div className="mt-2 flex items-center text-green-400">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Buildathon submission completed! Challenge solved.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">Buildathon Phase Locked</h3>
                      <p className="text-gray-500">Complete the algorithmic challenge to unlock this phase</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Challenge Selected</h3>
              <p className="text-gray-500">Select a challenge from the list to begin</p>
            </div>
          )}
        </div>
      </div>
    </TeamLayout>
  );
};

export default ChallengePortal;