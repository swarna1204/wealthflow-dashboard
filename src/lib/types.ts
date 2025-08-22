// src/lib/types.ts
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
  color: string;
}

// Enhanced Goal interface with new properties
export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: 'emergency' | 'vacation' | 'house' | 'car' | 'education' | 'retirement' | 'investment' | 'other';
  color: string;
  // New enhanced properties
  description?: string;
  priority: 'high' | 'medium' | 'low';
  monthlyContribution?: number;
  autoContribute?: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  preferences: {
    currency: string;
    dateFormat: string;
    notifications: {
      budgetAlerts: boolean;
      goalReminders: boolean;
      weeklyReports: boolean;
      monthlyReports: boolean;
    };
    theme: 'light' | 'dark';
  };
  stats: {
    totalTransactions: number;
    accountAge: string;
    savingsRate: number;
    totalSaved: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

// Chart data types
export interface ChartDataPoint {
  month: string;
  spending: number;
  income: number;
}

export interface CategoryChartData {
  name: string;
  value: number;
  color: string;
}

// Goal-specific chart data types (NEW)
export interface GoalProgressData {
  name: string;
  progress: number;
  current: number;
  target: number;
  remaining: number;
  category: string;
  color: string;
}

export interface GoalTimelineData {
  name: string;
  months: number;
  progress: number;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

// Form types
export interface TransactionFormData {
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface BudgetFormData {
  category: string;
  limit: number;
  period: 'monthly' | 'weekly';
}

// Enhanced GoalFormData with new fields
export interface GoalFormData {
  name: string;
  target: number;
  deadline: string;
  category: 'emergency' | 'vacation' | 'house' | 'car' | 'education' | 'retirement' | 'investment' | 'other';
  description?: string;
  priority: 'high' | 'medium' | 'low';
  monthlyContribution?: number;
  autoContribute?: boolean;
  notes?: string;
}

// Goal management utility types (NEW)
export interface GoalContributionSuggestion {
  goalId: string;
  goalName: string;
  suggestedAmount: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GoalDistribution {
  goalId: string;
  amount: number;
}

export interface GoalMilestone {
  goalId: string;
  percentage: number;
  amount: number;
  achieved: boolean;
  achievedDate?: string;
}

// Goal category configuration with icons and colors
export const goalCategories = {
  emergency: { label: 'Emergency Fund', icon: '🚨', color: '#ef4444' },
  vacation: { label: 'Vacation', icon: '✈️', color: '#3b82f6' },
  house: { label: 'House/Property', icon: '🏠', color: '#10b981' },
  car: { label: 'Vehicle', icon: '🚗', color: '#f59e0b' },
  education: { label: 'Education', icon: '🎓', color: '#8b5cf6' },
  retirement: { label: 'Retirement', icon: '👴', color: '#6366f1' },
  investment: { label: 'Investment', icon: '📈', color: '#14b8a6' },
  other: { label: 'Other', icon: '🎯', color: '#6b7280' },
} as const;

// Goal priority configuration
export const goalPriorities = {
  high: { label: 'High Priority', color: '#ef4444', multiplier: 1.5 },
  medium: { label: 'Medium Priority', color: '#f59e0b', multiplier: 1.0 },
  low: { label: 'Low Priority', color: '#6b7280', multiplier: 0.7 },
} as const;

// Goal status configuration (NEW)
export const goalStatuses = {
  active: { label: 'Active', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#10b981' },
  paused: { label: 'Paused', color: '#f59e0b' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
} as const;

// Type helpers for goal categories and priorities
export type GoalCategory = keyof typeof goalCategories;
export type GoalPriority = keyof typeof goalPriorities;
export type GoalStatus = keyof typeof goalStatuses;

// Chart type configuration for goal charts (NEW)
export type GoalChartType = 'progress' | 'category' | 'timeline' | 'comparison';