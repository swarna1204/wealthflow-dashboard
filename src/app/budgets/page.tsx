// src/app/budgets/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BudgetForm from '@/components/forms/BudgetForm';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Budget } from '@/lib/types';

export default function BudgetsPage() {
  const { budgets, deleteBudget } = useBudgetStore();
  const { getTransactionsByCategory } = useTransactionStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    
    const overBudgetCount = budgets.filter(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      return percentage >= 100;
    }).length;

    const nearLimitCount = budgets.filter(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      return percentage >= 80 && percentage < 100;
    }).length;

    const onTrackCount = budgets.filter(budget => {
      const percentage = (budget.spent / budget.limit) * 100;
      return percentage < 80;
    }).length;

    return {
      totalLimit,
      totalSpent,
      overBudgetCount,
      nearLimitCount,
      onTrackCount,
      totalBudgets: budgets.length
    };
  }, [budgets]);

  const getBudgetStatus = (budget: Budget): 'over' | 'near' | 'good' => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'near';
    return 'good';
  };

  const getBudgetPercentage = (budget: Budget): number => {
    return Math.min((budget.spent / budget.limit) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const getStatusIcon = (status: 'over' | 'near' | 'good') => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'near':
        return <TrendingUp className="w-5 h-5 text-amber-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: 'over' | 'near' | 'good') => {
    switch (status) {
      case 'over':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'near':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'good':
        return 'bg-green-50 border-green-200 text-green-700';
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-600 mt-1">
              Track your spending limits and stay on budget
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBudget(undefined);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Budget</span>
          </button>
        </div>

        {/* Budget Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Budget"
            value={formatCurrency(budgetStats.totalLimit)}
            subtitle={`${budgetStats.totalBudgets} budgets active`}
            icon={DollarSign}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(budgetStats.totalSpent)}
            subtitle={`${((budgetStats.totalSpent / budgetStats.totalLimit) * 100).toFixed(1)}% of budget`}
            icon={TrendingDown}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Over Budget"
            value={budgetStats.overBudgetCount}
            subtitle="budgets exceeded"
            icon={AlertTriangle}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            title="On Track"
            value={budgetStats.onTrackCount}
            subtitle="budgets under 80%"
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>

        {/* Budget Cards */}
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {budgets.map((budget, index) => {
              const percentage = getBudgetPercentage(budget);
              const status = getBudgetStatus(budget);
              const remaining = budget.limit - budget.spent;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white p-6 rounded-2xl border-2 ${getStatusColor(status)} transition-all duration-300 hover:shadow-lg`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.color }}
                      />
                      <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status)}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </span>
                      <span className="font-medium">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: budget.color,
                          opacity: status === 'over' ? 0.8 : 1
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{budget.period}</span>
                      </div>
                      <span className={`font-medium ${
                        remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {remaining >= 0 
                          ? `${formatCurrency(remaining)} left`
                          : `${formatCurrency(Math.abs(remaining))} over`
                        }
                      </span>
                    </div>

                    {/* Status Message */}
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      status === 'over' 
                        ? 'bg-red-50 text-red-700'
                        : status === 'near'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {status === 'over' && 'Budget exceeded! Consider reviewing your spending.'}
                      {status === 'near' && 'Approaching budget limit. Monitor spending closely.'}
                      {status === 'good' && 'Spending is on track. Keep it up!'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <DollarSign className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first budget to start tracking your spending limits
            </p>
            <button
              onClick={() => {
                setEditingBudget(undefined);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Budget</span>
            </button>
          </div>
        )}

        {/* Budget Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Budget Management Tips</h3>
              <p className="text-blue-100">
                Set realistic limits, track regularly, and adjust as needed for better financial health.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                💡 Review budgets monthly
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                📊 Track spending patterns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BudgetForm
            budget={editingBudget}
            onClose={() => {
              setShowForm(false);
              setEditingBudget(undefined);
            }}
            onSuccess={() => {
              console.log('Budget saved successfully!');
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}