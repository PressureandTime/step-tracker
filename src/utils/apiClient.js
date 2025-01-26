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
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Log details only for hikes request
  if (config.url.includes('/api/hikes')) {
    console.log('Complete hikes request:', {
      fullUrl: `${config.baseURL}${config.url}`, // Log the complete URL
      method: config.method,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        Authorization: config.headers['Authorization'],
      },
    });
  }

  return config;
});
