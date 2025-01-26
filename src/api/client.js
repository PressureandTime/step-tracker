import axios from 'axios';

// Create axios instance with default config
const client = axios.create({
  baseURL: 'https://planinarske-akcije.com',
});

export default client;
