// src/store/useUserStore.ts
import { create } from 'zustand';
import { User } from '../lib/types';
import { mockUser } from '../data/mockUser';

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: mockUser,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  },

  updatePreferences: (preferences) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences }
          }
        : null
    }));
  },

  logout: () => set({ user: null }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));