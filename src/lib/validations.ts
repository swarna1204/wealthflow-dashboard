// src/lib/validations.ts
import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense'])
});

// Budget validation schema
export const budgetSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  limit: z.number().min(0.01, 'Budget limit must be greater than 0'),
  period: z.enum(['monthly', 'weekly']),
  color: z.string().optional()
});

// Goal validation schema
export const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100, 'Goal name must be less than 100 characters'),
  target: z.number().min(0.01, 'Target amount must be greater than 0'),
  deadline: z.string().min(1, 'Deadline is required'),
  category: z.string().min(1, 'Please select a category'),
  color: z.string().optional()
});

// User profile validation schema
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  avatar: z.string().url().optional().or(z.literal('')),
  preferences: z.object({
    currency: z.string().min(1, 'Currency is required'),
    dateFormat: z.string().min(1, 'Date format is required'),
    theme: z.enum(['light', 'dark']),
    notifications: z.object({
      budgetAlerts: z.boolean(),
      goalReminders: z.boolean(),
      weeklyReports: z.boolean(),
      monthlyReports: z.boolean()
    })
  }).optional()
});

// Search and filter schemas
export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['all', 'income', 'expense']).optional(),
  category: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  amountMin: z.number().optional(),
  amountMax: z.number().optional()
});

// Export types
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type TransactionFilterData = z.infer<typeof transactionFilterSchema>;