/**
 * API service with axios and Firebase token handling
 * 
 * Environment Variables:
 * - None
 */

import axios from 'axios';
import { getAuth } from 'firebase/auth';
// eslint-disable-next-line no-unused-vars
import { auth } from '../hooks/useAuth.jsx';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add Firebase token
api.interceptors.request.use(
  async (config) => {
    const currentUser = getAuth().currentUser;
    
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api;