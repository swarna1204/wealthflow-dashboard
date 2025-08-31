// src/lib/services/marketDataService.ts
import { MarketDataConfig, defaultMarketDataConfig } from '@/config/marketData';

export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
  lastUpdated: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry?: string;
  description?: string;
  employees?: number;
  website?: string;
  marketCap?: number;
  beta?: number;
}

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  type: string;
  region?: string;
  currency?: string;
}

interface MarketDataProvider {
  getQuote(symbol: string): Promise<QuoteData>;
  getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>>;
  getCompanyInfo(symbol: string): Promise<CompanyInfo>;
  searchSymbols(query: string): Promise<SymbolSearchResult[]>;
}

// Mock Data Provider for Development
class MockDataProvider implements MarketDataProvider {
  private mockData: Record<string, any> = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      marketCap: 2800000000000,
      pe: 28.5,
      high52Week: 199.62,
      low52Week: 164.08,
      volume: 52000000
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software',
      price: 378.85,
      change: -1.23,
      changePercent: -0.32,
      marketCap: 2810000000000,
      pe: 32.1,
      high52Week: 384.30,
      low52Week: 309.45,
      volume: 28000000
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      price: 2875.12,
      change: 15.67,
      changePercent: 0.55,
      marketCap: 1800000000000,
      pe: 25.8,
      high52Week: 3030.93,
      low52Week: 2193.62,
      volume: 1200000
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      sector: 'Consumer Discretionary',
      industry: 'Auto Manufacturers',
      price: 248.73,
      change: -3.45,
      changePercent: -1.37,
      marketCap: 792000000000,
      pe: 65.2,
      high52Week: 299.29,
      low52Week: 138.80,
      volume: 95000000
    },
    'NVDA': {
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      industry: 'Semiconductors',
      price: 875.28,
      change: 12.43,
      changePercent: 1.44,
      marketCap: 2160000000000,
      pe: 68.9,
      high52Week: 974.00,
      low52Week: 394.75,
      volume: 32000000
    },
    'SPY': {
      name: 'SPDR S&P 500 ETF Trust',
      sector: 'Diversified',
      industry: 'Exchange Traded Fund',
      price: 445.67,
      change: 1.89,
      changePercent: 0.43,
      marketCap: 412000000000,
      pe: null,
      high52Week: 459.44,
      low52Week: 362.23,
      volume: 45000000
    },
    'BTC': {
      name: 'Bitcoin',
      sector: 'Cryptocurrency',
      industry: 'Digital Currency',
      price: 43250.00,
      change: 1200.50,
      changePercent: 2.86,
      marketCap: 850000000000,
      pe: null,
      high52Week: 73000.00,
      low52Week: 25000.00,
      volume: 25000000
    },
    'ETH': {
      name: 'Ethereum',
      sector: 'Cryptocurrency',
      industry: 'Smart Contracts',
      price: 2650.00,
      change: 85.30,
      changePercent: 3.33,
      marketCap: 320000000000,
      pe: null,
      high52Week: 4800.00,
      low52Week: 1500.00,
      volume: 15000000
    },
    'BNB': {
      name: 'Binance Coin',
      sector: 'Cryptocurrency',
      industry: 'Exchange Token',
      price: 315.50,
      change: -8.20,
      changePercent: -2.53,
      marketCap: 47000000000,
      pe: null,
      high52Week: 690.00,
      low52Week: 200.00,
      volume: 5000000
    },
    'VTI': {
      name: 'Vanguard Total Stock Market ETF',
      sector: 'Diversified',
      industry: 'Exchange Traded Fund',
      price: 245.80,
      change: 1.20,
      changePercent: 0.49,
      marketCap: 450000000000,
      pe: null,
      high52Week: 256.70,
      low52Week: 195.12,
      volume: 3500000
    },
    'AMZN': {
      name: 'Amazon.com Inc.',
      sector: 'Consumer Discretionary',
      industry: 'Internet Retail',
      price: 151.94,
      change: 2.31,
      changePercent: 1.54,
      marketCap: 1580000000000,
      pe: 45.2,
      high52Week: 170.00,
      low52Week: 118.35,
      volume: 42000000
    },
    'META': {
      name: 'Meta Platforms Inc.',
      sector: 'Communication Services',
      industry: 'Social Media',
      price: 484.20,
      change: 8.15,
      changePercent: 1.71,
      marketCap: 1220000000000,
      pe: 23.8,
      high52Week: 531.49,
      low52Week: 274.39,
      volume: 18000000
    },
    'APP': {
      name: 'AppLovin Corporation',
      sector: 'Technology',
      industry: 'Software',
      price: 85.50,
      change: 1.25,
      changePercent: 1.48,
      marketCap: 28000000000,
      pe: 42.1,
      high52Week: 95.20,
      low52Week: 35.40,
      volume: 2500000
    },
    'AP': {
      name: 'Ampco-Pittsburgh Corporation',
      sector: 'Industrials',
      industry: 'Manufacturing',
      price: 3.45,
      change: 0.05,
      changePercent: 1.47,
      marketCap: 75000000,
      pe: null,
      high52Week: 4.20,
      low52Week: 2.80,
      volume: 150000
    },
    'AA': {
      name: 'Alcoa Corporation',
      sector: 'Materials',
      industry: 'Aluminum',
      price: 35.20,
      change: -0.80,
      changePercent: -2.22,
      marketCap: 6500000000,
      pe: 18.5,
      high52Week: 42.30,
      low52Week: 25.15,
      volume: 5200000
    },
    'AAP': {
      name: 'Advance Auto Parts Inc.',
      sector: 'Consumer Discretionary',
      industry: 'Auto Parts',
      price: 78.90,
      change: 1.15,
      changePercent: 1.48,
      marketCap: 4800000000,
      pe: 15.2,
      high52Week: 95.40,
      low52Week: 58.20,
      volume: 1200000
    },
    'AAM': {
      name: 'American Axle & Manufacturing',
      sector: 'Consumer Discretionary',
      industry: 'Auto Parts',
      price: 9.85,
      change: 0.12,
      changePercent: 1.23,
      marketCap: 1100000000,
      pe: null,
      high52Week: 12.40,
      low52Week: 6.80,
      volume: 2100000
    },
    'AMAZ': {
      name: 'Amazon Alternative Symbol',
      sector: 'Consumer Discretionary',
      industry: 'E-commerce',
      price: 152.00,
      change: 2.30,
      changePercent: 1.54,
      marketCap: 1580000000000,
      pe: 45.2,
      high52Week: 170.00,
      low52Week: 118.35,
      volume: 42000000
    },
    'AMAZON': {
      name: 'Amazon Full Name Symbol',
      sector: 'Consumer Discretionary',
      industry: 'Internet Retail',
      price: 151.94,
      change: 2.31,
      changePercent: 1.54,
      marketCap: 1580000000000,
      pe: 45.2,
      high52Week: 170.00,
      low52Week: 118.35,
      volume: 42000000
    },
    'AMZZ': {
      name: 'AMZZ Corp',
      sector: 'Technology',
      industry: 'Software',
      price: 25.40,
      change: 0.30,
      changePercent: 1.20,
      marketCap: 500000000,
      pe: 28.5,
      high52Week: 32.50,
      low52Week: 18.20,
      volume: 850000
    },
    'AMD': {
      name: 'Advanced Micro Devices Inc.',
      sector: 'Technology',
      industry: 'Semiconductors',
      price: 142.65,
      change: 3.20,
      changePercent: 2.30,
      marketCap: 230000000000,
      pe: 195.4,
      high52Week: 227.30,
      low52Week: 93.12,
      volume: 48000000
    },
    'BND': {
      name: 'Vanguard Total Bond Market ETF',
      sector: 'Fixed Income',
      industry: 'Bond Fund',
      price: 77.85,
      change: -0.15,
      changePercent: -0.19,
      marketCap: 95000000000,
      pe: null,
      high52Week: 80.12,
      low52Week: 74.20,
      volume: 8500000
    }
  };

  private addRandomVariation(basePrice: number): number {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return basePrice * (1 + variation);
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const mockInfo = this.mockData[symbol.toUpperCase()];
    if (!mockInfo) {
      throw new Error(`Symbol ${symbol} not found`);
    }

    const basePrice = mockInfo.price;
    const currentPrice = this.addRandomVariation(basePrice);
    const change = currentPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol: symbol.toUpperCase(),
      price: currentPrice,
      change,
      changePercent,
      volume: mockInfo.volume + Math.floor(Math.random() * 1000000),
      marketCap: mockInfo.marketCap,
      pe: mockInfo.pe,
      high52Week: mockInfo.high52Week,
      low52Week: mockInfo.low52Week,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
    const quotes: Record<string, QuoteData> = {};
    
    // Simulate batch processing with slight delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    for (const symbol of symbols) {
      try {
        quotes[symbol.toUpperCase()] = await this.getQuote(symbol);
      } catch (error) {
        console.warn(`Failed to get quote for ${symbol}:`, error);
      }
    }
    
    return quotes;
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockInfo = this.mockData[symbol.toUpperCase()];
    if (!mockInfo) {
      throw new Error(`Company info for ${symbol} not found`);
    }

    return {
      symbol: symbol.toUpperCase(),
      name: mockInfo.name,
      sector: mockInfo.sector,
      industry: mockInfo.industry,
      marketCap: mockInfo.marketCap,
      beta: 1 + (Math.random() - 0.5) * 0.8, // Random beta between 0.6 - 1.4
    };
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results: SymbolSearchResult[] = [];
    const queryLower = query.toLowerCase();
    
    for (const [symbol, info] of Object.entries(this.mockData)) {
      if (
        symbol.toLowerCase().includes(queryLower) || 
        info.name.toLowerCase().includes(queryLower)
      ) {
        results.push({
          symbol,
          name: info.name,
          type: symbol.includes('ETF') || symbol === 'SPY' ? 'ETF' : 'Equity',
        });
      }
    }
    
    // Add some additional mock search results
    if (queryLower.includes('a') && results.length < 5) {
      results.push(
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity' },
        { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', type: 'Equity' }
      );
    }
    
    return results.slice(0, 10);
  }
}

// Alpha Vantage Provider
class AlphaVantageProvider implements MarketDataProvider {
  constructor(private apiKey: string) {}

  async getQuote(symbol: string): Promise<QuoteData> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error(`No data found for symbol ${symbol}`);
      }

      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

      return {
        symbol: symbol.toUpperCase(),
        price,
        change,
        changePercent,
        volume: parseInt(quote['06. volume']),
        high52Week: parseFloat(quote['03. high']),
        low52Week: parseFloat(quote['04. low']),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error);
      throw error;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
    const quotes: Record<string, QuoteData> = {};
    
    // Alpha Vantage doesn't have native batch support, so we'll make sequential calls
    // with rate limiting
    for (const symbol of symbols) {
      try {
        quotes[symbol.toUpperCase()] = await this.getQuote(symbol);
        // Rate limiting: wait 12 seconds between calls for free tier
        if (symbols.indexOf(symbol) < symbols.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 12000));
        }
      } catch (error) {
        console.warn(`Failed to get quote for ${symbol}:`, error);
      }
    }
    
    return quotes;
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      return {
        symbol: symbol.toUpperCase(),
        name: data.Name || 'Unknown Company',
        sector: data.Sector || 'Unknown',
        industry: data.Industry,
        description: data.Description,
        marketCap: parseInt(data.MarketCapitalization) || undefined,
        beta: parseFloat(data.Beta) || undefined,
        website: data.Website,
        employees: parseInt(data.FullTimeEmployees) || undefined,
      };
    } catch (error) {
      console.error(`Alpha Vantage company info error for ${symbol}:`, error);
      throw error;
    }
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }
      
      const matches = data.bestMatches || [];
      return matches.slice(0, 10).map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
      }));
    } catch (error) {
      console.error('Alpha Vantage search error:', error);
      return [];
    }
  }
}

// IEX Cloud Provider
class IEXCloudProvider implements MarketDataProvider {
  constructor(private apiKey: string) {}

  async getQuote(symbol: string): Promise<QuoteData> {
    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      return {
        symbol: symbol.toUpperCase(),
        price: data.latestPrice,
        change: data.change,
        changePercent: data.changePercent * 100,
        volume: data.latestVolume,
        marketCap: data.marketCap,
        pe: data.peRatio,
        high52Week: data.week52High,
        low52Week: data.week52Low,
        lastUpdated: new Date(data.latestUpdate).toISOString(),
      };
    } catch (error) {
      console.error(`IEX Cloud API error for ${symbol}:`, error);
      throw error;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
    // IEX Cloud supports batch requests
    const symbolsParam = symbols.join(',');
    const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbolsParam}&types=quote&token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const quotes: Record<string, QuoteData> = {};
      
      for (const [symbol, stockData] of Object.entries(data)) {
        const quote = (stockData as any).quote;
        if (quote) {
          quotes[symbol.toUpperCase()] = {
            symbol: symbol.toUpperCase(),
            price: quote.latestPrice,
            change: quote.change,
            changePercent: quote.changePercent * 100,
            volume: quote.latestVolume,
            marketCap: quote.marketCap,
            pe: quote.peRatio,
            high52Week: quote.week52High,
            low52Week: quote.week52Low,
            lastUpdated: new Date(quote.latestUpdate).toISOString(),
          };
        }
      }
      
      return quotes;
    } catch (error) {
      console.error('IEX Cloud batch quotes error:', error);
      throw error;
    }
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    const url = `https://cloud.iexapis.com/stable/stock/${symbol}/company?token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      return {
        symbol: symbol.toUpperCase(),
        name: data.companyName,
        sector: data.sector,
        industry: data.industry,
        description: data.description,
        website: data.website,
        employees: data.employees,
      };
    } catch (error) {
      console.error(`IEX Cloud company info error for ${symbol}:`, error);
      throw error;
    }
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const url = `https://cloud.iexapis.com/stable/search/${encodeURIComponent(query)}?token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return data.slice(0, 10).map((item: any) => ({
        symbol: item.symbol,
        name: item.securityName,
        type: item.securityType,
        region: item.region,
      }));
    } catch (error) {
      console.error('IEX Cloud search error:', error);
      return [];
    }
  }
}

// Finnhub Provider
class FinnhubProvider implements MarketDataProvider {
  constructor(private apiKey: string) {}

  async getQuote(symbol: string): Promise<QuoteData> {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      const price = data.c; // current price
      const change = data.d; // change
      const changePercent = data.dp; // change percent

      return {
        symbol: symbol.toUpperCase(),
        price,
        change,
        changePercent,
        high52Week: data.h,
        low52Week: data.l,
        lastUpdated: new Date(data.t * 1000).toISOString(),
      };
    } catch (error) {
      console.error(`Finnhub API error for ${symbol}:`, error);
      throw error;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
    const quotes: Record<string, QuoteData> = {};
    
    // Finnhub doesn't have native batch support, make sequential calls with rate limiting
    for (const symbol of symbols) {
      try {
        quotes[symbol.toUpperCase()] = await this.getQuote(symbol);
        // Rate limiting for free tier
        if (symbols.indexOf(symbol) < symbols.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.warn(`Failed to get quote for ${symbol}:`, error);
      }
    }
    
    return quotes;
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      return {
        symbol: symbol.toUpperCase(),
        name: data.name,
        sector: this.mapFinnhubSector(data.finnhubIndustry),
        industry: data.finnhubIndustry,
        website: data.weburl,
        marketCap: data.marketCapitalization * 1000000, // Convert from millions
      };
    } catch (error) {
      console.error(`Finnhub company info error for ${symbol}:`, error);
      throw error;
    }
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return (data.result || []).slice(0, 10).map((item: any) => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type,
      }));
    } catch (error) {
      console.error('Finnhub search error:', error);
      return [];
    }
  }

  private mapFinnhubSector(industry: string): string {
    const sectorMap: Record<string, string> = {
      'Technology': 'Technology',
      'Software': 'Technology',
      'Healthcare': 'Healthcare',
      'Financial': 'Financial Services',
      'Energy': 'Energy',
      'Utilities': 'Utilities',
      'Consumer Cyclical': 'Consumer Discretionary',
      'Consumer Defensive': 'Consumer Staples',
      'Industrials': 'Industrials',
      'Real Estate': 'Real Estate',
      'Materials': 'Materials',
      'Communication': 'Communication Services',
    };
    
    for (const [key, sector] of Object.entries(sectorMap)) {
      if (industry && industry.toLowerCase().includes(key.toLowerCase())) {
        return sector;
      }
    }
    
    return 'Diversified';
  }
}

// Rate limiting helper
class RateLimiter {
  private lastCall = 0;
  
  constructor(private minIntervalMs: number) {}
  
  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastCall;
    
    if (elapsed < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - elapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastCall = Date.now();
  }
}

// Market Data Service Factory
export class MarketDataService {
  private provider: MarketDataProvider;
  private rateLimiter: RateLimiter;

  constructor(config: MarketDataConfig) {
    this.rateLimiter = new RateLimiter(config.rateLimitMs);
    
    switch (config.provider) {
      case 'alphavantage':
        if (!config.apiKey) throw new Error('API key required for Alpha Vantage');
        this.provider = new AlphaVantageProvider(config.apiKey);
        break;
      case 'iexcloud':
        if (!config.apiKey) throw new Error('API key required for IEX Cloud');
        this.provider = new IEXCloudProvider(config.apiKey);
        break;
      case 'finnhub':
        if (!config.apiKey) throw new Error('API key required for Finnhub');
        this.provider = new FinnhubProvider(config.apiKey);
        break;
      case 'mock':
      default:
        this.provider = new MockDataProvider();
        break;
    }
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    await this.rateLimiter.throttle();
    return this.provider.getQuote(symbol);
  }

  async getBatchQuotes(symbols: string[]): Promise<Record<string, QuoteData>> {
    await this.rateLimiter.throttle();
    return this.provider.getBatchQuotes(symbols);
  }

  async getCompanyInfo(symbol: string): Promise<CompanyInfo> {
    await this.rateLimiter.throttle();
    return this.provider.getCompanyInfo(symbol);
  }

  async searchSymbols(query: string): Promise<SymbolSearchResult[]> {
    await this.rateLimiter.throttle();
    return this.provider.searchSymbols(query);
  }
}

// Export factory function
export const createMarketDataService = (config: MarketDataConfig = defaultMarketDataConfig): MarketDataService => {
  return new MarketDataService(config);
};