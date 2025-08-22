// src/store/useGoalStore.ts
import { create } from 'zustand';
import { Goal } from '../lib/types';
import { mockGoals } from '../data/mockGoals';

interface GoalStore {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  getGoalProgress: (id: string) => number;
  getGoalsByCategory: (category: string) => Goal[];
  getTotalGoalsValue: () => number;
  getTotalSavedForGoals: () => number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Enhanced functionality
  getSuggestedContribution: (id: string, monthlySurplus: number) => number;
  getGoalsByPriority: (priority: 'high' | 'medium' | 'low') => Goal[];
  getMonthsToCompletion: (id: string, monthlyContribution?: number) => number;
  getUpcomingDeadlines: (months: number) => Goal[];
  calculateOptimalDistribution: (availableAmount: number) => { goalId: string; amount: number }[];
  getGoalAchievements: () => Goal[];
  updateGoalFromTransaction: (transactionAmount: number, goalId: string) => void;
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      goals: [...state.goals, newGoal]
    }));
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { 
          ...goal, 
          ...updates,
          updatedAt: new Date().toISOString()
        } : goal
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
          ? { 
              ...goal, 
              current: Math.min(goal.current + amount, goal.target),
              updatedAt: new Date().toISOString()
            }
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

  // Enhanced functionality
  getSuggestedContribution: (id, monthlySurplus) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal || monthlySurplus <= 0) return 0;

    const remaining = goal.target - goal.current;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const monthsRemaining = Math.max(1, 
      (deadline.getFullYear() - today.getFullYear()) * 12 + 
      (deadline.getMonth() - today.getMonth())
    );

    // Suggest minimum required to meet deadline
    const minimumRequired = remaining / monthsRemaining;
    
    // Factor in priority (high priority gets more allocation)
    const priorityMultiplier = goal.priority === 'high' ? 1.5 : goal.priority === 'medium' ? 1.0 : 0.7;
    const suggested = Math.min(minimumRequired * priorityMultiplier, monthlySurplus * 0.4);
    
    return Math.max(0, Math.round(suggested));
  },

  getGoalsByPriority: (priority) => {
    return get().goals.filter((goal) => goal.priority === priority);
  },

  getMonthsToCompletion: (id, monthlyContribution = 0) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal || monthlyContribution <= 0) return Infinity;

    const remaining = goal.target - goal.current;
    return Math.ceil(remaining / monthlyContribution);
  },

  getUpcomingDeadlines: (months = 6) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + months);
    
    return get().goals
      .filter((goal) => new Date(goal.deadline) <= cutoffDate)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  },

  calculateOptimalDistribution: (availableAmount) => {
    const { goals } = get();
    const activeGoals = goals.filter((goal) => goal.current < goal.target);
    
    if (activeGoals.length === 0 || availableAmount <= 0) return [];

    // Sort by priority and urgency
    const sortedGoals = activeGoals.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aDeadline = new Date(a.deadline).getTime();
      const bDeadline = new Date(b.deadline).getTime();
      const now = Date.now();
      
      const aUrgency = Math.max(0, 1 - (aDeadline - now) / (365 * 24 * 60 * 60 * 1000));
      const bUrgency = Math.max(0, 1 - (bDeadline - now) / (365 * 24 * 60 * 60 * 1000));
      
      const aScore = priorityWeight[a.priority] + aUrgency;
      const bScore = priorityWeight[b.priority] + bUrgency;
      
      return bScore - aScore;
    });

    const distribution: { goalId: string; amount: number }[] = [];
    let remainingAmount = availableAmount;

    // Allocate to high priority goals first
    for (const goal of sortedGoals) {
      if (remainingAmount <= 0) break;
      
      const needed = goal.target - goal.current;
      const allocation = Math.min(needed, remainingAmount * 0.3); // Max 30% to any single goal
      
      if (allocation > 0) {
        distribution.push({ goalId: goal.id, amount: Math.round(allocation) });
        remainingAmount -= allocation;
      }
    }

    return distribution;
  },

  getGoalAchievements: () => {
    return get().goals.filter((goal) => goal.current >= goal.target);
  },

  updateGoalFromTransaction: (transactionAmount, goalId) => {
    get().contributeToGoal(goalId, transactionAmount);
  },
}));