// src/config/marketData.ts
export interface MarketDataConfig {
  provider: 'alphavantage' | 'iexcloud' | 'finnhub' | 'mock';
  apiKey?: string;
  rateLimitMs: number;
}

export interface ProviderConfig {
  name: string;
  description: string;
  website?: string;
  features: string[];
  requiresApiKey: boolean;
  rateLimit: {
    free: number;
    paid?: number;
  };
}

export const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  alphavantage: {
    name: 'Alpha Vantage',
    description: 'Comprehensive financial data with global coverage',
    website: 'https://www.alphavantage.co',
    features: [
      'Real-time stock quotes',
      'Company fundamentals',
      'Technical indicators',
      'Global market coverage',
      'News & sentiment data'
    ],
    requiresApiKey: true,
    rateLimit: { free: 5, paid: 75 }
  },
  iexcloud: {
    name: 'IEX Cloud',
    description: 'Fast, reliable financial data API',
    website: 'https://iexcloud.io',
    features: [
      'Real-time market data',
      'Company information',
      'Historical prices',
      'Earnings & financials',
      'ESG data'
    ],
    requiresApiKey: true,
    rateLimit: { free: 50, paid: 1000 }
  },
  finnhub: {
    name: 'Finnhub',
    description: 'Professional-grade financial data',
    website: 'https://finnhub.io',
    features: [
      'Stock prices & quotes',
      'Company profiles',
      'Financial statements',
      'Market news',
      'Alternative data'
    ],
    requiresApiKey: true,
    rateLimit: { free: 60, paid: 300 }
  },
  mock: {
    name: 'Mock Data',
    description: 'Simulated data for development and testing',
    features: [
      'Realistic price movements',
      'No API limits',
      'Always available',
      'Perfect for development'
    ],
    requiresApiKey: false,
    rateLimit: { free: 1000 }
  }
};

export const RATE_LIMITS = {
  alphavantage: { free: 5 },
  iexcloud: { free: 50 },
  finnhub: { free: 60 },
  mock: { free: 1000 }
};

export const defaultMarketDataConfig: MarketDataConfig = {
  provider: 'mock',
  rateLimitMs: 1000,
};