// src/components/forms/GoalForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useGoalStore } from '../../store/useGoalStore';
import { goalCategories } from '../../lib/types';
import { 
  X, 
  Target, 
  Calendar, 
  DollarSign, 
  Info,
  Calculator,
  Tag
} from 'lucide-react';

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(50, 'Name too long'),
  description: z.string().optional(),
  target: z.number().min(1, 'Target amount must be greater than 0'),
  category: z.enum(['emergency', 'vacation', 'house', 'car', 'education', 'retirement', 'investment', 'other']),
  priority: z.enum(['high', 'medium', 'low']),
  deadline: z.string().min(1, 'Deadline is required'),
  monthlyContribution: z.number().optional(),
  autoContribute: z.boolean().optional(),
  notes: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  onClose: () => void;
  goalId?: string | null;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onClose, goalId }) => {
  const { goals, addGoal, updateGoal } = useGoalStore();
  const existingGoal = goalId ? goals.find(g => g.id === goalId) : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: existingGoal ? {
      name: existingGoal.name,
      description: existingGoal.description || '',
      target: existingGoal.target,
      category: existingGoal.category,
      priority: existingGoal.priority,
      deadline: existingGoal.deadline.split('T')[0],
      monthlyContribution: existingGoal.monthlyContribution || 0,
      autoContribute: existingGoal.autoContribute || false,
      notes: existingGoal.notes || '',
    } : {
      category: 'other',
      priority: 'medium',
      autoContribute: false,
    }
  });

  const watchedValues = watch();
  const { target, deadline, monthlyContribution } = watchedValues;

  const calculateSuggestedContribution = () => {
    if (!target || !deadline) return 0;
    
    const targetDate = new Date(deadline);
    const today = new Date();
    const monthsRemaining = Math.max(1, 
      (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth())
    );
    
    const currentAmount = existingGoal?.current || 0;
    const remaining = target - currentAmount;
    return Math.ceil(remaining / monthsRemaining);
  };

  const suggestedContribution = calculateSuggestedContribution();

  const setSuggestedContribution = () => {
    setValue('monthlyContribution', suggestedContribution);
  };

  const onSubmit = async (data: GoalFormData) => {
    try {
      const goalData = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
        color: goalCategories[data.category].color,
        icon: goalCategories[data.category].icon,
        createdAt: existingGoal?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingGoal) {
        updateGoal(existingGoal.id, goalData);
      } else {
        addGoal(goalData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {existingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name *
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g., Emergency Fund, Vacation to Japan"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  {...register('description')}
                  placeholder="Brief description of your goal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(goalCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('target', { valueAsNumber: true })}
                      placeholder="10000.00"
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.target ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.target && (
                    <p className="text-red-500 text-sm mt-1">{errors.target.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="date"
                      {...register('deadline')}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                  )}
                </div>
              </div>

              {/* Monthly Contribution */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Contribution (Optional)
                  </label>
                  {suggestedContribution > 0 && (
                    <button
                      type="button"
                      onClick={setSuggestedContribution}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                    >
                      <Calculator className="h-3 w-3 inline mr-1" />
                      Use Suggested: ${suggestedContribution}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('monthlyContribution', { valueAsNumber: true })}
                    placeholder="500.00"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {suggestedContribution > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Suggested: ${suggestedContribution}/month to reach your goal on time
                  </p>
                )}
              </div>

              {/* Auto Contribute Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('autoContribute')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Enable automatic monthly contributions
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Any additional notes about this goal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Goal Summary */}
            {target && deadline && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Goal Summary</h4>
                <div className="text-sm space-y-1 text-blue-800">
                  <p>Target: ${target.toLocaleString()}</p>
                  <p>Deadline: {new Date(deadline).toLocaleDateString()}</p>
                  {monthlyContribution && (
                    <p>Monthly Contribution: ${monthlyContribution}</p>
                  )}
                  {suggestedContribution > 0 && (
                    <p>Months to complete: {Math.ceil((target - (existingGoal?.current || 0)) / (monthlyContribution || suggestedContribution))}</p>
                  )}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : existingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};