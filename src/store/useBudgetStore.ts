// src/store/useBudgetStore.ts
import { create } from 'zustand';
import { Budget } from '../lib/types';
import { mockBudgets } from '../data/mockBudgets';

interface BudgetStore {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  updateBudgetSpent: (category: string, amount: number) => void;
  getBudgetByCategory: (category: string) => Budget | undefined;
  getBudgetStatus: (id: string) => 'under' | 'near' | 'over';
  getTotalBudgetLimit: () => number;
  getTotalBudgetSpent: () => number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: mockBudgets,
  loading: false,
  error: null,

  addBudget: (budget) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    
    set((state) => ({
      budgets: [...state.budgets, newBudget]
    }));
  },

  updateBudget: (id, updates) => {
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      )
    }));
  },

  deleteBudget: (id) => {
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== id)
    }));
  },

  updateBudgetSpent: (category, amount) => {
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.category === category
          ? { ...budget, spent: budget.spent + amount }
          : budget
      )
    }));
  },

  getBudgetByCategory: (category) => {
    return get().budgets.find((budget) => budget.category === category);
  },

  getBudgetStatus: (id) => {
    const budget = get().budgets.find((b) => b.id === id);
    if (!budget) return 'under';
    
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'near';
    return 'under';
  },

  getTotalBudgetLimit: () => {
    return get().budgets.reduce((total, budget) => total + budget.limit, 0);
  },

  getTotalBudgetSpent: () => {
    return get().budgets.reduce((total, budget) => total + budget.spent, 0);
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));