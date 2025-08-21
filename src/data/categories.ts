// src/data/categories.ts
import { Budget, Goal } from '../lib/types';

export const transactionCategories = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#FF6B6B',
    type: 'expense' as const
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense' as const
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#45B7D1',
    type: 'expense' as const
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#FFA726',
    type: 'expense' as const
  },
  {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#AB47BC',
    type: 'expense' as const
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: '#26A69A',
    type: 'expense' as const
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '💄',
    color: '#FF7043',
    type: 'expense' as const
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: '📈',
    color: '#66BB6A',
    type: 'expense' as const
  },
  {
    id: 'savings',
    name: 'Savings',
    icon: '💰',
    color: '#42A5F5',
    type: 'expense' as const
  },
  {
    id: 'income',
    name: 'Income',
    icon: '💵',
    color: '#4CAF50',
    type: 'income' as const
  }
];

// Helper functions for budget calculations
export const getBudgetStatus = (budget: Budget): 'under' | 'near' | 'over' => {
  const percentage = (budget.spent / budget.limit) * 100;
  if (percentage >= 100) return 'over';
  if (percentage >= 80) return 'near';
  return 'under';
};

export const getBudgetPercentage = (budget: Budget): number => {
  return Math.min((budget.spent / budget.limit) * 100, 100);
};

export const getRemainingBudget = (budget: Budget): number => {
  return Math.max(budget.limit - budget.spent, 0);
};

// Helper functions for goal calculations
export const getGoalProgress = (goal: Goal): number => {
  return (goal.current / goal.target) * 100;
};

export const getGoalTimeRemaining = (goal: Goal): string => {
  const deadline = new Date(goal.deadline);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return '1 day left';
  if (diffDays < 30) return `${diffDays} days left`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
  return `${Math.ceil(diffDays / 365)} years left`;
};

export const getMonthlyGoalContribution = (goal: Goal): number => {
  const deadline = new Date(goal.deadline);
  const now = new Date();
  const monthsRemaining = Math.max(
    (deadline.getFullYear() - now.getFullYear()) * 12 + 
    (deadline.getMonth() - now.getMonth()), 
    1
  );
  
  const remainingAmount = goal.target - goal.current;
  return remainingAmount / monthsRemaining;
};