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

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  color: string;
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

export interface GoalFormData {
  name: string;
  target: number;
  deadline: string;
  category: string;
}