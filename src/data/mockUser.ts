// src/data/mockUser.ts
import { User } from '../lib/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://avatar.placeholder.com/alex',
  plan: 'premium',
  preferences: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: true,
      monthlyReports: true
    },
    theme: 'light'
  },
  stats: {
    totalTransactions: 487,
    accountAge: '2 years',
    savingsRate: 0.23,
    totalSaved: 28450.00
  }
};