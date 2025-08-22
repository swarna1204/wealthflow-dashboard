// src/components/charts/GoalChart.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Goal, goalCategories } from '@/lib/types';
import { formatCurrency } from '../../lib/formatters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar } from 'lucide-react';

interface GoalChartProps {
  goals: Goal[];
}

type ChartType = 'progress' | 'category' | 'timeline' | 'comparison';

export const GoalChart: React.FC<GoalChartProps> = ({ goals }) => {
  const [chartType, setChartType] = useState<ChartType>('progress');

  // Prepare data for different chart types
  const progressData = goals.map(goal => ({
    name: goal.name.length > 15 ? goal.name.substring(0, 15) + '...' : goal.name,
    progress: (goal.current / goal.target) * 100,
    current: goal.current,
    target: goal.target,
    remaining: goal.target - goal.current,
    category: goal.category,
    color: goalCategories[goal.category].color,
  }));

  const categoryData = Object.entries(goalCategories).map(([key, category]) => {
    const categoryGoals = goals.filter(goal => goal.category === key);
    const totalTarget = categoryGoals.reduce((sum, goal) => sum + goal.target, 0);
    const totalCurrent = categoryGoals.reduce((sum, goal) => sum + goal.current, 0);
    
    return {
      name: category.label,
      value: totalTarget,
      current: totalCurrent,
      count: categoryGoals.length,
      color: category.color,
      progress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0,
    };
  }).filter(item => item.count > 0);

  const timelineData = goals
    .map(goal => {
      const deadline = new Date(goal.deadline);
      const monthsFromNow = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      return {
        name: goal.name.length > 12 ? goal.name.substring(0, 12) + '...' : goal.name,
        months: Math.max(0, monthsFromNow),
        progress: (goal.current / goal.target) * 100,
        target: goal.target,
        current: goal.current,
        deadline: goal.deadline,
        color: goalCategories[goal.category].color,
      };
    })
    .sort((a, b) => a.months - b.months);

  const comparisonData = goals.map(goal => ({
    name: goal.name.length > 10 ? goal.name.substring(0, 10) + '...' : goal.name,
    target: goal.target,
    current: goal.current,
    remaining: goal.target - goal.current,
    color: goalCategories[goal.category].color,
  }));

  const chartTypes = [
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'category', label: 'Categories', icon: PieChartIcon },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'comparison', label: 'Comparison', icon: TrendingUp },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {chartType === 'progress' && (
            <>
              <p className="text-blue-600">Progress: {data.progress.toFixed(1)}%</p>
              <p className="text-green-600">Current: {formatCurrency(data.current)}</p>
              <p className="text-gray-600">Target: {formatCurrency(data.target)}</p>
              <p className="text-orange-600">Remaining: {formatCurrency(data.remaining)}</p>
            </>
          )}
          {chartType === 'category' && (
            <>
              <p className="text-blue-600">Goals: {data.count}</p>
              <p className="text-green-600">Total Target: {formatCurrency(data.value)}</p>
              <p className="text-purple-600">Total Saved: {formatCurrency(data.current)}</p>
              <p className="text-gray-600">Progress: {data.progress.toFixed(1)}%</p>
            </>
          )}
          {chartType === 'timeline' && (
            <>
              <p className="text-blue-600">Deadline: {data.months} months</p>
              <p className="text-green-600">Progress: {data.progress.toFixed(1)}%</p>
              <p className="text-gray-600">Target: {formatCurrency(data.target)}</p>
            </>
          )}
          {chartType === 'comparison' && (
            <>
              <p className="text-green-600">Current: {formatCurrency(data.current)}</p>
              <p className="text-blue-600">Target: {formatCurrency(data.target)}</p>
              <p className="text-orange-600">Remaining: {formatCurrency(data.remaining)}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="progress" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'category':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, progress }) => `${name}: ${progress.toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'timeline':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Months to Deadline', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="months"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#10b981" name="Current" />
              <Bar dataKey="remaining" fill="#f59e0b" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (goals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-gray-600">No goals to display yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2">
        {chartTypes.map((type) => (
          <Button
            key={type.id}
            variant={chartType === type.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType(type.id as ChartType)}
            className="flex items-center space-x-2"
          >
            <type.icon className="h-4 w-4" />
            <span>{type.label}</span>
          </Button>
        ))}
      </div>

      {/* Chart Container */}
      <motion.div
        key={chartType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200"
      >
        {renderChart()}
      </motion.div>

      {/* Chart Description */}
      <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
        {chartType === 'progress' && (
          <p>Shows the completion percentage for each of your goals. Higher bars indicate closer to completion.</p>
        )}
        {chartType === 'category' && (
          <p>Breakdown of your goals by category, showing the total target amount and progress for each category.</p>
        )}
        {chartType === 'timeline' && (
          <p>Timeline view showing how many months until each goal's deadline and current progress.</p>
        )}
        {chartType === 'comparison' && (
          <p>Side-by-side comparison of current savings vs remaining amount needed for each goal.</p>
        )}
      </div>
    </div>
  );
};