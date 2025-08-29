// src/lib/analytics.ts
import { Transaction, Budget, Goal } from './types';

export interface PredictionModel {
  nextMonthSpending: number;
  nextMonthIncome: number;
  confidenceInterval: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
}

export interface SpendingPattern {
  dayOfWeek: { day: string; amount: number }[];
  timeOfMonth: { period: string; amount: number }[];
  seasonality: { quarter: string; amount: number }[];
}

export interface AnomalyDetection {
  unusualTransactions: Transaction[];
  budgetAnomalies: { category: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  spendingSpikes: { date: string; amount: number; category: string }[];
}

export class AnalyticsEngine {
  
  // Predictive Analytics
  static predictNextMonthSpending(transactions: Transaction[]): PredictionModel {
    // Get last 6 months of spending data
    const monthlySpending = AnalyticsEngine.getMonthlySpendingData(transactions, 6);
    
    if (monthlySpending.length < 3) {
      return {
        nextMonthSpending: 0,
        nextMonthIncome: 0,
        confidenceInterval: 0,
        trendDirection: 'stable'
      };
    }

    // Simple linear regression for trend analysis
    const spendingValues = monthlySpending.map(m => m.spending);
    const incomeValues = monthlySpending.map(m => m.income);
    
    const spendingTrend = AnalyticsEngine.calculateTrend(spendingValues);
    const incomeTrend = AnalyticsEngine.calculateTrend(incomeValues);
    
    // Moving average with trend adjustment
    const avgSpending = spendingValues.reduce((sum, val) => sum + val, 0) / spendingValues.length;
    const avgIncome = incomeValues.reduce((sum, val) => sum + val, 0) / incomeValues.length;
    
    // Apply seasonal adjustment (simplified)
    const seasonalFactor = AnalyticsEngine.getSeasonalFactor(new Date().getMonth());
    
    return {
      nextMonthSpending: Math.round((avgSpending + spendingTrend) * seasonalFactor),
      nextMonthIncome: Math.round(avgIncome + incomeTrend),
      confidenceInterval: AnalyticsEngine.calculateConfidence(spendingValues),
      trendDirection: spendingTrend > 50 ? 'increasing' : spendingTrend < -50 ? 'decreasing' : 'stable'
    };
  }

  // Spending Pattern Analysis
  static analyzeSpendingPatterns(transactions: Transaction[]): SpendingPattern {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Day of week analysis
    const dayOfWeekSpending = new Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    expenseTransactions.forEach(t => {
      const date = new Date(t.date);
      dayOfWeekSpending[date.getDay()] += Math.abs(t.amount);
    });
    
    const dayOfWeek = dayOfWeekSpending.map((amount, index) => ({
      day: dayNames[index],
      amount: Math.round(amount)
    }));

    // Time of month analysis
    const timeOfMonth = [
      { period: 'Early (1-10)', amount: 0 },
      { period: 'Mid (11-20)', amount: 0 },
      { period: 'Late (21-31)', amount: 0 }
    ];

    expenseTransactions.forEach(t => {
      const date = new Date(t.date).getDate();
      if (date <= 10) timeOfMonth[0].amount += Math.abs(t.amount);
      else if (date <= 20) timeOfMonth[1].amount += Math.abs(t.amount);
      else timeOfMonth[2].amount += Math.abs(t.amount);
    });

    // Seasonal analysis
    const seasonality = [
      { quarter: 'Q1 (Jan-Mar)', amount: 0 },
      { quarter: 'Q2 (Apr-Jun)', amount: 0 },
      { quarter: 'Q3 (Jul-Sep)', amount: 0 },
      { quarter: 'Q4 (Oct-Dec)', amount: 0 }
    ];

    expenseTransactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      const quarter = Math.floor(month / 3);
      seasonality[quarter].amount += Math.abs(t.amount);
    });

    return {
      dayOfWeek,
      timeOfMonth,
      seasonality: seasonality.map(s => ({ ...s, amount: Math.round(s.amount) }))
    };
  }

  // Anomaly Detection
  static detectAnomalies(transactions: Transaction[], budgets: Budget[]): AnomalyDetection {
    // Detect unusual transactions (outliers)
    const expenseAmounts = transactions
      .filter(t => t.type === 'expense')
      .map(t => Math.abs(t.amount))
      .sort((a, b) => a - b);
    
    const q1 = expenseAmounts[Math.floor(expenseAmounts.length * 0.25)];
    const q3 = expenseAmounts[Math.floor(expenseAmounts.length * 0.75)];
    const iqr = q3 - q1;
    const outlierThreshold = q3 + (1.5 * iqr);
    
    const unusualTransactions = transactions.filter(t => 
      t.type === 'expense' && Math.abs(t.amount) > outlierThreshold
    );

    // Budget anomaly detection
    const budgetAnomalies: { category: string; severity: 'low' | 'medium' | 'high'; description: string }[] = [];
    
    budgets.forEach(budget => {
      const utilization = (budget.spent / budget.limit) * 100;
      
      if (utilization > 150) {
        budgetAnomalies.push({
          category: budget.category,
          severity: 'high',
          description: `Severely over budget at ${utilization.toFixed(1)}% utilization`
        });
      } else if (utilization > 110) {
        budgetAnomalies.push({
          category: budget.category,
          severity: 'medium',
          description: `Over budget at ${utilization.toFixed(1)}% utilization`
        });
      } else if (utilization < 20) {
        budgetAnomalies.push({
          category: budget.category,
          severity: 'low',
          description: `Significantly under-utilized at ${utilization.toFixed(1)}% utilization`
        });
      }
    });

    // Spending spikes detection
    const dailySpending = AnalyticsEngine.groupTransactionsByDay(transactions);
    const avgDailySpending = Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / Object.keys(dailySpending).length;
    const spikeThreshold = avgDailySpending * 2.5;
    
    const spendingSpikes = Object.entries(dailySpending)
      .filter(([_, amount]) => amount > spikeThreshold)
      .map(([date, amount]) => ({
        date,
        amount: Math.round(amount),
        category: AnalyticsEngine.getMostSpentCategoryForDay(transactions, date)
      }));

    return {
      unusualTransactions,
      budgetAnomalies,
      spendingSpikes
    };
  }

  // Helper methods
  static getMonthlySpendingData(transactions: Transaction[], months: number) {
    const monthlyData: { spending: number; income: number; month: string }[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
      });
      
      const spending = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        spending,
        income,
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    }
    
    return monthlyData;
  }

  static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  static getSeasonalFactor(month: number): number {
    // Seasonal adjustment factors (simplified)
    const factors = [0.95, 0.9, 1.0, 1.05, 1.1, 1.0, 0.95, 0.9, 1.0, 1.05, 1.2, 1.3];
    return factors[month] || 1.0;
  }

  static calculateConfidence(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    // Convert to confidence percentage (lower variation = higher confidence)
    return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));
  }

  static groupTransactionsByDay(transactions: Transaction[]): { [date: string]: number } {
    const dailySpending: { [date: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date).toISOString().split('T')[0];
        dailySpending[date] = (dailySpending[date] || 0) + Math.abs(t.amount);
      });
    
    return dailySpending;
  }

  static getMostSpentCategoryForDay(transactions: Transaction[], date: string): string {
    const dayTransactions = transactions.filter(t => 
      t.type === 'expense' && new Date(t.date).toISOString().split('T')[0] === date
    );
    
    const categorySpending: { [category: string]: number } = {};
    dayTransactions.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount);
    });
    
    return Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';
  }

  // Budget Optimization Suggestions
  static generateBudgetOptimizationSuggestions(
    transactions: Transaction[], 
    budgets: Budget[]
  ): { category: string; suggestion: string; potentialSavings: number }[] {
    const suggestions: { category: string; suggestion: string; potentialSavings: number }[] = [];
    
    budgets.forEach(budget => {
      const categoryTransactions = transactions.filter(t => 
        t.category === budget.category && t.type === 'expense'
      );
      
      const utilization = (budget.spent / budget.limit) * 100;
      const avgTransaction = budget.spent / Math.max(categoryTransactions.length, 1);
      
      if (utilization > 120) {
        suggestions.push({
          category: budget.category,
          suggestion: `Reduce ${budget.category} spending by ${formatCurrency(budget.spent - budget.limit)} to meet budget`,
          potentialSavings: budget.spent - budget.limit
        });
      } else if (utilization < 50 && budget.spent > 0) {
        const reallocationAmount = (budget.limit - budget.spent) * 0.5;
        suggestions.push({
          category: budget.category,
          suggestion: `Consider reallocating ${formatCurrency(reallocationAmount)} from under-utilized ${budget.category} budget`,
          potentialSavings: reallocationAmount
        });
      }
      
      if (avgTransaction > budget.limit * 0.3) {
        suggestions.push({
          category: budget.category,
          suggestion: `High average transaction amount (${formatCurrency(avgTransaction)}) in ${budget.category}. Consider breaking into smaller purchases`,
          potentialSavings: avgTransaction * 0.2
        });
      }
    });
    
    return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }
}

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Export utility functions
export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = convertArrayToCSV(data);
  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToPDF = async (data: any[], filename: string) => {
  // This would require a PDF library like jsPDF
  // For now, we'll create a simple HTML export that can be printed to PDF
  const htmlContent = generateHTMLReport(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadFile(blob, filename.replace('.pdf', '.html'), 'text/html');
};

// Helper functions
const convertArrayToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};

const generateHTMLReport = (data: any[]): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>WealthFlow Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>WealthFlow Analytics Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="section">
        <h2>Financial Data Summary</h2>
        <p>This report contains detailed analytics of your financial performance.</p>
        <!-- Data would be inserted here -->
      </div>
    </body>
    </html>
  `;
};

const downloadFile = (content: string | Blob, filename: string, type: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};