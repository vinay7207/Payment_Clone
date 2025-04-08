import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Request logging
api.interceptors.request.use(config => {
  console.log(`[${new Date().toISOString()}] Outgoing ${config.method.toUpperCase()} to ${config.url}`);
  console.log('Request config:', {
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (userData) => api.post('/api/signup', userData),
  login: (credentials) => api.post('/api/login', credentials),
  getUsers: () => api.get('/api/admin/users'),
  toggleUserStatus: (userId) => api.put(`/api/admin/users/${userId}/status`),
  createWallet: (userId) => api.post(`/api/users/${userId}/wallet`),
  resetUserWallet: (userId) => api.put(`/api/admin/users/${userId}/wallet`),
  getUserWallet: (userId) => api.get(`/api/users/${userId}/wallet`)
};

export default api;
