// src/store/useGoalStore.ts
import { create } from 'zustand';
import { Goal } from '../lib/types';
import { mockGoals } from '../data/mockGoals';

interface GoalStore {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addGoal: (goal: Omit<Goal, 'id' | 'current'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  getGoalProgress: (id: string) => number;
  getGoalsByCategory: (category: string) => Goal[];
  getTotalGoalsValue: () => number;
  getTotalSavedForGoals: () => number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: mockGoals,
  loading: false,
  error: null,

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
    };
    
    set((state) => ({
      goals: [...state.goals, newGoal]
    }));
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id)
    }));
  },

  contributeToGoal: (id, amount) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
          : goal
      )
    }));
  },

  getGoalProgress: (id) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return 0;
    return (goal.current / goal.target) * 100;
  },

  getGoalsByCategory: (category) => {
    return get().goals.filter((goal) => goal.category === category);
  },

  getTotalGoalsValue: () => {
    return get().goals.reduce((total, goal) => total + goal.target, 0);
  },

  getTotalSavedForGoals: () => {
    return get().goals.reduce((total, goal) => total + goal.current, 0);
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));