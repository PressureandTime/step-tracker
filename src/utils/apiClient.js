import axios from 'axios';
import { getAuthTokens } from './auth';

export const apiClient = axios.create({
  baseURL: 'https://planinarske-akcije.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthTokens();

  if (token && !config.url.includes('/api/login')) {
    const authHeader = `Bearer ${token}`;
    config.headers['Authorization'] = authHeader;
  }

  // Ensure trailing slashes are handled consistently
  //   if (config.url.endsWith('/') && !config.url.includes('/api/login')) {
  //     config.url = config.url.slice(0, -1);
  //   }

  return config;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
      response: error.response?.data,
    });
    return Promise.reject(error);
  }
);
