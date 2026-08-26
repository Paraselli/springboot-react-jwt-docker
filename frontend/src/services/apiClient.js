import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be invalid or expired
      console.warn('Unauthorized request - token may be expired or invalid');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/api/login', { username, password });
    return res.data;
  },
  health: async () => {
    const res = await api.get('/api/health');
    return res.data;
  },
};

export const userService = {
  getAll: async () => {
    const res = await api.get('/api/users');
    return res.data;
  },
  create: async (userData) => {
    const res = await api.post('/api/users', userData);
    return res.data;
  },
};

export default api;