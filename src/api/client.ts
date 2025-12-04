import axios from 'axios';
import { getToken } from '../auth/secureStore';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.manacity.local',
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default apiClient;
