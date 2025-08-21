// src/data/mockGoals.ts
import { Goal } from '../lib/types';

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 10000.00,
    current: 6700.00,
    deadline: '2025-12-31',
    category: 'Savings',
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Vacation to Japan',
    target: 5000.00,
    current: 2300.00,
    deadline: '2026-06-15',
    category: 'Travel',
    color: '#3B82F6'
  },
  {
    id: '3',
    name: 'New Car Down Payment',
    target: 25000.00,
    current: 8500.00,
    deadline: '2026-03-01',
    category: 'Transportation',
    color: '#8B5CF6'
  },
  {
    id: '4',
    name: 'Home Down Payment',
    target: 50000.00,
    current: 12750.00,
    deadline: '2027-08-01',
    category: 'Housing',
    color: '#F59E0B'
  },
  {
    id: '5',
    name: 'Retirement Fund',
    target: 100000.00,
    current: 23450.00,
    deadline: '2030-01-01',
    category: 'Investment',
    color: '#EF4444'
  },
  {
    id: '6',
    name: 'MacBook Pro',
    target: 2500.00,
    current: 1850.00,
    deadline: '2025-11-30',
    category: 'Technology',
    color: '#06B6D4'
  }
];