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
  color: string; // Add this for UI consistency
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  color: string; // Add this for progress bars
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
}