import axios from 'axios';
import { getToken } from '../auth/secureStore';

const client = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
