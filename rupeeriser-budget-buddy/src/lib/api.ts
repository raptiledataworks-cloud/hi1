import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
// const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.59:8000";
// const API_URL = import.meta.env.VITE_API_URL || "http://192.168.29.72:8000";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  // Auth
  login: (data: any) => api.post('/auth/login', data),
  signup: (data: any) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/password', data),
  deleteUserAccount: () => api.delete('/auth/me'),

  // Core Data
  getTransactions: () => api.get('/transactions/'),
  addTransaction: (data: any) => api.post('/transactions/', data),
  deleteTransaction: (id: string) => api.delete(`/transactions/${id}`),
  updateTransaction: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  
  // Accounts
  getAccounts: () => api.get('/accounts/'),
  createAccount: (data: any) => api.post('/accounts/', data),
  deleteAccount: (id: string) => api.delete(`/accounts/${id}`),
  
  // Goals
  getGoals: () => api.get('/goals/'),
  createGoal: (data: any) => api.post('/goals/', data),
  deleteGoal: (id: string) => api.delete(`/goals/${id}`),
  
  // Budget Settings
  getBudgetSettings: () => api.get('/budget/'),
  updateBudgetSettings: (data: any) => api.put('/budget/', data),

  // Habits
  getHabits: () => api.get('/habits/'),
  createHabit: (name: string) => api.post('/habits/', { name }),
  // ✅ FIX: Use the generic update endpoint, passing the full object logic is handled in Context
  updateHabit: (id: string, data: any) => api.put(`/habits/${id}`, data), 
  deleteHabit: (id: string) => api.delete(`/habits/${id}`),
  seedHabits: () => api.post('/habits/seed'),

  // AI (Parse Only)
  parseAI: (text: string) => api.post('/ai/parse', { text }),
  chatAI: (message: string, context?: string) => api.post('/ai/chat', { message, context }),

  // Admin
  getAdminUsers: () => api.get('/admin/users'),
  getAdminUserData: (userId: string) => api.get(`/admin/users/${userId}/data`),
  deleteAdminUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  updateAdminUserPassword: (userId: string, new_password: string) => api.put(`/admin/users/${userId}/password`, { new_password }),
  adminCreateUser: (data: any) => api.post('/admin/users', data),
};

export default api;