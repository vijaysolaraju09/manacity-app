import axios from 'axios';
import { saveToken, clearToken } from './secureStore';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const login = async (email: string, password: string) => {
  const { data } = await axios.post('https://example.com/api/login', { email, password });
  await saveToken(data.token);
  return data as { token: string; user: User };
};

export const requestOtp = async (phone: string) => {
  return axios.post('https://example.com/api/otp', { phone });
};

export const logout = async () => {
  await clearToken();
};
