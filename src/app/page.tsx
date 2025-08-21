// app/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data
const spendingData = [
  { month: 'Jan', spending: 2400, income: 4800 },
  { month: 'Feb', spending: 2200, income: 4800 },
  { month: 'Mar', spending: 2800, income: 4800 },
  { month: 'Apr', spending: 2400, income: 4800 },
  { month: 'May', spending: 2600, income: 4800 },
  { month: 'Jun', spending: 2847, income: 4800 },
];

const categoryData = [
  { name: 'Food & Dining', value: 28, color: '#FF6B6B' },
  { name: 'Transportation', value: 22, color: '#4ECDC4' },
  { name: 'Shopping', value: 18, color: '#45B7D1' },
  { name: 'Entertainment', value: 15, color: '#FFA726' },
  { name: 'Bills & Utilities', value: 17, color: '#AB47BC' },
];

const recentTransactions = [
  { id: 1, description: 'Grocery Store', amount: -85.50, category: 'Food', date: '2 hours ago', type: 'expense' },
  { id: 2, description: 'Salary Deposit', amount: 4800.00, category: 'Income', date: '1 day ago', type: 'income' },
  { id: 3, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2 days ago', type: 'expense' },
  { id: 4, description: 'Gas Station', amount: -65.00, category: 'Transportation', date: '3 days ago', type: 'expense' },
];

const goals = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 6700, color: 'bg-green-500' },
  { id: 2, name: 'Vacation', target: 5000, current: 2300, color: 'bg-blue-500' },
  { id: 3, name: 'New Car', target: 25000, current: 8500, color: 'bg-purple-500' },
];

const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    className="bg-white p-6 rounded-2xl border border-gray-200 transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span className="font-medium">{change}</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your finances today.</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value="$12,345.67"
            change="+2.5%"
            changeType="positive"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Monthly Spending"
            value="$2,847.30"
            change="+12%"
            changeType="negative"
            icon={CreditCard}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            title="Investments"
            value="$8,923.45"
            change="+5.2%"
            changeType="positive"
            icon={TrendingUp}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Savings Goal"
            value="67%"
            change="$6,700 of $10,000"
            changeType="positive"
            icon={Target}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
                <p className="text-sm text-gray-600">Monthly income vs spending</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spending"
                    stroke="#EF4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#spendingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Categories */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-600">This month's breakdown</p>
              </div>
            </div>
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals and Transactions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Progress */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
                <p className="text-sm text-gray-600">Track your progress</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-6">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <span className="text-sm text-gray-600">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-2 rounded-full ${goal.color}`}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{Math.round(progress)}% complete</span>
                      <span className="text-gray-600">
                        ${(goal.target - goal.current).toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Your latest financial activity</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    <span className="font-semibold">
                      {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Take Control of Your Finances</h3>
              <p className="text-blue-100">
                Set budgets, track expenses, and reach your financial goals faster.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Create Budget
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Set New Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}