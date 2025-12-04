import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'manacity_token';
const REFRESH_KEY = 'manacity_refresh';
const USER_KEY = 'manacity_user';
const ONBOARDING_KEY = 'manacity_onboarding';

export interface StoredUser {
  id: string;
  name: string;
  phone: string;
  location?: string;
  avatar?: string;
  roles: string[];
  activeRole?: string;
}

export const saveToken = async (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken = async () => SecureStore.getItemAsync(TOKEN_KEY);
export const saveRefreshToken = async (token: string) => SecureStore.setItemAsync(REFRESH_KEY, token);
export const getRefreshToken = async () => SecureStore.getItemAsync(REFRESH_KEY);
export const clearToken = async () => Promise.all([
  SecureStore.deleteItemAsync(TOKEN_KEY),
  SecureStore.deleteItemAsync(REFRESH_KEY),
]);

export const saveUser = async (user: StoredUser) => SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
export const getUser = async (): Promise<StoredUser | null> => {
  const stored = await SecureStore.getItemAsync(USER_KEY);
  return stored ? (JSON.parse(stored) as StoredUser) : null;
};

export const clearUser = async () => SecureStore.deleteItemAsync(USER_KEY);

export const markOnboardingComplete = async () => SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
export const isOnboardingComplete = async () => (await SecureStore.getItemAsync(ONBOARDING_KEY)) === 'true';
