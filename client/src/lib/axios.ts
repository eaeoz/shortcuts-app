import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token from localStorage if cookies don't work
instance.interceptors.request.use(
  (config) => {
    // Check if we have a token in localStorage (fallback for mobile browsers)
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to store token when received
instance.interceptors.response.use(
  (response) => {
    // If response contains a token, store it in localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      console.log('🔐 Token stored in localStorage for mobile compatibility');
    }
    return response;
  },
  (error) => {
    // If we get 401, clear the stored token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export default instance;
