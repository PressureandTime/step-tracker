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

  console.log('Request interceptor running for:', config.url);
  console.log('Token retrieved:', token ? 'exists' : 'missing');

  if (token && !config.url.includes('/api/login')) {
    const authHeader = `Bearer ${token}`;
    config.headers['Authorization'] = authHeader;
    console.log('Authorization header set:', authHeader);

    // Log exact header comparison
    console.log('Headers comparison:', {
      'Content-Type': config.headers['Content-Type'],
      Authorization: config.headers['Authorization'],
      Accept: config.headers['Accept'] || 'not set',
    });
  }

  // Ensure trailing slashes are handled consistently
  if (config.url.endsWith('/') && !config.url.includes('/api/login')) {
    config.url = config.url.slice(0, -1);
  }

  // Log details for all requests
  console.log('Complete request details:', {
    fullUrl: `${config.baseURL}${config.url}`,
    method: config.method,
    headers: config.headers,
  });

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
