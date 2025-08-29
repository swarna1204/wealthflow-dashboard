// src/components/charts/AdvancedCharts.tsx
'use client';

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

interface AdvancedChartsProps {
  data?: any[];
  categoryData?: any[];
  budgetData?: any[];
  goalData?: any[];
  type: string;
  height?: number;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  data = [],
  categoryData = [],
  budgetData = [],
  goalData = [],
  type,
  height = 300
}) => {
  const [activeChart, setActiveChart] = useState<'trends' | 'variance' | 'efficiency' | 'forecast'>('trends');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('Rate') || entry.name.includes('%') 
                ? `${entry.value.toFixed(1)}%` 
                : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Spending Trends Chart
  const SpendingTrendsChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        
        <defs>
          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <Area
          type="monotone"
          dataKey="spending"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#spendingGradient)"
          name="Spending"
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#incomeGradient)"
          name="Income"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Budget Variance Chart
  const BudgetVarianceChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="category" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
        <YAxis stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="allocated" fill="#94a3b8" name="Allocated" />
        <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  );

  // Simple chart selector for comprehensive view
  const ComprehensiveChart = () => {
    const chartOptions = [
      { id: 'trends', label: 'Spending Trends', component: SpendingTrendsChart },
      { id: 'variance', label: 'Budget Variance', component: BudgetVarianceChart }
    ];

    const ActiveChartComponent = chartOptions.find(c => c.id === activeChart)?.component || SpendingTrendsChart;

    return (
      <div className="space-y-4">
        {/* Chart Selector */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {chartOptions.map(chart => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeChart === chart.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>

        {/* Active Chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveChartComponent />
        </motion.div>
      </div>
    );
  };

  // Render appropriate chart based on type
  switch (type) {
    case 'spending-trends':
      return <SpendingTrendsChart />;
    case 'budget-performance':
      return <BudgetVarianceChart />;
    case 'comprehensive':
    default:
      return <ComprehensiveChart />;
  }
};