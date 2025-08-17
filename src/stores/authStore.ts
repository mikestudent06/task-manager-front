import { create } from "zustand";
import { tokenManager } from "../lib/axios";
import type { User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user: User) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  setAuth: (user: User, accessToken: string) => {
    tokenManager.setToken(accessToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    tokenManager.clearToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  clearAuth: () => {
    tokenManager.clearToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// Listen for auth events from axios interceptor
window.addEventListener("auth:logout", () => {
  useAuthStore.getState().clearAuth();
});
