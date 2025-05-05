"use client";

import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  setUser: (user: any) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAccessToken: (token) => set({ accessToken: token }),
  logout: () => {
    set({ isAuthenticated: false, user: null, accessToken: null });
  },
}));
