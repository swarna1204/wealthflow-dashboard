// src/store/useTransactionStore.ts
import { create } from 'zustand';
import { Transaction } from '../lib/types';
import { mockTransactions } from '../data/mockTransactions';

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByCategory: (category: string) => Transaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getMonthlySpending: (year: number, month: number) => number;
  getMonthlyIncome: (year: number, month: number) => number;
  getTotalBalance: () => number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: mockTransactions,
  loading: false,
  error: null,

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions]
    }));
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    }));
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id)
    }));
  },

  getTransactionsByCategory: (category) => {
    return get().transactions.filter((transaction) => transaction.category === category);
  },

  getTransactionsByDateRange: (startDate, endDate) => {
    return get().transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  },

  getMonthlySpending: (year, month) => {
    const transactions = get().transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        transaction.type === 'expense'
      );
    });
    
    return transactions.reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  },

  getMonthlyIncome: (year, month) => {
    const transactions = get().transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        transaction.type === 'income'
      );
    });
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  },

  getTotalBalance: () => {
    const transactions = get().transactions;
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income'
        ? balance + transaction.amount
        : balance - Math.abs(transaction.amount);
    }, 15000); // Starting balance
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
