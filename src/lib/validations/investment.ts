// src/lib/validations/investment.ts
import { z } from 'zod';

// Base Schemas
export const assetClassSchema = z.enum(['stock', 'etf', 'bond', 'crypto', 'reit']);
export const riskToleranceSchema = z.enum(['conservative', 'moderate', 'aggressive']);
export const goalStatusSchema = z.enum(['on-track', 'behind', 'ahead']);

// Holding Schemas
export const createHoldingSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol must be 10 characters or less')
    .regex(/^[A-Z0-9.-]+$/, 'Invalid symbol format'),
  name: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Name must be 100 characters or less'),
  shares: z.number()
    .positive('Shares must be positive')
    .max(1000000, 'Shares cannot exceed 1,000,000'),
  avgCost: z.number()
    .positive('Average cost must be positive')
    .max(100000, 'Average cost cannot exceed $100,000'),
  currentPrice: z.number()
    .positive('Current price must be positive')
    .max(100000, 'Price cannot exceed $100,000'),
  sector: z.string()
    .min(1, 'Sector is required')
    .max(50, 'Sector name too long'),
  assetClass: assetClassSchema,
  dayChange: z.number().optional().default(0),
  dayChangePercent: z.number().optional().default(0),
});

export const updateHoldingSchema = createHoldingSchema.partial().extend({
  id: z.string().uuid(),
});

export const holdingSchema = createHoldingSchema.extend({
  id: z.string().uuid(),
  marketValue: z.number(),
  totalReturn: z.number(),
  totalReturnPercent: z.number(),
  allocation: z.number().min(0).max(100),
  lastUpdated: z.string().datetime(),
});

// Investment Goal Schemas
export const createInvestmentGoalSchema = z.object({
  name: z.string()
    .min(1, 'Goal name is required')
    .max(50, 'Goal name must be 50 characters or less'),
  targetAmount: z.number()
    .positive('Target amount must be positive')
    .max(100000000, 'Target amount cannot exceed $100,000,000'),
  currentAmount: z.number()
    .min(0, 'Current amount cannot be negative')
    .max(100000000, 'Current amount cannot exceed $100,000,000'),
  targetDate: z.string()
    .datetime()
    .refine((date) => new Date(date) > new Date(), {
      message: 'Target date must be in the future',
    }),
  riskTolerance: riskToleranceSchema,
  monthlyContribution: z.number()
    .min(0, 'Monthly contribution cannot be negative')
    .max(1000000, 'Monthly contribution cannot exceed $1,000,000'),
});

export const updateInvestmentGoalSchema = createInvestmentGoalSchema.partial().extend({
  id: z.string().uuid(),
});

export const investmentGoalSchema = createInvestmentGoalSchema.extend({
  id: z.string().uuid(),
  status: goalStatusSchema,
  createdAt: z.string().datetime(),
});

// Portfolio Schemas
export const assetAllocationSchema = z.object({
  stocks: z.number().min(0).max(100),
  bonds: z.number().min(0).max(100),
  etfs: z.number().min(0).max(100),
  crypto: z.number().min(0).max(100),
  cash: z.number().min(0).max(100),
}).refine(
  (data) => {
    const total = data.stocks + data.bonds + data.etfs + data.crypto + data.cash;
    return Math.abs(total - 100) < 0.01; // Allow for small rounding errors
  },
  {
    message: 'Asset allocation must total 100%',
  }
);

export const portfolioSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  totalValue: z.number().min(0),
  totalCost: z.number().min(0),
  dailyChange: z.number(),
  dailyChangePercent: z.number(),
  totalReturn: z.number(),
  totalReturnPercent: z.number(),
  assetAllocation: assetAllocationSchema,
  sectorAllocation: z.record(z.string(), z.number().min(0).max(100)),
  lastUpdated: z.string().datetime(),
});

// Market Data Schemas
export const stockQuoteSchema = z.object({
  symbol: z.string(),
  price: z.number().positive(),
  change: z.number(),
  changePercent: z.number(),
  dayHigh: z.number().positive(),
  dayLow: z.number().positive(),
  volume: z.number().min(0),
  avgVolume: z.number().min(0),
  marketCap: z.number().positive().optional(),
  pe: z.number().positive().optional(),
  eps: z.number().optional(),
  dividend: z.number().min(0).optional(),
  dividendYield: z.number().min(0).max(100).optional(),
  beta: z.number().positive().optional(),
  fiftyTwoWeekHigh: z.number().positive().optional(),
  fiftyTwoWeekLow: z.number().positive().optional(),
  lastUpdated: z.string().datetime(),
});

export const historicalDataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().min(0),
});

export const marketIndexSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  value: z.number().positive(),
  change: z.number(),
  changePercent: z.number(),
  lastUpdated: z.string().datetime(),
});

// Watchlist Schemas
export const alertRulesSchema = z.object({
  priceAbove: z.number().positive().optional(),
  priceBelow: z.number().positive().optional(),
  changeAbove: z.number().optional(),
  changeBelow: z.number().optional(),
}).optional();

export const watchlistItemSchema = z.object({
  id: z.string().uuid(),
  symbol: z.string(),
  name: z.string(),
  addedAt: z.string().datetime(),
  alertRules: alertRulesSchema,
});

export const createWatchlistItemSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol must be 10 characters or less')
    .regex(/^[A-Z0-9.-]+$/, 'Invalid symbol format'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  alertRules: alertRulesSchema,
});

// Performance Metrics Schema
export const performanceMetricsSchema = z.object({
  volatility: z.number().min(0).max(100),
  sharpeRatio: z.number(),
  beta: z.number().positive(),
  maxDrawdown: z.number().max(0),
  annualizedReturn: z.number(),
  benchmarkComparison: z.object({
    sp500: z.number(),
    nasdaq: z.number(),
    portfolio: z.number(),
  }),
});

// API Configuration Schema
export const apiConfigSchema = z.object({
  provider: z.enum(['alpha_vantage', 'iex_cloud', 'yahoo_finance', 'finnhub', 'mock']),
  apiKey: z.string().optional(),
  requestsPerMinute: z.number().positive().max(1000),
  requestsUsed: z.number().min(0),
  lastReset: z.string().datetime(),
});

// Form Schemas for React Hook Form
export const addHoldingFormSchema = createHoldingSchema.extend({
  // Additional form-specific validations
  symbol: createHoldingSchema.shape.symbol.transform((val) => val.toUpperCase()),
  purchaseDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => new Date(date) <= new Date(), {
      message: 'Purchase date cannot be in the future',
    }),
});

export const investmentGoalFormSchema = createInvestmentGoalSchema.extend({
  // Additional form-specific validations
  targetDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .transform((date) => new Date(date).toISOString())
    .refine(
      (date) => new Date(date) > new Date(),
      {
        message: 'Target date must be in the future',
      }
    ),
});

// Type Exports
export type CreateHolding = z.infer<typeof createHoldingSchema>;
export type UpdateHolding = z.infer<typeof updateHoldingSchema>;
export type Holding = z.infer<typeof holdingSchema>;
export type CreateInvestmentGoal = z.infer<typeof createInvestmentGoalSchema>;
export type UpdateInvestmentGoal = z.infer<typeof updateInvestmentGoalSchema>;
export type InvestmentGoal = z.infer<typeof investmentGoalSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export type StockQuote = z.infer<typeof stockQuoteSchema>;
export type HistoricalDataPoint = z.infer<typeof historicalDataPointSchema>;
export type MarketIndex = z.infer<typeof marketIndexSchema>;
export type WatchlistItem = z.infer<typeof watchlistItemSchema>;
export type CreateWatchlistItem = z.infer<typeof createWatchlistItemSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetricsSchema>;
export type APIConfig = z.infer<typeof apiConfigSchema>;
export type AddHoldingForm = z.infer<typeof addHoldingFormSchema>;
export type InvestmentGoalForm = z.infer<typeof investmentGoalFormSchema>;

// Validation Helper Functions
export const validateHolding = (data: unknown) => {
  return holdingSchema.safeParse(data);
};

export const validateInvestmentGoal = (data: unknown) => {
  return investmentGoalSchema.safeParse(data);
};

export const validatePortfolio = (data: unknown) => {
  return portfolioSchema.safeParse(data);
};

export const validateStockQuote = (data: unknown) => {
  return stockQuoteSchema.safeParse(data);
};

// Custom Validation Rules
export const customValidations = {
  isValidSymbol: (symbol: string) => {
    return /^[A-Z0-9.-]+$/.test(symbol) && symbol.length <= 10;
  },
  
  isReasonablePrice: (price: number) => {
    return price > 0 && price < 100000;
  },
  
  isReasonableShares: (shares: number) => {
    return shares > 0 && shares <= 1000000;
  },
  
  isValidAllocation: (allocation: Record<string, number>) => {
    const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    return Math.abs(total - 100) < 0.01;
  },
  
  isFutureDate: (date: string) => {
    return new Date(date) > new Date();
  },
  
  isValidDateRange: (startDate: string, endDate: string) => {
    return new Date(startDate) < new Date(endDate);
  },
};

// Error Messages
export const investmentErrorMessages = {
  INVALID_SYMBOL: 'Please enter a valid stock symbol',
  INVALID_SHARES: 'Shares must be a positive number',
  INVALID_PRICE: 'Please enter a valid price',
  INVALID_ALLOCATION: 'Asset allocation must total 100%',
  INVALID_DATE: 'Please select a valid date',
  FUTURE_DATE_REQUIRED: 'Date must be in the future',
  DUPLICATE_HOLDING: 'This holding already exists in your portfolio',
  MARKET_DATA_ERROR: 'Failed to fetch market data',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait before trying again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;