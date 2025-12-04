import apiClient from '../api/client';
import { saveToken, saveRefreshToken, saveUser, clearToken, clearUser, StoredUser } from './secureStore';

export interface AuthUser extends StoredUser {}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export const sendOtp = async (phone: string) => {
  return apiClient.post('/auth/send-otp', { phone });
};

export const verifyOtp = async (phone: string, code: string): Promise<VerifyOtpResponse> => {
  const { data } = await apiClient.post('/auth/verify-otp', { phone, code });
  const { accessToken, refreshToken, user } = data as { accessToken: string; refreshToken: string; user: AuthUser };

  await saveToken(accessToken);
  await saveRefreshToken(refreshToken);
  await saveUser(user);
  return { tokens: { accessToken, refreshToken }, user };
};

export const refreshToken = async (token: string): Promise<AuthTokens> => {
  const { data } = await apiClient.post('/auth/refresh-token', { refreshToken: token });
  const tokens = data as AuthTokens;
  await saveToken(tokens.accessToken);
  await saveRefreshToken(tokens.refreshToken);
  return tokens;
};

export const getProfile = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get('/auth/me');
  const user = data as AuthUser;
  await saveUser(user);
  return user;
};

export const updateProfile = async (payload: Partial<AuthUser>): Promise<AuthUser> => {
  const { data } = await apiClient.put('/auth/profile', payload);
  const user = data as AuthUser;
  await saveUser(user);
  return user;
};

export const logoutApi = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // ignore network errors on logout
  }
  await clearToken();
  await clearUser();
};
