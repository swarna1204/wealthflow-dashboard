// src/store/useMarketDataStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Market Data Types
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  dividend?: number;
  dividendYield?: number;
  beta?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  lastUpdated: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  addedAt: string;
}

// Store State Interface
interface MarketDataState {
  // Data
  quotes: Record<string, StockQuote>;
  historicalData: Record<string, HistoricalData[]>;
  marketIndices: MarketIndex[];
  watchlist: WatchlistItem[];
  
  // UI State
  isLoading: boolean;
  isFetching: Record<string, boolean>;
  lastUpdate: string | null;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
  
  // Error Handling
  errors: Record<string, string>;
  generalError: string | null;
  
  // Actions - Data Fetching
  fetchQuote: (symbol: string) => Promise<void>;
  fetchQuotes: (symbols: string[]) => Promise<void>;
  fetchHistoricalData: (symbol: string, period: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '2Y' | '5Y') => Promise<void>;
  
  // Actions - Market Indices
  fetchMarketIndices: () => Promise<void>;
  
  // Actions - Watchlist
  addToWatchlist: (symbol: string, name: string) => void;
  removeFromWatchlist: (id: string) => void;
  
  // Actions - Auto Refresh
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (minutes: number) => void;
  refreshWatchlist: () => Promise<void>;
  
  // Actions - Error Management
  setError: (symbol: string, error: string) => void;
  clearError: (symbol: string) => void;
  clearAllErrors: () => void;
  
  // Actions - Utilities
  getQuoteAge: (symbol: string) => number;
  isQuoteStale: (symbol: string, maxAgeMinutes?: number) => boolean;
  
  // Actions - Data Management
  resetStore: () => void;
}

// Mock Data
const mockMarketIndices: MarketIndex[] = [
  {
    symbol: 'SPY',
    name: 'S&P 500',
    value: 4563.89,
    change: 12.45,
    changePercent: 0.27,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'QQQ',
    name: 'NASDAQ 100',
    value: 389.23,
    change: -2.31,
    changePercent: -0.59,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: 'IWM',
    name: 'Russell 2000',
    value: 196.78,
    change: 0.89,
    changePercent: 0.45,
    lastUpdated: new Date().toISOString(),
  },
];

// Store Implementation
export const useMarketDataStore = create<MarketDataState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    quotes: {},
    historicalData: {},
    marketIndices: mockMarketIndices,
    watchlist: [],
    
    isLoading: false,
    isFetching: {},
    lastUpdate: null,
    autoRefresh: true,
    refreshInterval: 5,
    
    errors: {},
    generalError: null,

    // Data Fetching
    fetchQuote: async (symbol) => {
      set((state) => ({
        isFetching: { ...state.isFetching, [symbol]: true },
        errors: { ...state.errors, [symbol]: '' },
      }));

      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockQuote: StockQuote = {
          symbol,
          price: Math.random() * 200 + 50,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 10,
          dayHigh: Math.random() * 220 + 60,
          dayLow: Math.random() * 180 + 40,
          volume: Math.floor(Math.random() * 10000000),
          avgVolume: Math.floor(Math.random() * 5000000),
          marketCap: Math.random() * 1000000000000,
          pe: Math.random() * 30 + 5,
          eps: Math.random() * 10 + 1,
          dividend: Math.random() * 5,
          dividendYield: Math.random() * 8,
          beta: Math.random() * 2 + 0.5,
          fiftyTwoWeekHigh: Math.random() * 250 + 80,
          fiftyTwoWeekLow: Math.random() * 150 + 30,
          lastUpdated: new Date().toISOString(),
        };

        set((state) => ({
          quotes: { ...state.quotes, [symbol]: mockQuote },
          isFetching: { ...state.isFetching, [symbol]: false },
          lastUpdate: new Date().toISOString(),
        }));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quote';
        
        set((state) => ({
          isFetching: { ...state.isFetching, [symbol]: false },
          errors: { ...state.errors, [symbol]: errorMessage },
        }));
      }
    },

    fetchQuotes: async (symbols) => {
      set({ isLoading: true });
      
      const fetchPromises = symbols.map((symbol) => get().fetchQuote(symbol));
      await Promise.allSettled(fetchPromises);
      
      set({ isLoading: false });
    },

    fetchHistoricalData: async (symbol, period) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const days = period === '1D' ? 1 : period === '5D' ? 5 : period === '1M' ? 30 : 
                    period === '3M' ? 90 : period === '6M' ? 180 : period === '1Y' ? 365 : 
                    period === '2Y' ? 730 : 1825;
        
        const mockHistoricalData: HistoricalData[] = [];
        let basePrice = 100 + Math.random() * 100;
        
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const change = (Math.random() - 0.5) * 5;
          basePrice += change;
          
          const open = basePrice;
          const close = basePrice + (Math.random() - 0.5) * 3;
          const high = Math.max(open, close) + Math.random() * 2;
          const low = Math.min(open, close) - Math.random() * 2;
          
          mockHistoricalData.push({
            date: date.toISOString().split('T')[0],
            open,
            high,
            low,
            close,
            volume: Math.floor(Math.random() * 10000000),
          });
        }

        set((state) => ({
          historicalData: { ...state.historicalData, [symbol]: mockHistoricalData },
        }));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch historical data';
        
        set((state) => ({
          errors: { ...state.errors, [symbol]: errorMessage },
        }));
      }
    },

    // Market Indices
    fetchMarketIndices: async () => {
      try {
        const updatedIndices = mockMarketIndices.map(index => ({
          ...index,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 2,
          lastUpdated: new Date().toISOString(),
        }));

        set({ marketIndices: updatedIndices });

      } catch (error) {
        set({ 
          generalError: error instanceof Error ? error.message : 'Failed to fetch market indices' 
        });
      }
    },

    // Watchlist Management
    addToWatchlist: (symbol, name) => {
      const item: WatchlistItem = {
        id: crypto.randomUUID(),
        symbol: symbol.toUpperCase(),
        name,
        addedAt: new Date().toISOString(),
      };

      set((state) => ({
        watchlist: [...state.watchlist, item],
      }));

      get().fetchQuote(symbol);
    },

    removeFromWatchlist: (id) => {
      set((state) => ({
        watchlist: state.watchlist.filter((item) => item.id !== id),
      }));
    },

    // Auto Refresh Management
    setAutoRefresh: (enabled) => {
      set({ autoRefresh: enabled });
    },

    setRefreshInterval: (minutes) => {
      set({ refreshInterval: minutes });
    },

    refreshWatchlist: async () => {
      const { watchlist } = get();
      const symbols = watchlist.map((item) => item.symbol);
      
      if (symbols.length > 0) {
        await get().fetchQuotes(symbols);
      }
    },

    // Error Management
    setError: (symbol, error) => {
      set((state) => ({
        errors: { ...state.errors, [symbol]: error },
      }));
    },

    clearError: (symbol) => {
      set((state) => {
        const newErrors = { ...state.errors };
        delete newErrors[symbol];
        return { errors: newErrors };
      });
    },

    clearAllErrors: () => {
      set({ errors: {}, generalError: null });
    },

    // Utilities
    getQuoteAge: (symbol) => {
      const quote = get().quotes[symbol];
      if (!quote) return Infinity;
      
      const lastUpdated = new Date(quote.lastUpdated);
      const now = new Date();
      return (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
    },

    isQuoteStale: (symbol, maxAgeMinutes = 15) => {
      return get().getQuoteAge(symbol) > maxAgeMinutes;
    },

    // Data Management
    resetStore: () => {
      set({
        quotes: {},
        historicalData: {},
        marketIndices: mockMarketIndices,
        watchlist: [],
        
        isLoading: false,
        isFetching: {},
        lastUpdate: null,
        autoRefresh: true,
        refreshInterval: 5,
        
        errors: {},
        generalError: null,
      });
    },
  }))
);

// Selectors for performance
export const useQuotes = () => useMarketDataStore((state) => state.quotes);
export const useMarketIndices = () => useMarketDataStore((state) => state.marketIndices);
export const useWatchlist = () => useMarketDataStore((state) => state.watchlist);
export const useMarketLoading = () => useMarketDataStore((state) => state.isLoading);