// app/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
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
import TransactionForm from '@/components/forms/TransactionForm';
import BudgetForm from '@/components/forms/BudgetForm';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useGoalStore } from '@/store/useGoalStore';
import { useUserStore } from '@/store/useUserStore';

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
  const { transactions, getTotalBalance, getMonthlySpending, getMonthlyIncome } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalStore();
  const { user } = useUserStore();
  
  // Form states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  // Calculate dashboard data
  const dashboardData = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Current month data
    const currentMonthSpending = getMonthlySpending(currentYear, currentMonth);
    const currentMonthIncome = getMonthlyIncome(currentYear, currentMonth);
    
    // Last month data for comparison
    const lastMonthSpending = getMonthlySpending(lastMonthYear, lastMonth);
    const lastMonthIncome = getMonthlyIncome(lastMonthYear, lastMonth);

    // Calculate changes
    const spendingChange = lastMonthSpending > 0 
      ? ((currentMonthSpending - lastMonthSpending) / lastMonthSpending * 100).toFixed(1)
      : '0';
    
    const incomeChange = lastMonthIncome > 0
      ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1)
      : '0';

    // Total balance
    const totalBalance = getTotalBalance();

    // Investment calculation (mock for now)
    const investments = 8923.45;
    const investmentChange = '+5.2';

    // Goals data
    const primaryGoal = goals.find(g => g.name === 'Emergency Fund');
    const goalProgress = primaryGoal ? (primaryGoal.current / primaryGoal.target * 100).toFixed(0) : '0';

    return {
      totalBalance,
      currentMonthSpending,
      spendingChange,
      investments,
      investmentChange,
      goalProgress,
      primaryGoal
    };
  }, [transactions, goals, getMonthlySpending, getMonthlyIncome, getTotalBalance]);

  // Spending chart data (last 6 months)
  const spendingChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const currentDate = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      data.push({
        month: months[date.getMonth()],
        spending: getMonthlySpending(year, month),
        income: getMonthlyIncome(year, month) || 4800
      });
    }

    return data;
  }, [transactions, getMonthlySpending, getMonthlyIncome]);

  // Category breakdown data
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    // Get current month transactions
    const currentDate = new Date();
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentDate.getMonth() &&
             transactionDate.getFullYear() === currentDate.getFullYear() &&
             t.type === 'expense';
    });

    // Calculate totals by category
    currentMonthTransactions.forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + Math.abs(transaction.amount);
    });

    // Convert to chart format
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: Math.round((amount / total) * 100),
        color: budgets.find(b => b.category === category)?.color || '#8B5CF6'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }, [transactions, budgets]);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [transactions]);

  // Active goals (top 3)
  const activeGoals = useMemo(() => {
    return goals
      .slice()
      .sort((a, b) => {
        const progressA = (a.current / a.target) * 100;
        const progressB = (b.current / b.target) * 100;
        return progressB - progressA;
      })
      .slice(0, 3);
  }, [goals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    // Use consistent UTC formatting to prevent hydration errors
    return date.toLocaleDateString('en-US', { 
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTransactionSuccess = () => {
    console.log('Transaction added successfully!');
  };

  const handleBudgetSuccess = () => {
    console.log('Budget created successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Alex'}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your finances today.</p>
          </div>
          <button 
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={formatCurrency(dashboardData.totalBalance)}
            change="+2.5%"
            changeType="positive"
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Monthly Spending"
            value={formatCurrency(dashboardData.currentMonthSpending)}
            change={`${dashboardData.spendingChange}%`}
            changeType={parseFloat(dashboardData.spendingChange) > 0 ? 'negative' : 'positive'}
            icon={CreditCard}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            title="Investments"
            value={formatCurrency(dashboardData.investments)}
            change={`${dashboardData.investmentChange}%`}
            changeType="positive"
            icon={TrendingUp}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Savings Goal"
            value={`${dashboardData.goalProgress}%`}
            change={`${formatCurrency(dashboardData.primaryGoal?.current || 0)} of ${formatCurrency(dashboardData.primaryGoal?.target || 10000)}`}
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
                <AreaChart data={spendingChartData}>
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
              {activeGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: goal.color }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{Math.round(progress)}% complete</span>
                      <span className="text-gray-600">
                        {formatCurrency(goal.target - goal.current)} remaining
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
              {recentTransactions.map((transaction) => (
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
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    <span className="font-semibold">
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
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
              <button 
                onClick={() => setShowBudgetForm(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Budget
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Set New Goal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showTransactionForm && (
          <TransactionForm
            onClose={() => setShowTransactionForm(false)}
            onSuccess={handleTransactionSuccess}
          />
        )}
      </AnimatePresence>

      {/* Budget Form Modal */}
      <AnimatePresence>
        {showBudgetForm && (
          <BudgetForm
            onClose={() => setShowBudgetForm(false)}
            onSuccess={handleBudgetSuccess}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}