// src/app/goals/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useGoalStore } from '@/store/useGoalStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { goalCategories } from '@/lib/types';
import { GoalForm } from '@/components/forms/GoalForm';
import { GoalChart } from '@/components/charts/GoalChart';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function GoalsPage() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const { 
    goals, 
    getGoalProgress, 
    getTotalGoalsValue, 
    getTotalSavedForGoals,
    getUpcomingDeadlines,
    getGoalAchievements,
    getSuggestedContribution,
    calculateOptimalDistribution
  } = useGoalStore();

  const { budgets } = useBudgetStore();

  // Calculate monthly surplus from budgets
  const monthlySurplus = budgets.reduce((surplus, budget) => {
    const remaining = budget.limit - budget.spent;
    return surplus + (remaining > 0 ? remaining : 0);
  }, 0) * 0.3;

  const totalGoalsValue = getTotalGoalsValue();
  const totalSaved = getTotalSavedForGoals();
  const overallProgress = totalGoalsValue > 0 ? (totalSaved / totalGoalsValue) * 100 : 0;
  const upcomingDeadlines = getUpcomingDeadlines(3);
  const completedGoals = getGoalAchievements();

  const filteredGoals = goals.filter(goal => {
    switch (activeTab) {
      case 'active':
        return goal.current < goal.target;
      case 'completed':
        return goal.current >= goal.target;
      default:
        return true;
    }
  });

  const statsCards = [
    {
      title: 'Total Goals Value',
      value: formatCurrency(totalGoalsValue),
      icon: Target,
      color: 'blue',
      subtitle: `${goals.length} goals created`
    },
    {
      title: 'Total Saved',
      value: formatCurrency(totalSaved),
      icon: TrendingUp,
      color: 'green',
      subtitle: `${overallProgress.toFixed(1)}% complete`
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.length.toString(),
      icon: Clock,
      color: 'orange',
      subtitle: 'Goals due in 3 months'
    },
    {
      title: 'Completed Goals',
      value: completedGoals.length.toString(),
      icon: CheckCircle2,
      color: 'purple',
      subtitle: 'Goals achieved'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
            <p className="text-gray-600 mt-1">Set and track your financial goals</p>
          </div>
          <button 
            onClick={() => setShowGoalForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Goal</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
              className="bg-white p-6 rounded-2xl border border-gray-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  stat.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                  'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Overall Progress</h2>
              <p className="text-sm text-gray-600">Track your goal completion progress</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">of total goals</p>
            </div>
          </div>
          <GoalChart goals={goals} />
        </div>

        {/* Smart Suggestions */}
        {monthlySurplus > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Contribution Suggestions</h3>
                <p className="text-gray-600 mb-4">
                  Based on your budget surplus of {formatCurrency(monthlySurplus)}, here's how you could allocate funds:
                </p>
                <div className="space-y-3">
                  {calculateOptimalDistribution(monthlySurplus).slice(0, 3).map(({ goalId, amount }) => {
                    const goal = goals.find(g => g.id === goalId);
                    if (!goal) return null;
                    return (
                      <div key={goalId} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                        <span className="text-gray-700 font-medium">{goal.name}</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(amount)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 3).map(goal => {
                    const progress = getGoalProgress(goal.id);
                    const deadline = new Date(goal.deadline);
                    return (
                      <div key={goal.id} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{goal.name}</p>
                          <p className="text-sm text-gray-600">
                            Due {formatDate(goal.deadline, 'short')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-orange-600">
                            {progress.toFixed(1)}% complete
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Your Goals</h2>
              <p className="text-sm text-gray-600">Manage and track all your financial goals</p>
            </div>
            <div className="flex space-x-2">
              {['all', 'active', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal, index) => {
              const progress = getGoalProgress(goal.id);
              const categoryInfo = goalCategories[goal.category];
              const suggestion = getSuggestedContribution(goal.id, monthlySurplus);
              const remaining = goal.target - goal.current;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedGoal(goal.id);
                    setShowGoalForm(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{categoryInfo.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-600">{categoryInfo.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.priority}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Current</span>
                        <span className="font-semibold">{formatCurrency(goal.current)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Target</span>
                        <span className="font-semibold">{formatCurrency(goal.target)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Remaining</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(remaining)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Deadline</span>
                        <span className="font-semibold">{formatDate(goal.deadline, 'short')}</span>
                      </div>
                    </div>

                    {suggestion > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Suggested monthly</p>
                        <p className="text-sm font-semibold text-green-600">{formatCurrency(suggestion)}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-16">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'completed' ? 'No completed goals yet' : 
                 activeTab === 'active' ? 'No active goals' : 'No goals created yet'}
              </h3>
              <p className="text-gray-600 mb-8">
                {activeTab === 'all' ? 'Create your first financial goal to get started' : 
                 'Switch to a different tab to see other goals'}
              </p>
              {activeTab === 'all' && (
                <button 
                  onClick={() => setShowGoalForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Goal</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <GoalForm 
          onClose={() => {
            setShowGoalForm(false);
            setSelectedGoal(null);
          }}
          goalId={selectedGoal}
        />
      )}
    </DashboardLayout>
  );
}