// src/store/useAnalyticsStore.ts
import { create } from 'zustand';
import { Transaction, Budget, Goal } from '../lib/types';

export interface SpendingTrend {
  month: string;
  spending: number;
  income: number;
  netFlow: number;
  budgetUtilization: number;
}

export interface CategoryAnalysis {
  category: string;
  totalSpent: number;
  budgetAllocated: number;
  variance: number;
  variancePercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  transactions: number;
  averageTransaction: number;
}

export interface BudgetPerformance {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilizationRate: number;
  status: 'on-track' | 'over-budget' | 'under-utilized';
  projectedSpend: number;
  daysRemaining: number;
}

export interface GoalProjection {
  goalId: string;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  projectedCompletionDate: string;
  monthsToCompletion: number;
  requiredMonthlyContribution: number;
  currentPace: 'ahead' | 'on-track' | 'behind';
  probability: number;
}

export interface FinancialHealthScore {
  overall: number;
  budgetCompliance: number;
  savingsRate: number;
  goalProgress: number;
  spendingStability: number;
  insights: string[];
  recommendations: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface AnalyticsStore {
  // Data
  dateRange: DateRange;
  spendingTrends: SpendingTrend[];
  categoryAnalysis: CategoryAnalysis[];
  budgetPerformance: BudgetPerformance[];
  goalProjections: GoalProjection[];
  financialHealth: FinancialHealthScore;
  
  // Loading states
  loading: boolean;
  lastUpdated: Date | null;
  
  // Actions
  setDateRange: (range: DateRange) => void;
  refreshAnalytics: (transactions: Transaction[], budgets: Budget[], goals: Goal[]) => void;
  getSpendingTrends: (transactions: Transaction[], months: number) => SpendingTrend[];
  getCategoryAnalysis: (transactions: Transaction[], budgets: Budget[]) => CategoryAnalysis[];
  getBudgetPerformance: (transactions: Transaction[], budgets: Budget[]) => BudgetPerformance[];
  getGoalProjections: (goals: Goal[], monthlyIncome: number) => GoalProjection[];
  calculateFinancialHealth: (transactions: Transaction[], budgets: Budget[], goals: Goal[]) => FinancialHealthScore;
  exportData: (format: 'csv' | 'pdf') => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // Initial state
  dateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    end: new Date(),
    label: 'Last 6 months'
  },
  spendingTrends: [],
  categoryAnalysis: [],
  budgetPerformance: [],
  goalProjections: [],
  financialHealth: {
    overall: 0,
    budgetCompliance: 0,
    savingsRate: 0,
    goalProgress: 0,
    spendingStability: 0,
    insights: [],
    recommendations: []
  },
  loading: false,
  lastUpdated: null,

  // Actions
  setDateRange: (range) => {
    set({ dateRange: range });
  },

  refreshAnalytics: (transactions, budgets, goals) => {
    set({ loading: true });
    
    const { getSpendingTrends, getCategoryAnalysis, getBudgetPerformance, getGoalProjections, calculateFinancialHealth } = get();
    
    // Calculate monthly income for projections
    const monthlyIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) / 6; // Average over 6 months
    
    // Generate analytics
    const spendingTrends = getSpendingTrends(transactions, 6);
    const categoryAnalysis = getCategoryAnalysis(transactions, budgets);
    const budgetPerformance = getBudgetPerformance(transactions, budgets);
    const goalProjections = getGoalProjections(goals, monthlyIncome);
    const financialHealth = calculateFinancialHealth(transactions, budgets, goals);
    
    set({
      spendingTrends,
      categoryAnalysis,
      budgetPerformance,
      goalProjections,
      financialHealth,
      loading: false,
      lastUpdated: new Date()
    });
  },

  getSpendingTrends: (transactions, months) => {
    const trends: SpendingTrend[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
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
      
      trends.push({
        month: monthName,
        spending,
        income,
        netFlow: income - spending,
        budgetUtilization: spending > 0 ? (spending / (income || 1)) * 100 : 0
      });
    }
    
    return trends;
  },

  getCategoryAnalysis: (transactions, budgets) => {
    const categoryMap = new Map<string, {
      totalSpent: number;
      transactions: number;
      amounts: number[];
    }>();
    
    // Group transactions by category
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const existing = categoryMap.get(t.category) || {
          totalSpent: 0,
          transactions: 0,
          amounts: []
        };
        
        existing.totalSpent += Math.abs(t.amount);
        existing.transactions += 1;
        existing.amounts.push(Math.abs(t.amount));
        categoryMap.set(t.category, existing);
      });
    
    // Calculate analysis for each category
    return Array.from(categoryMap.entries()).map(([category, data]) => {
      const budget = budgets.find(b => b.category === category);
      const budgetAllocated = budget?.limit || 0;
      const variance = budgetAllocated - data.totalSpent;
      const variancePercentage = budgetAllocated > 0 ? (variance / budgetAllocated) * 100 : 0;
      
      // Calculate trend (simplified)
      const recentSpending = data.amounts.slice(-3).reduce((sum, a) => sum + a, 0) / 3;
      const earlierSpending = data.amounts.slice(0, -3).reduce((sum, a) => sum + a, 0) / Math.max(1, data.amounts.length - 3);
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentSpending > earlierSpending * 1.1) trend = 'increasing';
      else if (recentSpending < earlierSpending * 0.9) trend = 'decreasing';
      
      return {
        category,
        totalSpent: data.totalSpent,
        budgetAllocated,
        variance,
        variancePercentage,
        trend,
        transactions: data.transactions,
        averageTransaction: data.totalSpent / data.transactions
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  },

  getBudgetPerformance: (transactions, budgets) => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const daysRemaining = daysInMonth - daysPassed;
    
    return budgets.map(budget => {
      const utilizationRate = (budget.spent / budget.limit) * 100;
      const dailyBurnRate = budget.spent / daysPassed;
      const projectedSpend = dailyBurnRate * daysInMonth;
      
      let status: 'on-track' | 'over-budget' | 'under-utilized' = 'on-track';
      if (utilizationRate > 100) status = 'over-budget';
      else if (utilizationRate < 50 && daysPassed > daysInMonth * 0.7) status = 'under-utilized';
      
      return {
        category: budget.category,
        allocated: budget.limit,
        spent: budget.spent,
        remaining: budget.limit - budget.spent,
        utilizationRate,
        status,
        projectedSpend,
        daysRemaining
      };
    });
  },

  getGoalProjections: (goals, monthlyIncome) => {
    return goals.map(goal => {
      const remaining = goal.target - goal.current;
      const monthlyContribution = goal.monthlyContribution || 0;
      const deadlineDate = new Date(goal.deadline);
      const now = new Date();
      const monthsToDeadline = Math.max(1, 
        (deadlineDate.getFullYear() - now.getFullYear()) * 12 + 
        (deadlineDate.getMonth() - now.getMonth())
      );
      
      const requiredMonthlyContribution = remaining / monthsToDeadline;
      const monthsToCompletion = monthlyContribution > 0 ? remaining / monthlyContribution : Infinity;
      
      let currentPace: 'ahead' | 'on-track' | 'behind' = 'on-track';
      if (monthlyContribution > requiredMonthlyContribution * 1.1) currentPace = 'ahead';
      else if (monthlyContribution < requiredMonthlyContribution * 0.9) currentPace = 'behind';
      
      // Calculate probability based on current pace and available income
      const availableIncome = monthlyIncome * 0.2; // Assume 20% available for goals
      const probability = Math.min(100, Math.max(0, 
        (monthlyContribution / requiredMonthlyContribution) * 
        (availableIncome / requiredMonthlyContribution) * 100
      ));
      
      const projectedCompletionDate = new Date();
      projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + monthsToCompletion);
      
      return {
        goalId: goal.id,
        goalName: goal.name,
        currentAmount: goal.current,
        targetAmount: goal.target,
        projectedCompletionDate: projectedCompletionDate.toISOString(),
        monthsToCompletion: Math.ceil(monthsToCompletion),
        requiredMonthlyContribution,
        currentPace,
        probability
      };
    });
  },

  calculateFinancialHealth: (transactions, budgets, goals) => {
    // Budget compliance score
    const budgetCompliance = budgets.length > 0 
      ? budgets.reduce((sum, budget) => {
          const utilization = Math.min(100, (budget.spent / budget.limit) * 100);
          return sum + (utilization <= 100 ? 100 : Math.max(0, 200 - utilization));
        }, 0) / budgets.length
      : 100;
    
    // Savings rate
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Goal progress score
    const goalProgress = goals.length > 0
      ? goals.reduce((sum, goal) => sum + (goal.current / goal.target) * 100, 0) / goals.length
      : 100;
    
    // Spending stability (variance in monthly spending)
    const monthlySpending = get().getSpendingTrends(transactions, 6).map(t => t.spending);
    const avgSpending = monthlySpending.reduce((sum, s) => sum + s, 0) / monthlySpending.length;
    const variance = monthlySpending.reduce((sum, s) => sum + Math.pow(s - avgSpending, 2), 0) / monthlySpending.length;
    const spendingStability = Math.max(0, 100 - (Math.sqrt(variance) / avgSpending * 100));
    
    // Overall score (weighted average)
    const overall = (budgetCompliance * 0.3 + savingsRate + goalProgress * 0.2 + spendingStability * 0.2) / 1.7;
    
    // Generate insights
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    if (budgetCompliance < 80) {
      insights.push("Budget compliance needs improvement");
      recommendations.push("Review and adjust budget categories that are frequently exceeded");
    }
    
    if (savingsRate < 10) {
      insights.push("Low savings rate detected");
      recommendations.push("Aim to save at least 20% of your income for better financial health");
    }
    
    if (goalProgress < 50) {
      insights.push("Goal progress is behind target");
      recommendations.push("Increase monthly contributions or adjust goal timelines");
    }
    
    return {
      overall: Math.round(overall),
      budgetCompliance: Math.round(budgetCompliance),
      savingsRate: Math.round(savingsRate),
      goalProgress: Math.round(goalProgress),
      spendingStability: Math.round(spendingStability),
      insights,
      recommendations
    };
  },

  exportData: (format) => {
    const { spendingTrends, categoryAnalysis, budgetPerformance, financialHealth } = get();
    
    if (format === 'csv') {
      // Simple CSV export implementation
      const csvData = [
        ['Category Analysis'],
        ['Category', 'Total Spent', 'Budget Allocated', 'Variance', 'Transactions'],
        ...categoryAnalysis.map(c => [c.category, c.totalSpent, c.budgetAllocated, c.variance, c.transactions]),
        [''],
        ['Budget Performance'],
        ['Category', 'Allocated', 'Spent', 'Utilization %', 'Status'],
        ...budgetPerformance.map(b => [b.category, b.allocated, b.spent, b.utilizationRate.toFixed(1), b.status]),
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `wealthflow-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
    
    // PDF export would be implemented with a library like jsPDF
    console.log('Export completed:', format);
  }
}));