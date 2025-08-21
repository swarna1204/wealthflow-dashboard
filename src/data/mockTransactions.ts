// src/data/mockTransactions.ts
import { Transaction } from '../lib/types';

export const mockTransactions: Transaction[] = [
  // Recent transactions (this week)
  {
    id: '1',
    amount: -85.50,
    category: 'Food & Dining',
    description: 'Grocery Store - Weekly Shopping',
    date: '2025-08-21',
    type: 'expense'
  },
  {
    id: '2',
    amount: -45.30,
    category: 'Transportation',
    description: 'Gas Station - Shell',
    date: '2025-08-20',
    type: 'expense'
  },
  {
    id: '3',
    amount: 4800.00,
    category: 'Income',
    description: 'Salary Deposit - TechCorp',
    date: '2025-08-20',
    type: 'income'
  },
  {
    id: '4',
    amount: -15.99,
    category: 'Entertainment',
    description: 'Netflix Subscription',
    date: '2025-08-19',
    type: 'expense'
  },
  {
    id: '5',
    amount: -65.00,
    category: 'Transportation',
    description: 'Uber Rides',
    date: '2025-08-18',
    type: 'expense'
  },
  {
    id: '6',
    amount: -12.50,
    category: 'Food & Dining',
    description: 'Coffee Shop - Daily Grind',
    date: '2025-08-18',
    type: 'expense'
  },
  {
    id: '7',
    amount: -120.00,
    category: 'Shopping',
    description: 'Amazon Purchase - Electronics',
    date: '2025-08-17',
    type: 'expense'
  },

  // Last week
  {
    id: '8',
    amount: -95.25,
    category: 'Food & Dining',
    description: 'Restaurant - Italian Bistro',
    date: '2025-08-15',
    type: 'expense'
  },
  {
    id: '9',
    amount: -8.50,
    category: 'Transportation',
    description: 'Public Transit - Metro Card',
    date: '2025-08-14',
    type: 'expense'
  },
  {
    id: '10',
    amount: 250.00,
    category: 'Income',
    description: 'Freelance Project Payment',
    date: '2025-08-14',
    type: 'income'
  },
  {
    id: '11',
    amount: -75.80,
    category: 'Bills & Utilities',
    description: 'Electric Bill - ConEd',
    date: '2025-08-13',
    type: 'expense'
  },
  {
    id: '12',
    amount: -25.99,
    category: 'Entertainment',
    description: 'Spotify Premium',
    date: '2025-08-12',
    type: 'expense'
  },
  {
    id: '13',
    amount: -180.00,
    category: 'Shopping',
    description: 'Target - Household Items',
    date: '2025-08-11',
    type: 'expense'
  },
  {
    id: '14',
    amount: -55.40,
    category: 'Food & Dining',
    description: 'Whole Foods Market',
    date: '2025-08-10',
    type: 'expense'
  },

  // Earlier this month
  {
    id: '15',
    amount: -1200.00,
    category: 'Bills & Utilities',
    description: 'Rent Payment',
    date: '2025-08-01',
    type: 'expense'
  },
  {
    id: '16',
    amount: -89.99,
    category: 'Bills & Utilities',
    description: 'Internet Bill - Verizon',
    date: '2025-08-01',
    type: 'expense'
  },
  {
    id: '17',
    amount: -45.00,
    category: 'Bills & Utilities',
    description: 'Phone Bill - T-Mobile',
    date: '2025-08-01',
    type: 'expense'
  },
  {
    id: '18',
    amount: 4800.00,
    category: 'Income',
    description: 'Salary Deposit - TechCorp',
    date: '2025-07-31',
    type: 'income'
  },
  {
    id: '19',
    amount: -150.00,
    category: 'Shopping',
    description: 'Best Buy - Tech Accessories',
    date: '2025-07-30',
    type: 'expense'
  },
  {
    id: '20',
    amount: -32.50,
    category: 'Food & Dining',
    description: 'Thai Restaurant',
    date: '2025-07-29',
    type: 'expense'
  },

  // Investment and savings
  {
    id: '21',
    amount: -500.00,
    category: 'Investments',
    description: 'Monthly Investment - Vanguard',
    date: '2025-08-15',
    type: 'expense'
  },
  {
    id: '22',
    amount: -300.00,
    category: 'Savings',
    description: 'Emergency Fund Transfer',
    date: '2025-08-15',
    type: 'expense'
  },
  {
    id: '23',
    amount: 85.50,
    category: 'Investments',
    description: 'Dividend Payment - Apple Inc.',
    date: '2025-08-10',
    type: 'income'
  },
  {
    id: '24',
    amount: 42.75,
    category: 'Investments',
    description: 'Dividend Payment - Microsoft',
    date: '2025-08-08',
    type: 'income'
  },

  // Previous month for comparison
  {
    id: '25',
    amount: 4800.00,
    category: 'Income',
    description: 'Salary Deposit - TechCorp',
    date: '2025-07-20',
    type: 'income'
  },
  {
    id: '26',
    amount: -1200.00,
    category: 'Bills & Utilities',
    description: 'Rent Payment',
    date: '2025-07-01',
    type: 'expense'
  },
  {
    id: '27',
    amount: -320.50,
    category: 'Food & Dining',
    description: 'Monthly Groceries Total',
    date: '2025-07-15',
    type: 'expense'
  },
  {
    id: '28',
    amount: -180.00,
    category: 'Transportation',
    description: 'Monthly Metro Pass',
    date: '2025-07-01',
    type: 'expense'
  },
  {
    id: '29',
    amount: -95.00,
    category: 'Entertainment',
    description: 'Movie Theater & Dinner',
    date: '2025-07-12',
    type: 'expense'
  },
  {
    id: '30',
    amount: -220.00,
    category: 'Shopping',
    description: 'Clothing & Accessories',
    date: '2025-07-08',
    type: 'expense'
  }
];

// Helper functions for data analysis
export const getTransactionsByCategory = (transactions: Transaction[]) => {
  const categoryTotals: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + Math.abs(transaction.amount);
    });
  
  return categoryTotals;
};

export const getMonthlySpending = (transactions: Transaction[], month: string) => {
  return transactions
    .filter(t => t.date.startsWith(month) && t.type === 'expense')
    .reduce((total, t) => total + Math.abs(t.amount), 0);
};

export const getMonthlyIncome = (transactions: Transaction[], month: string) => {
  return transactions
    .filter(t => t.date.startsWith(month) && t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
};

export const getTotalBalance = (transactions: Transaction[]) => {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'income' 
      ? balance + transaction.amount 
      : balance - Math.abs(transaction.amount);
  }, 15000); // Starting balance
};