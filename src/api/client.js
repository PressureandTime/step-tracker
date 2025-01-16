import axios from 'axios';

// Create axios instance with default config
const client = axios.create({
  baseURL: 'https://planinarske-akcije.com', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
