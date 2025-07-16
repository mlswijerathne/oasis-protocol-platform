import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5233/api';
const JUDGE0_API_URL = process.env.REACT_APP_JUDGE0_URL || 'http://10.3.5.139:2358';
const JUDGE0_TOKEN = process.env.REACT_APP_JUDGE0_TOKEN || 'ZHVvdGhhbjUuMA==';

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const judge0Api = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': JUDGE0_TOKEN,
  },
});

// Request interceptors to add auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teamToken') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('teamToken');
      localStorage.removeItem('adminToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Team Authentication API
export const teamAuthAPI = {
  login: (email, password) => api.post('/team/login', { email, password }),
  register: (teamName, email, password) => api.post('/team/register', { 
    name: teamName, 
    email, 
    password,
    confirmPassword: password
  }),
  logout: () => api.post('/team/logout'),
  getProfile: () => api.get('/team/profile'),
};

// Admin Authentication API
export const adminAuthAPI = {
  login: (email, password) => api.post('/auth/admin/login', { username: email, password }),
  logout: () => api.post('/auth/admin/logout'),
  getProfile: () => api.get('/auth/admin/profile'),
};

// Challenge API
export const challengeAPI = {
  getAll: () => api.get('/challenge'),
  getById: (id) => api.get(`/challenge/${id}`),
  create: (challengeData) => api.post('/challenge', challengeData),
  update: (id, challengeData) => api.put(`/challenge/${id}`, challengeData),
  delete: (id) => api.delete(`/challenge/${id}`),
  getForTeam: () => api.get('/challenge/team'),
  getAdminAll: () => api.get('/challenge/admin/all'),
  getAdminById: (id) => api.get(`/challenge/admin/${id}`)
};

// Algorithmic Problem API
export const algorithmicProblemAPI = {
  getAll: () => api.get('/algorithmic-problems'),
  getById: (id) => api.get(`/algorithmic-problems/${id}`),
  create: (problemData) => api.post('/algorithmic-problems', problemData),
  update: (id, problemData) => api.put(`/algorithmic-problems/${id}`, problemData),
  delete: (id) => api.delete(`/algorithmic-problems/${id}`),
};

// Buildathon Problem API
export const buildathonProblemAPI = {
  getAll: () => api.get('/buildathon-problems'),
  getById: (id) => api.get(`/buildathon-problems/${id}`),
  create: (problemData) => api.post('/buildathon-problems', problemData),
  update: (id, problemData) => api.put(`/buildathon-problems/${id}`, problemData),
  delete: (id) => api.delete(`/buildathon-problems/${id}`),
};

// Submission API
export const submissionAPI = {
  getAdminAll: () => api.get('/submission/admin/all'),
  getById: (id) => api.get(`/submission/${id}`),
  getByTeam: (teamId) => api.get(`/submission/team/${teamId}`),
  getByChallenge: (challengeId) => api.get(`/submission/challenge/${challengeId}`),
  submitFlag: (flagData) => api.post('/submission/flag', flagData),
  submitBuildathon: (buildathonData) => api.post('/submission/buildathon', buildathonData),
  executeCode: (codeData) => judge0Api.post('/submissions', {
    ...codeData,
    wait: false
  }),
  getSubmissionStatus: (token) => judge0Api.get(`/submissions/${token}`),
};

// Team API
export const teamAPI = {
  getAdminAll: () => api.get('/team/admin/all'),
  getById: (id) => api.get(`/team/${id}`),
  update: (id, teamData) => api.put(`/team/${id}`, teamData),
  delete: (id) => api.delete(`/team/${id}`),
  getProgress: () => api.get('/team/progress'),
  getSubmissions: () => api.get('/team/submissions'),
};

// Flag API
export const flagAPI = {
  getAll: () => api.get('/flags'),
  getById: (id) => api.get(`/flags/${id}`),
  create: (flagData) => api.post('/flags', flagData),
  update: (id, flagData) => api.put(`/flags/${id}`, flagData),
  delete: (id) => api.delete(`/flags/${id}`),
  validate: (flagData) => api.post('/flags/validate', flagData),
};

// Leaderboard API
export const leaderboardAPI = {
  get: (limit = 10) => api.get(`/leaderboard?limit=${limit}`),
  getDetailed: () => api.get('/leaderboard/detailed'),
};

// Dashboard API (Admin)
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getTeamProgress: () => api.get('/admin/teams/progress'),
  getSubmissions: (page = 1, limit = 20) => api.get(`/admin/submissions?page=${page}&limit=${limit}`),
  getSystemStats: () => api.get('/admin/system/stats'),
};

export default api;
