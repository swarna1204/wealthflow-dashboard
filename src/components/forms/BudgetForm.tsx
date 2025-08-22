// src/components/forms/BudgetForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { 
  X, 
  DollarSign, 
  Tag,
  Calendar,
  Palette,
  Save,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { budgetSchema, BudgetFormData } from '@/lib/validations';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { transactionCategories } from '@/data/categories';
import { Budget } from '@/lib/types';

interface BudgetFormProps {
  budget?: Budget;
  onClose: () => void;
  onSuccess?: () => void;
}

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#AB47BC',
  '#26A69A', '#FF7043', '#66BB6A', '#42A5F5', '#8E24AA',
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'
];

export default function BudgetForm({ budget, onClose, onSuccess }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(budget?.color || '#4ECDC4');
  const { addBudget, updateBudget, budgets } = useBudgetStore();
  const { transactions } = useTransactionStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget ? {
      category: budget.category,
      limit: budget.limit,
      period: budget.period
    } : {
      category: '',
      limit: 0,
      period: 'monthly'
    }
  });

  const selectedCategory = watch('category');
  const selectedPeriod = watch('period');

  // Filter out categories that already have budgets (except current one)
  const availableCategories = transactionCategories.filter(cat => {
    if (cat.type !== 'expense') return false;
    if (budget && cat.name === budget.category) return true;
    
    const existingBudget = budgets.find(b => b.category === cat.name);
    return !existingBudget;
  });

  // Calculate current spending for selected category
  const getCurrentSpending = (category: string) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const currentSpending = selectedCategory ? getCurrentSpending(selectedCategory) : 0;

  const onSubmit = async (data: BudgetFormData) => {
    setIsSubmitting(true);
    
    try {
      const budgetData = {
        category: data.category,
        limit: data.limit,
        period: data.period,
        color: selectedColor
      };

      if (budget) {
        // Update existing budget
        updateBudget(budget.id, budgetData);
      } else {
        // Add new budget - the store will handle setting spent to 0 initially
        addBudget(budgetData);
      }

      // Success feedback
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
      }, 500);

    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting budget:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = transactionCategories.find(cat => cat.name === categoryName);
    return category?.icon || '📝';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                {...register('category')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget Limit
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('limit', { valueAsNumber: true })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            {errors.limit && (
              <p className="text-sm text-red-600">{errors.limit.message}</p>
            )}
          </div>

          {/* Period Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Budget Period
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input
                  type="radio"
                  value="monthly"
                  {...register('period')}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPeriod === 'monthly'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">Monthly</span>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="weekly"
                  {...register('period')}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPeriod === 'weekly'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">Weekly</span>
                </div>
              </label>
            </div>
            {errors.period && (
              <p className="text-sm text-red-600">{errors.period.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              <Palette className="w-4 h-4 inline mr-2" />
              Budget Color
            </label>
            <div className="grid grid-cols-10 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Current Spending Info */}
          {selectedCategory && !budget && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Current {selectedPeriod} spending in {getCategoryIcon(selectedCategory)} {selectedCategory}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(currentSpending)}
              </div>
              {currentSpending > 0 && (
                <div className="flex items-center mt-2 text-sm text-amber-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>Existing spending will need to be manually tracked</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{budget ? 'Update' : 'Create'} Budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}