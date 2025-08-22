// src/components/forms/TransactionForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  X, 
  DollarSign, 
  Calendar,
  FileText,
  Tag,
  TrendingUp,
  TrendingDown,
  Save,
  Loader2
} from 'lucide-react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { transactionCategories } from '@/data/categories';
import { Transaction } from '@/lib/types';

// Validation schema
const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense'])
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransactionForm({ transaction, onClose, onSuccess }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { updateBudgetSpent } = useBudgetStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? {
      amount: Math.abs(transaction.amount),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type
    } : {
      amount: 0,
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    }
  });

  const selectedType = watch('type');
  const selectedCategory = watch('category');

  // Filter categories based on transaction type
  const availableCategories = transactionCategories.filter(cat => 
    selectedType === 'income' ? cat.type === 'income' : cat.type === 'expense'
  );

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    
    try {
      const transactionData = {
        ...data,
        amount: data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount)
      };

      if (transaction) {
        // Update existing transaction
        updateTransaction(transaction.id, transactionData);
      } else {
        // Add new transaction
        addTransaction(transactionData);
        
        // Update budget if it's an expense
        if (data.type === 'expense') {
          updateBudgetSpent(data.category, data.amount);
        }
      }

      // Success feedback
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
      }, 500);

    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting transaction:', error);
    }
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
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
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
          {/* Transaction Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input
                  type="radio"
                  value="expense"
                  {...register('type')}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedType === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <TrendingDown className="w-5 h-5 mr-2" />
                  <span className="font-medium">Expense</span>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  value="income"
                  {...register('type')}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedType === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">Income</span>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
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

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                rows={3}
                placeholder="Enter transaction description..."
                {...register('description')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register('date')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

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
                  <span>{transaction ? 'Update' : 'Add'} Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}