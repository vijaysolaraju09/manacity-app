import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { AuthUser, sendOtp, verifyOtp, refreshToken as refreshTokenApi, updateProfile as updateProfileApi, logoutApi } from '../auth/authService';
import {
  clearToken,
  clearUser,
  getRefreshToken,
  getToken,
  getUser,
  isOnboardingComplete,
  markOnboardingComplete,
  saveRefreshToken,
  saveToken,
  saveUser,
  StoredUser,
} from '../auth/secureStore';

export type Role = 'customer' | 'business' | 'admin';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  onboardingComplete: boolean;
  activeRole: Role;
  login: (phone: string) => Promise<void>;
  verify: (code: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => AuthUser | null;
  updateProfile: (payload: Partial<AuthUser>) => Promise<void>;
  switchRole: (role: Role) => void;
  completeOnboarding: () => Promise<void>;
  pendingPhone: string | null;
  setPendingPhone: (phone: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fallbackUser: AuthUser = {
  id: 'guest',
  name: 'Guest',
  phone: '',
  roles: ['customer'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('customer');
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const [storedUser, token, onboarding] = await Promise.all([getUser(), getToken(), isOnboardingComplete()]);
      setOnboardingComplete(onboarding);
      if (storedUser && token) {
        setUser({ ...fallbackUser, ...storedUser, roles: storedUser.roles || ['customer'] });
        setActiveRole((storedUser.activeRole as Role) || (storedUser.roles?.[0] as Role) || 'customer');
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  const login = useCallback(async (phone: string) => {
    await sendOtp(phone);
    setPendingPhone(phone);
    Toast.show({ type: 'success', text1: 'OTP sent', text2: 'Check your phone for a 6-digit code.' });
  }, []);

  const verify = useCallback(
    async (code: string) => {
      if (!pendingPhone) throw new Error('Missing phone number');
      setLoading(true);
      try {
        const { user: userResponse, tokens } = await verifyOtp(pendingPhone, code);
        const normalizedUser: AuthUser = {
          ...fallbackUser,
          ...userResponse,
          roles: userResponse.roles?.length ? userResponse.roles : ['customer'],
        };
        setUser(normalizedUser);
        setActiveRole((normalizedUser.activeRole as Role) || (normalizedUser.roles[0] as Role));
        await saveUser({ ...normalizedUser, activeRole: (normalizedUser.activeRole as Role) || normalizedUser.roles[0] });
        await saveToken(tokens.accessToken);
        await saveRefreshToken(tokens.refreshToken);
        setPendingPhone(null);
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Invalid OTP', text2: error?.message ?? 'Could not verify code.' });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [pendingPhone],
  );

  const refresh = useCallback(async () => {
    const token = await getRefreshToken();
    if (!token) return;
    try {
      const tokens = await refreshTokenApi(token);
      await saveToken(tokens.accessToken);
      await saveRefreshToken(tokens.refreshToken);
    } catch {
      await logout();
    }
  }, [logout]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setPendingPhone(null);
      setActiveRole('customer');
      await clearToken();
      await clearUser();
      await markOnboardingComplete();
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(() => user, [user]);

  const updateProfile = useCallback(
    async (payload: Partial<AuthUser>) => {
      setLoading(true);
      try {
        const updated = await updateProfileApi(payload);
        const normalizedUser: AuthUser = {
          ...fallbackUser,
          ...updated,
          roles: updated.roles?.length ? updated.roles : ['customer'],
        };
        setUser(normalizedUser);
        await saveUser({ ...normalizedUser, activeRole });
      } finally {
        setLoading(false);
      }
    },
    [activeRole],
  );

  const switchRole = useCallback(
    (role: Role) => {
      setActiveRole(role);
      if (user) {
        const updatedUser: StoredUser = { ...user, activeRole: role };
        setUser({ ...user, activeRole: role });
        saveUser(updatedUser);
      }
    },
    [user],
  );

  const completeOnboarding = useCallback(async () => {
    await markOnboardingComplete();
    setOnboardingComplete(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      onboardingComplete,
      activeRole,
      login,
      verify,
      refresh,
      logout,
      getCurrentUser,
      updateProfile,
      switchRole,
      completeOnboarding,
      pendingPhone,
      setPendingPhone,
    }),
    [user, loading, onboardingComplete, activeRole, login, verify, refresh, logout, getCurrentUser, updateProfile, switchRole, completeOnboarding, pendingPhone],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
