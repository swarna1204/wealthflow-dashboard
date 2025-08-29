// src/components/analytics/AnalyticsInsights.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsEngine, PredictionModel, SpendingPattern, AnomalyDetection } from '../../lib/analytics';
import { Transaction, Budget } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';

interface AnalyticsInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  transactions,
  budgets
}) => {
  const [predictions, setPredictions] = useState<PredictionModel | null>(null);
  const [patterns, setPatterns] = useState<SpendingPattern | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyDetection | null>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Generate insights
    const predictionModel = AnalyticsEngine.predictNextMonthSpending(transactions);
    const spendingPatterns = AnalyticsEngine.analyzeSpendingPatterns(transactions);
    const detectedAnomalies = AnalyticsEngine.detectAnomalies(transactions, budgets);
    const budgetOptimizations = AnalyticsEngine.generateBudgetOptimizationSuggestions(transactions, budgets);

    setPredictions(predictionModel);
    setPatterns(spendingPatterns);
    setAnomalies(detectedAnomalies);
    setOptimizationSuggestions(budgetOptimizations);
  }, [transactions, budgets]);

  if (!predictions || !patterns || !anomalies) {
    return <div className="flex items-center justify-center h-64">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Predictions Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Next Month Predictions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {formatCurrency(predictions.nextMonthSpending)}
            </div>
            <div className="text-sm text-blue-700">Predicted Spending</div>
            <div className={`text-xs mt-1 flex items-center justify-center ${
              predictions.trendDirection === 'increasing' ? 'text-red-600' :
              predictions.trendDirection === 'decreasing' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {predictions.trendDirection === 'increasing' ? <TrendingUp className="w-3 h-3 mr-1" /> :
               predictions.trendDirection === 'decreasing' ? <TrendingDown className="w-3 h-3 mr-1" /> :
               <BarChart3 className="w-3 h-3 mr-1" />}
              {predictions.trendDirection}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-900 mb-1">
              {formatCurrency(predictions.nextMonthIncome)}
            </div>
            <div className="text-sm text-green-700">Predicted Income</div>
            <div className="text-xs text-green-600 mt-1">Based on trends</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {predictions.confidenceInterval.toFixed(0)}%
            </div>
            <div className="text-sm text-purple-700">Confidence Level</div>
            <div className={`text-xs mt-1 ${
              predictions.confidenceInterval >= 80 ? 'text-green-600' :
              predictions.confidenceInterval >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {predictions.confidenceInterval >= 80 ? 'High' :
               predictions.confidenceInterval >= 60 ? 'Medium' : 'Low'} confidence
            </div>
          </div>
        </div>
      </div>

      {/* Spending Patterns */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-green-600" />
          Spending Patterns
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day of Week Pattern */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Day of Week</h4>
            <div className="space-y-2">
              {patterns.dayOfWeek
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((day, index) => (
                <div key={day.day} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{day.day}</span>
                  <span className="text-sm font-medium">{formatCurrency(day.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Time of Month Pattern */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Time of Month</h4>
            <div className="space-y-2">
              {patterns.timeOfMonth.map((period, index) => (
                <div key={period.period} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{period.period}</span>
                  <span className="text-sm font-medium">{formatCurrency(period.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Seasonal Pattern */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Seasonal Trends</h4>
            <div className="space-y-2">
              {patterns.seasonality
                .sort((a, b) => b.amount - a.amount)
                .map((season, index) => (
                <div key={season.quarter} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{season.quarter}</span>
                  <span className="text-sm font-medium">{formatCurrency(season.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Anomalies */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Budget Anomalies
          </h3>
          
          {anomalies.budgetAnomalies.length > 0 ? (
            <div className="space-y-3">
              {anomalies.budgetAnomalies.slice(0, 5).map((anomaly, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    anomaly.severity === 'high' ? 'bg-red-50 border-red-200' :
                    anomaly.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{anomaly.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                      anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{anomaly.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No budget anomalies detected</p>
          )}
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Optimization Tips
          </h3>
          
          {optimizationSuggestions.length > 0 ? (
            <div className="space-y-3">
              {optimizationSuggestions.slice(0, 5).map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{suggestion.category}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Save {formatCurrency(suggestion.potentialSavings)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.suggestion}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Your budgets are well optimized</p>
          )}
        </div>
      </div>

      {/* Spending Spikes */}
      {anomalies.spendingSpikes.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
            Spending Spikes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anomalies.spendingSpikes.slice(0, 6).map((spike, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{spike.date}</span>
                  <span className="text-sm font-bold text-red-600">{formatCurrency(spike.amount)}</span>
                </div>
                <p className="text-xs text-gray-600">{spike.category} category</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unusual Transactions */}
      {anomalies.unusualTransactions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Unusual Transactions
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Date</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Description</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Category</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.unusualTransactions.slice(0, 5).map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-xs text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 text-xs text-gray-900">{transaction.description}</td>
                    <td className="py-2 px-3 text-xs text-gray-600">{transaction.category}</td>
                    <td className="py-2 px-3 text-xs font-medium text-red-600 text-right">
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};