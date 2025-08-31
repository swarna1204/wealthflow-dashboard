// src/app/investments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import useInvestmentStore, { 
  usePortfolio, 
  useHoldings, 
  useInvestmentGoals,
  usePerformanceMetrics,
  useInvestmentLoading 
} from '@/store/useInvestmentStore';
import { investmentDevUtils } from '@/lib/investments/dataInitializer';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddHoldingForm from '@/components/forms/AddHoldingForm';

// Portfolio Overview Cards
const PortfolioOverview = () => {
  const portfolio = usePortfolio();
  const isLoading = useInvestmentLoading();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm mb-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolio Data</h3>
        <p className="text-gray-600 mb-4">Add your first investment to get started</p>
        <button 
          onClick={() => investmentDevUtils.initialize('advanced')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load Sample Portfolio
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const cards = [
    {
      title: 'Total Value',
      value: formatCurrency(portfolio.totalValue),
      change: formatCurrency(portfolio.dailyChange),
      changePercent: formatPercent(portfolio.dailyChangePercent),
      isPositive: portfolio.dailyChange >= 0,
    },
    {
      title: 'Total Return',
      value: formatCurrency(portfolio.totalReturn),
      change: formatPercent(portfolio.totalReturnPercent),
      changePercent: 'Since inception',
      isPositive: portfolio.totalReturn >= 0,
    },
    {
      title: 'Cost Basis',
      value: formatCurrency(portfolio.totalCost),
      change: 'Investment',
      changePercent: 'Total invested',
      isPositive: true,
    },
    {
      title: 'Day Change',
      value: formatCurrency(Math.abs(portfolio.dailyChange)),
      change: formatPercent(portfolio.dailyChangePercent),
      changePercent: 'Today',
      isPositive: portfolio.dailyChange >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
          <div className="flex items-center text-sm">
            <span className={`${card.isPositive ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {card.change}
            </span>
            <span className="text-gray-500 ml-2">{card.changePercent}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Asset Allocation Chart
const AssetAllocationChart = () => {
  const portfolio = usePortfolio();

  if (!portfolio) return null;

  const { assetAllocation } = portfolio;
  const totalValue = portfolio.totalValue;

  const allocationData = [
    { name: 'Stocks', value: assetAllocation.stocks, amount: (totalValue * assetAllocation.stocks) / 100, color: '#3B82F6' },
    { name: 'ETFs', value: assetAllocation.etfs, amount: (totalValue * assetAllocation.etfs) / 100, color: '#10B981' },
    { name: 'Bonds', value: assetAllocation.bonds, amount: (totalValue * assetAllocation.bonds) / 100, color: '#F59E0B' },
    { name: 'Crypto', value: assetAllocation.crypto, amount: (totalValue * assetAllocation.crypto) / 100, color: '#8B5CF6' },
    { name: 'Cash', value: assetAllocation.cash, amount: (totalValue * assetAllocation.cash) / 100, color: '#6B7280' },
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
      <div className="space-y-4">
        {allocationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{item.value.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{formatCurrency(item.amount)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Holdings List
const HoldingsList = ({ onEditHolding }: { onEditHolding?: (holding: any) => void }) => {
  const holdings = useHoldings();
  const { removeHolding } = useInvestmentStore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      removeHolding(id);
    }
  };

  if (holdings.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Holdings</h3>
        <p className="text-gray-600 mb-4">Add your first investment to get started</p>
        <button 
          onClick={() => investmentDevUtils.addTestHolding()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Test Holding
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shares
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Return
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allocation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding) => (
              <motion.tr
                key={holding.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                    <div className="text-sm text-gray-500">{holding.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {holding.shares}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(holding.currentPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(holding.marketValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {formatCurrency(holding.dayChange)} ({formatPercent(holding.dayChangePercent)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {formatCurrency(holding.totalReturn)} ({formatPercent(holding.totalReturnPercent)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {holding.allocation.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {onEditHolding && (
                      <button
                        onClick={() => onEditHolding(holding)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(holding.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Investment Goals Section
const InvestmentGoalsSection = () => {
  const goals = useInvestmentGoals();

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investment Goals</h3>
        <p className="text-gray-600 mb-4">Set your first investment goal</p>
        <button 
          onClick={() => investmentDevUtils.addTestGoal()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Test Goal
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600 bg-green-50';
      case 'behind': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Investment Goals</h3>
      </div>
      <div className="p-6 space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-600">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current</p>
                  <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className="font-medium">{formatCurrency(remaining)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Performance Metrics Card
const PerformanceMetrics = () => {
  const metrics = usePerformanceMetrics();

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <p className="text-gray-600">No performance data available</p>
      </div>
    );
  }

  const metricItems = [
    { label: 'Volatility', value: `${metrics.volatility.toFixed(2)}%`, description: 'Risk measure' },
    { label: 'Sharpe Ratio', value: metrics.sharpeRatio.toFixed(2), description: 'Risk-adjusted return' },
    { label: 'Beta', value: metrics.beta.toFixed(2), description: 'Market correlation' },
    { label: 'Max Drawdown', value: `${metrics.maxDrawdown.toFixed(2)}%`, description: 'Worst decline' },
    { label: 'Annual Return', value: `${metrics.annualizedReturn.toFixed(2)}%`, description: 'Yearly average' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricItems.map((metric) => (
          <div key={metric.label} className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm font-medium text-gray-700">{metric.label}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Benchmark Comparison</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-600">{metrics.benchmarkComparison.portfolio.toFixed(2)}%</p>
            <p className="text-xs text-gray-600">Your Portfolio</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-600">{metrics.benchmarkComparison.sp500.toFixed(2)}%</p>
            <p className="text-xs text-gray-600">S&P 500</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-600">{metrics.benchmarkComparison.nasdaq.toFixed(2)}%</p>
            <p className="text-xs text-gray-600">NASDAQ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Panel
const QuickActions = () => {
  const { refreshAllData, isUpdatingPrices } = useInvestmentStore();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={() => refreshAllData()}
          disabled={isUpdatingPrices}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUpdatingPrices ? 'Updating Prices...' : 'Refresh Market Data'}
        </button>
        
        <button 
          onClick={() => investmentDevUtils.addTestHolding()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Test Holding
        </button>
        
        <button 
          onClick={() => investmentDevUtils.simulateUpdate()}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Simulate Market Update
        </button>
        
        <button 
          onClick={() => investmentDevUtils.logState()}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Debug Portfolio State
        </button>
      </div>
    </div>
  );
};

// View Mode Tabs
const ViewModeSelector = () => {
  const { viewMode, setViewMode } = useInvestmentStore();

  const modes = [
    { key: 'overview', label: 'Overview' },
    { key: 'holdings', label: 'Holdings' },
    { key: 'performance', label: 'Performance' },
    { key: 'goals', label: 'Goals' },
  ] as const;

  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === mode.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Investments Page Component
export default function InvestmentsPage() {
  const portfolio = usePortfolio();
  const { viewMode, error } = useInvestmentStore();
  const [showHoldingForm, setShowHoldingForm] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any>(null);

  // Initialize with mock data on first load
  useEffect(() => {
    if (!portfolio) {
      investmentDevUtils.initialize('advanced');
    }
  }, [portfolio]);

  const handleEditHolding = (holding: any) => {
    setEditingHolding(holding);
    setShowHoldingForm(true);
  };

  const handleCloseForm = () => {
    setShowHoldingForm(false);
    setEditingHolding(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600 mt-1">
              Track your investments, monitor performance, and manage your financial goals
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingHolding(null);
              setShowHoldingForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Holding</span>
          </button>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {/* View Mode Selector */}
        <ViewModeSelector />

        {/* Portfolio Overview Cards */}
        <PortfolioOverview />

        {/* Conditional Content Based on View Mode */}
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HoldingsList onEditHolding={handleEditHolding} />
            </div>
            <div className="space-y-6">
              <AssetAllocationChart />
              <QuickActions />
            </div>
          </div>
        )}

        {viewMode === 'holdings' && (
          <div className="space-y-6">
            <HoldingsList onEditHolding={handleEditHolding} />
          </div>
        )}

        {viewMode === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceMetrics />
            <AssetAllocationChart />
          </div>
        )}

        {viewMode === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InvestmentGoalsSection />
            <QuickActions />
          </div>
        )}

        {/* Add Holding Form Modal */}
        <AnimatePresence>
          {showHoldingForm && (
            <AddHoldingForm
              onClose={handleCloseForm}
              editingHolding={editingHolding}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}