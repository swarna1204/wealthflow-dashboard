// src/app/analytics/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useBudgetStore } from '../../store/useBudgetStore';
import { useGoalStore } from '../../store/useGoalStore';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { AdvancedCharts } from '../../components/charts/AdvancedCharts';
import { 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  DollarSign
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [activeView, setActiveView] = useState<'overview' | 'spending' | 'budgets' | 'goals'>('overview');
  
  const {
    spendingTrends,
    categoryAnalysis,
    budgetPerformance,
    goalProjections,
    financialHealth,
    loading,
    lastUpdated,
    refreshAnalytics,
    exportData,
    setDateRange
  } = useAnalyticsStore();

  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalStore();

  // Time range options
  const timeRanges = [
    { value: '3months', label: '3 Months', months: 3 },
    { value: '6months', label: '6 Months', months: 6 },
    { value: '12months', label: '1 Year', months: 12 },
    { value: 'ytd', label: 'Year to Date', months: new Date().getMonth() + 1 }
  ];

  useEffect(() => {
    refreshAnalytics(transactions, budgets, goals);
  }, [transactions, budgets, goals, selectedTimeRange]);

  const handleRefresh = () => {
    refreshAnalytics(transactions, budgets, goals);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    exportData(format);
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    const selectedRange = timeRanges.find(r => r.value === range);
    if (selectedRange) {
      const start = new Date();
      start.setMonth(start.getMonth() - selectedRange.months);
      setDateRange({
        start,
        end: new Date(),
        label: selectedRange.label
      });
    }
  };

  // Financial Health Score Component
  const HealthScoreCard = ({ score, title, description, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-2xl font-bold ${
          score >= 80 ? 'text-green-600' : 
          score >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {score}%
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Advanced insights into your financial patterns and performance
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {formatDate(lastUpdated, 'short')} at {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'spending', label: 'Spending Analysis', icon: PieChart },
            { id: 'budgets', label: 'Budget Performance', icon: Target },
            { id: 'goals', label: 'Goal Projections', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Financial Health Overview */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Overall Health Score */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Financial Health Score</h2>
                  <p className="text-blue-100">
                    Your overall financial performance and stability rating
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{financialHealth.overall}</div>
                  <div className="text-blue-100">out of 100</div>
                </div>
              </div>
            </div>

            {/* Health Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthScoreCard
                score={financialHealth.budgetCompliance}
                title="Budget Compliance"
                description="How well you stick to your budgets"
                icon={CheckCircle}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <HealthScoreCard
                score={financialHealth.savingsRate}
                title="Savings Rate"
                description="Percentage of income saved"
                icon={TrendingUp}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <HealthScoreCard
                score={financialHealth.goalProgress}
                title="Goal Progress"
                description="Progress toward financial goals"
                icon={Target}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <HealthScoreCard
                score={financialHealth.spendingStability}
                title="Spending Stability"
                description="Consistency in spending patterns"
                icon={Activity}
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>

            {/* Insights and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {financialHealth.insights.length > 0 ? (
                    financialHealth.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Your financial habits are looking good! Keep up the great work.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {financialHealth.recommendations.length > 0 ? (
                    financialHealth.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No specific recommendations at this time. Continue monitoring your progress.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spending Analysis */}
        {activeView === 'spending' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Trends Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trends</h3>
                <AdvancedCharts 
                  data={spendingTrends} 
                  type="spending-trends" 
                  height={300}
                />
              </div>
            </div>

            {/* Category Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Spent</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Budget</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Variance</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Trend</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryAnalysis.map((category, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-900">{category.category}</td>
                        <td className="py-3 px-4 text-right text-gray-900">
                          {formatCurrency(category.totalSpent)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(category.budgetAllocated)}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          category.variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(category.variance)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            category.trend === 'increasing' ? 'bg-red-100 text-red-800' :
                            category.trend === 'decreasing' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {category.trend === 'increasing' ? <TrendingUp className="w-3 h-3 mr-1" /> :
                             category.trend === 'decreasing' ? <TrendingDown className="w-3 h-3 mr-1" /> :
                             <Activity className="w-3 h-3 mr-1" />}
                            {category.trend}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(category.averageTransaction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Budget Performance */}
        {activeView === 'budgets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetPerformance.map((budget, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      budget.status === 'on-track' ? 'bg-green-100 text-green-800' :
                      budget.status === 'over-budget' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {budget.status.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Utilization</span>
                        <span className="font-semibold">{budget.utilizationRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            budget.utilizationRate > 100 ? 'bg-red-500' :
                            budget.utilizationRate > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.utilizationRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Spent</span>
                        <span className="font-semibold">{formatCurrency(budget.spent)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Remaining</span>
                        <span className="font-semibold">{formatCurrency(budget.remaining)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">Projected monthly spend</div>
                      <div className="font-semibold">{formatCurrency(budget.projectedSpend)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Goal Projections */}
        {activeView === 'goals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goalProjections.map((projection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{projection.goalName}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      projection.currentPace === 'ahead' ? 'bg-green-100 text-green-800' :
                      projection.currentPace === 'behind' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {projection.currentPace}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Current</span>
                        <span className="font-semibold">{formatCurrency(projection.currentAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Target</span>
                        <span className="font-semibold">{formatCurrency(projection.targetAmount)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block">Required Monthly</span>
                        <span className="font-semibold">{formatCurrency(projection.requiredMonthlyContribution)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Completion</span>
                        <span className="font-semibold">{projection.monthsToCompletion} months</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Success Probability</span>
                        <span className={`font-semibold ${
                          projection.probability >= 80 ? 'text-green-600' :
                          projection.probability >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {projection.probability.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            projection.probability >= 80 ? 'bg-green-500' :
                            projection.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${projection.probability}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      Projected completion: {formatDate(projection.projectedCompletionDate, 'short')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
            <div className="text-sm text-gray-600">
              Interactive charts and detailed analysis
            </div>
          </div>
          <AdvancedCharts 
            data={spendingTrends} 
            categoryData={categoryAnalysis}
            budgetData={budgetPerformance}
            goalData={goalProjections}
            type="comprehensive" 
            height={400}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}