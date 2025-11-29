import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Only show toast if not from login/register (they handle their own)
          if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
            toast.error('Session expired. Please login again.');
          }
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You do not have permission.');
          break;
        case 404:
          if (!error.config.url.includes('/auth/')) {
            toast.error('Resource not found.');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Don't show default toast for auth endpoints (handled by thunks)
          if (!error.config.url.includes('/auth/')) {
            toast.error(data?.message || 'An error occurred.');
          }
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
