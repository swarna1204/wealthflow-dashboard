// src/data/mockInvestments.ts
import { Holding, InvestmentGoal, MarketData } from '@/store/useInvestmentStore';

// Mock Holdings Data
export const mockHoldings: Holding[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    avgCost: 150.00,
    currentPrice: 185.50,
    marketValue: 9275.00,
    dayChange: 2.75,
    dayChangePercent: 1.51,
    totalReturn: 1775.00,
    totalReturnPercent: 23.67,
    allocation: 35.2,
    sector: 'Technology',
    assetClass: 'stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 25,
    avgCost: 280.00,
    currentPrice: 315.75,
    marketValue: 7893.75,
    dayChange: -1.25,
    dayChangePercent: -0.39,
    totalReturn: 893.75,
    totalReturnPercent: 12.77,
    allocation: 29.9,
    sector: 'Technology',
    assetClass: 'stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 15,
    avgCost: 120.00,
    currentPrice: 140.25,
    marketValue: 2103.75,
    dayChange: 0.85,
    dayChangePercent: 0.61,
    totalReturn: 303.75,
    totalReturnPercent: 16.88,
    allocation: 8.0,
    sector: 'Technology',
    assetClass: 'stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 20,
    avgCost: 400.00,
    currentPrice: 485.60,
    marketValue: 9712.00,
    dayChange: 8.40,
    dayChangePercent: 1.76,
    totalReturn: 1712.00,
    totalReturnPercent: 21.40,
    allocation: 36.9,
    sector: 'Technology',
    assetClass: 'stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    shares: 40,
    avgCost: 220.00,
    currentPrice: 245.30,
    marketValue: 9812.00,
    dayChange: 1.20,
    dayChangePercent: 0.49,
    totalReturn: 1012.00,
    totalReturnPercent: 11.50,
    allocation: 37.2,
    sector: 'Diversified',
    assetClass: 'etf',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    shares: 60,
    avgCost: 75.00,
    currentPrice: 73.25,
    marketValue: 4395.00,
    dayChange: -0.15,
    dayChangePercent: -0.20,
    totalReturn: -105.00,
    totalReturnPercent: -2.33,
    allocation: 16.7,
    sector: 'Fixed Income',
    assetClass: 'bond',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '7',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    shares: 12,
    avgCost: 210.00,
    currentPrice: 245.80,
    marketValue: 2949.60,
    dayChange: 4.30,
    dayChangePercent: 1.78,
    totalReturn: 429.60,
    totalReturnPercent: 17.05,
    allocation: 11.2,
    sector: 'Consumer Discretionary',
    assetClass: 'stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '8',
    symbol: 'BTC',
    name: 'Bitcoin',
    shares: 0.5,
    avgCost: 35000.00,
    currentPrice: 43250.00,
    marketValue: 21625.00,
    dayChange: 1250.00,
    dayChangePercent: 2.98,
    totalReturn: 4125.00,
    totalReturnPercent: 23.57,
    allocation: 82.1,
    sector: 'Cryptocurrency',
    assetClass: 'crypto',
    lastUpdated: new Date().toISOString(),
  }
];

// Mock Investment Goals
export const mockInvestmentGoals: InvestmentGoal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    targetAmount: 1000000,
    currentAmount: 145000,
    targetDate: '2045-12-31T00:00:00.000Z',
    riskTolerance: 'moderate',
    status: 'on-track',
    monthlyContribution: 2000,
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'House Down Payment',
    targetAmount: 100000,
    currentAmount: 35000,
    targetDate: '2028-06-30T00:00:00.000Z',
    riskTolerance: 'conservative',
    status: 'behind',
    monthlyContribution: 1500,
    createdAt: '2024-03-10T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 42000,
    targetDate: '2026-12-31T00:00:00.000Z',
    riskTolerance: 'conservative',
    status: 'ahead',
    monthlyContribution: 500,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: "Children's Education",
    targetAmount: 200000,
    currentAmount: 25000,
    targetDate: '2040-08-31T00:00:00.000Z',
    riskTolerance: 'moderate',
    status: 'on-track',
    monthlyContribution: 800,
    createdAt: '2024-04-20T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Vacation Fund',
    targetAmount: 15000,
    currentAmount: 8500,
    targetDate: '2026-07-15T00:00:00.000Z',
    riskTolerance: 'conservative',
    status: 'ahead',
    monthlyContribution: 300,
    createdAt: '2024-06-01T00:00:00.000Z',
  }
];

// Mock Market Data
export const mockMarketData: Record<string, MarketData> = {
  AAPL: {
    symbol: 'AAPL',
    price: 185.50,
    change: 2.75,
    changePercent: 1.51,
    volume: 45230000,
    marketCap: 2850000000000,
    pe: 28.5,
    dividend: 0.96,
    lastUpdated: new Date().toISOString(),
  },
  MSFT: {
    symbol: 'MSFT',
    price: 315.75,
    change: -1.25,
    changePercent: -0.39,
    volume: 22150000,
    marketCap: 2340000000000,
    pe: 32.1,
    dividend: 3.00,
    lastUpdated: new Date().toISOString(),
  },
  GOOGL: {
    symbol: 'GOOGL',
    price: 140.25,
    change: 0.85,
    changePercent: 0.61,
    volume: 18900000,
    marketCap: 1750000000000,
    pe: 25.8,
    lastUpdated: new Date().toISOString(),
  },
  NVDA: {
    symbol: 'NVDA',
    price: 485.60,
    change: 8.40,
    changePercent: 1.76,
    volume: 35600000,
    marketCap: 1200000000000,
    pe: 65.2,
    lastUpdated: new Date().toISOString(),
  },
  VTI: {
    symbol: 'VTI',
    price: 245.30,
    change: 1.20,
    changePercent: 0.49,
    volume: 3420000,
    lastUpdated: new Date().toISOString(),
  },
  BND: {
    symbol: 'BND',
    price: 73.25,
    change: -0.15,
    changePercent: -0.20,
    volume: 4850000,
    lastUpdated: new Date().toISOString(),
  },
  TSLA: {
    symbol: 'TSLA',
    price: 245.80,
    change: 4.30,
    changePercent: 1.78,
    volume: 67200000,
    marketCap: 780000000000,
    pe: 58.4,
    lastUpdated: new Date().toISOString(),
  },
  BTC: {
    symbol: 'BTC',
    price: 43250.00,
    change: 1250.00,
    changePercent: 2.98,
    volume: 25000000000,
    marketCap: 850000000000,
    lastUpdated: new Date().toISOString(),
  }
};

// Sector Categories for Easy Reference
export const sectors = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Materials',
  'Industrials',
  'Real Estate',
  'Utilities',
  'Communication Services',
  'Fixed Income',
  'Cryptocurrency',
  'Diversified'
] as const;

// Asset Classes for Easy Reference
export const assetClasses = [
  'stock',
  'etf', 
  'bond',
  'crypto',
  'reit'
] as const;

// Risk Tolerance Levels
export const riskToleranceLevels = [
  'conservative',
  'moderate', 
  'aggressive'
] as const;

// Sample allocation targets by risk tolerance
export const targetAllocations = {
  conservative: {
    stocks: 30,
    bonds: 50,
    etfs: 15,
    crypto: 0,
    cash: 5,
  },
  moderate: {
    stocks: 60,
    bonds: 25,
    etfs: 10,
    crypto: 2,
    cash: 3,
  },
  aggressive: {
    stocks: 80,
    bonds: 5,
    etfs: 10,
    crypto: 3,
    cash: 2,
  },
};

// Helper function to initialize mock data in store
export const initializeMockPortfolio = () => {
  return {
    holdings: mockHoldings,
    investmentGoals: mockInvestmentGoals,
    marketData: mockMarketData,
  };
};

// Helper function to add mock holdings to store
export const addMockHoldingsToStore = (addHolding: any) => {
  mockHoldings.forEach((holding) => {
    const { id, marketValue, totalReturn, totalReturnPercent, allocation, lastUpdated, ...holdingData } = holding;
    addHolding(holdingData);
  });
};

// Helper function to add mock goals to store
export const addMockGoalsToStore = (addInvestmentGoal: any) => {
  mockInvestmentGoals.forEach((goal) => {
    const { id, createdAt, status, ...goalData } = goal;
    addInvestmentGoal(goalData);
  });
};

// Generate random market data for testing
export const generateRandomMarketData = (symbol: string): MarketData => {
  const basePrice = 50 + Math.random() * 400;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / (basePrice - change)) * 100;

  return {
    symbol,
    price: basePrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000),
    marketCap: Math.random() * 3000000000000,
    pe: Math.random() * 50 + 5,
    dividend: Math.random() * 5,
    lastUpdated: new Date().toISOString(),
  };
};

// Popular stock symbols for testing/autocomplete
export const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
];

// Popular ETFs
export const popularETFs = [
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
];

// Sample portfolio scenarios for different user types
export const portfolioScenarios = {
  beginner: {
    totalValue: 25000,
    holdings: [
      {
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        shares: 80,
        avgCost: 220.00,
        sector: 'Diversified',
        assetClass: 'etf' as const,
      },
      {
        symbol: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        shares: 60,
        avgCost: 75.00,
        sector: 'Fixed Income',
        assetClass: 'bond' as const,
      }
    ]
  },
  
  intermediate: {
    totalValue: 75000,
    holdings: [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 50,
        avgCost: 150.00,
        sector: 'Technology',
        assetClass: 'stock' as const,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 25,
        avgCost: 280.00,
        sector: 'Technology',
        assetClass: 'stock' as const,
      },
      {
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        shares: 100,
        avgCost: 220.00,
        sector: 'Diversified',
        assetClass: 'etf' as const,
      }
    ]
  },
  
  advanced: {
    totalValue: 250000,
    holdings: mockHoldings
  }
};

// Historical performance data for charts
export const generateMockPerformanceHistory = (months: number = 12) => {
  const history = [];
  let value = 200000;
  
  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    // Simulate market volatility
    const monthlyReturn = (Math.random() - 0.4) * 0.1; // -5% to +6% monthly
    value *= (1 + monthlyReturn);
    
    history.push({
      date: date.toISOString().split('T')[0],
      portfolioValue: Math.round(value),
      sp500Value: Math.round(value * (0.95 + Math.random() * 0.1)), // Benchmark comparison
    });
  }
  
  return history;
};

// Mock dividend data
export const mockDividends = [
  {
    id: '1',
    symbol: 'AAPL',
    amount: 24.00,
    exDate: '2025-08-15',
    payDate: '2025-08-22',
    shares: 50,
    totalAmount: 1200.00,
  },
  {
    id: '2',
    symbol: 'MSFT',
    amount: 75.00,
    exDate: '2025-08-20',
    payDate: '2025-08-27',
    shares: 25,
    totalAmount: 1875.00,
  },
  {
    id: '3',
    symbol: 'VTI',
    amount: 1.45,
    exDate: '2025-09-10',
    payDate: '2025-09-15',
    shares: 40,
    totalAmount: 58.00,
  }
];

// Utility function to calculate portfolio metrics from holdings
export const calculatePortfolioSummary = (holdings: Holding[]) => {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.avgCost * holding.shares), 0);
  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  const dailyChange = holdings.reduce((sum, holding) => sum + (holding.dayChange * holding.shares), 0);
  
  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercent,
    dailyChange,
    dailyChangePercent: totalValue > 0 ? (dailyChange / (totalValue - dailyChange)) * 100 : 0,
  };
};

// Default export for easy importing
export default {
  holdings: mockHoldings,
  goals: mockInvestmentGoals,
  marketData: mockMarketData,
  scenarios: portfolioScenarios,
  sectors,
  assetClasses,
  riskToleranceLevels,
  targetAllocations,
  popularStocks,
  popularETFs,
  dividends: mockDividends,
};