import { create } from 'zustand';
import { User } from '../auth/authService';

interface AuthState {
  user?: User;
  token?: string;
  setSession: (payload: { user: User; token: string }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  token: undefined,
  setSession: ({ user, token }) => set({ user, token }),
  clearSession: () => set({ user: undefined, token: undefined }),
}));
