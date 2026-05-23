import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { getStoredTokens, setStoredTokens, clearStoredTokens } from '@/lib/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add access token to all requests
client.interceptors.request.use(
  (config) => {
    const { access_token } = getStoredTokens();

    if (access_token && config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh on 401
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      headers?: any;
    };

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refresh_token } = getStoredTokens();

        if (!refresh_token) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token,
        });

        // Store new tokens
        const {
          access_token,
          refresh_token: new_refresh_token,
        } = response.data;

        setStoredTokens(access_token, new_refresh_token);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearStoredTokens();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // Rate limit handling
    if (error.response?.status === 429) {
      return Promise.reject(
        new Error('Too many requests. Please try again later.')
      );
    }

    const message =
      (error.response?.data as any)?.error?.message ||
      'An error occurred';

    return Promise.reject(new Error(message));
  }
);

export default client;
