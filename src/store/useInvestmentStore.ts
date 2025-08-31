// src/store/useInvestmentStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { MarketDataService, createMarketDataService, type QuoteData, type CompanyInfo, type SymbolSearchResult } from '@/lib/services/marketDataService';
import { defaultMarketDataConfig, type MarketDataConfig } from '@/config/marketData';

// Types
export interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector: string;
  assetClass: 'stock' | 'etf' | 'bond' | 'crypto' | 'reit';
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  marketValue: number;
  allocation: number;
  lastUpdated: string;
  // Additional metadata from market data
  volume?: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
}

export interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'on-track' | 'ahead' | 'behind';
  category: 'retirement' | 'house' | 'emergency' | 'education' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  assetAllocation: {
    stocks: number;
    etfs: number;
    bonds: number;
    crypto: number;
    cash: number;
    reit: number;
  };
  lastUpdated: string;
}

export interface PerformanceMetrics {
  volatility: number;
  sharpeRatio: number;
  beta: number;
  maxDrawdown: number;
  annualizedReturn: number;
  benchmarkComparison: {
    portfolio: number;
    sp500: number;
    nasdaq: number;
  };
}

export interface MarketDataSettings {
  provider: 'alphavantage' | 'iexcloud' | 'finnhub' | 'mock';
  apiKey?: string;
  autoRefreshInterval: number; // minutes
  enableRealTimeUpdates: boolean;
}

interface InvestmentState {
  // Data
  holdings: Holding[];
  goals: InvestmentGoal[];
  portfolio: Portfolio | null;
  performanceMetrics: PerformanceMetrics | null;
  
  // UI State
  viewMode: 'overview' | 'holdings' | 'performance' | 'goals';
  isLoading: boolean;
  isUpdatingPrices: boolean;
  error: string | null;
  lastRefresh: string | null;
  
  // Market Data Settings
  marketDataSettings: MarketDataSettings;
  
  // Actions
  addHolding: (holding: Omit<Holding, 'id' | 'totalReturn' | 'totalReturnPercent' | 'marketValue' | 'allocation' | 'lastUpdated'>) => Promise<void>;
  updateHolding: (id: string, updates: Partial<Holding>) => Promise<void>;
  removeHolding: (id: string) => void;
  
  addGoal: (goal: Omit<InvestmentGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<InvestmentGoal>) => void;
  removeGoal: (id: string) => void;
  
  refreshAllData: () => Promise<void>;
  refreshHoldingPrice: (symbol: string) => Promise<void>;
  bulkRefreshPrices: (symbols?: string[]) => Promise<void>;
  
  setViewMode: (mode: 'overview' | 'holdings' | 'performance' | 'goals') => void;
  updateMarketDataSettings: (settings: Partial<MarketDataSettings>) => void;
  
  // Market Data Methods
  searchSymbols: (query: string) => Promise<SymbolSearchResult[]>;
  getCompanyInfo: (symbol: string) => Promise<CompanyInfo | null>;
  
  // Calculations
  calculatePortfolio: () => void;
  calculatePerformanceMetrics: () => void;
  
  // Utility
  clearError: () => void;
  resetData: () => void;
}

// Market data service instance (will be recreated when settings change)
let marketDataService = createMarketDataService(defaultMarketDataConfig);

const useInvestmentStore = create<InvestmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        holdings: [],
        goals: [],
        portfolio: null,
        performanceMetrics: null,
        
        viewMode: 'overview',
        isLoading: false,
        isUpdatingPrices: false,
        error: null,
        lastRefresh: null,
        
        marketDataSettings: {
          provider: 'mock',
          autoRefreshInterval: 5, // 5 minutes
          enableRealTimeUpdates: false,
        },

        // Actions
        addHolding: async (holdingData) => {
          set({ isLoading: true, error: null });
          
          try {
            // Fetch current market data for the new holding
            const quote = await marketDataService.getQuote(holdingData.symbol);
            const companyInfo = await get().getCompanyInfo(holdingData.symbol);
            
            const newHolding: Holding = {
              ...holdingData,
              id: crypto.randomUUID(),
              currentPrice: quote.price,
              dayChange: quote.change,
              dayChangePercent: quote.changePercent,
              totalReturn: 0, // Will be calculated
              totalReturnPercent: 0, // Will be calculated
              marketValue: 0, // Will be calculated
              allocation: 0, // Will be calculated
              lastUpdated: quote.lastUpdated,
              volume: quote.volume,
              marketCap: quote.marketCap,
              pe: quote.pe,
              high52Week: quote.high52Week,
              low52Week: quote.low52Week,
              // Update company info if available
              name: companyInfo?.name || holdingData.name,
              sector: companyInfo?.sector || holdingData.sector,
            };

            // Calculate derived values
            newHolding.marketValue = newHolding.shares * newHolding.currentPrice;
            newHolding.totalReturn = newHolding.marketValue - (newHolding.shares * newHolding.avgCost);
            newHolding.totalReturnPercent = ((newHolding.currentPrice - newHolding.avgCost) / newHolding.avgCost) * 100;

            const currentHoldings = get().holdings;
            const updatedHoldings = [...currentHoldings, newHolding];
            
            set({ holdings: updatedHoldings, isLoading: false });
            
            // Recalculate portfolio and allocations
            get().calculatePortfolio();
            
          } catch (error) {
            console.error('Failed to add holding:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to add holding',
              isLoading: false 
            });
          }
        },

        updateHolding: async (id, updates) => {
          set({ isLoading: true, error: null });
          
          try {
            const currentHoldings = get().holdings;
            const holdingIndex = currentHoldings.findIndex(h => h.id === id);
            
            if (holdingIndex === -1) {
              throw new Error('Holding not found');
            }

            const currentHolding = currentHoldings[holdingIndex];
            let updatedHolding = { ...currentHolding, ...updates };

            // If symbol changed, fetch new market data
            if (updates.symbol && updates.symbol !== currentHolding.symbol) {
              const quote = await marketDataService.getQuote(updates.symbol);
              const companyInfo = await get().getCompanyInfo(updates.symbol);
              
              updatedHolding = {
                ...updatedHolding,
                currentPrice: quote.price,
                dayChange: quote.change,
                dayChangePercent: quote.changePercent,
                lastUpdated: quote.lastUpdated,
                volume: quote.volume,
                marketCap: quote.marketCap,
                pe: quote.pe,
                high52Week: quote.high52Week,
                low52Week: quote.low52Week,
                name: companyInfo?.name || updatedHolding.name,
                sector: companyInfo?.sector || updatedHolding.sector,
              };
            }

            // Recalculate derived values
            updatedHolding.marketValue = updatedHolding.shares * updatedHolding.currentPrice;
            updatedHolding.totalReturn = updatedHolding.marketValue - (updatedHolding.shares * updatedHolding.avgCost);
            updatedHolding.totalReturnPercent = ((updatedHolding.currentPrice - updatedHolding.avgCost) / updatedHolding.avgCost) * 100;

            const updatedHoldings = [...currentHoldings];
            updatedHoldings[holdingIndex] = updatedHolding;
            
            set({ holdings: updatedHoldings, isLoading: false });
            
            // Recalculate portfolio
            get().calculatePortfolio();
            
          } catch (error) {
            console.error('Failed to update holding:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update holding',
              isLoading: false 
            });
          }
        },

        removeHolding: (id) => {
          const currentHoldings = get().holdings;
          const updatedHoldings = currentHoldings.filter(h => h.id !== id);
          set({ holdings: updatedHoldings });
          get().calculatePortfolio();
        },

        addGoal: (goalData) => {
          const newGoal: InvestmentGoal = {
            ...goalData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          const currentGoals = get().goals;
          set({ goals: [...currentGoals, newGoal] });
        },

        updateGoal: (id, updates) => {
          const currentGoals = get().goals;
          const updatedGoals = currentGoals.map(goal => 
            goal.id === id 
              ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
              : goal
          );
          set({ goals: updatedGoals });
        },

        removeGoal: (id) => {
          const currentGoals = get().goals;
          const updatedGoals = currentGoals.filter(goal => goal.id !== id);
          set({ goals: updatedGoals });
        },

        refreshAllData: async () => {
          const { holdings } = get();
          if (holdings.length === 0) return;

          set({ isUpdatingPrices: true, error: null });
          
          try {
            const symbols = holdings.map(h => h.symbol);
            const quotes = await marketDataService.getBatchQuotes(symbols);
            
            const updatedHoldings = holdings.map(holding => {
              const quote = quotes[holding.symbol];
              if (!quote) return holding;
              
              const updatedHolding = {
                ...holding,
                currentPrice: quote.price,
                dayChange: quote.change,
                dayChangePercent: quote.changePercent,
                lastUpdated: quote.lastUpdated,
                volume: quote.volume,
                marketCap: quote.marketCap,
                pe: quote.pe,
                high52Week: quote.high52Week,
                low52Week: quote.low52Week,
              };
              
              // Recalculate derived values
              updatedHolding.marketValue = updatedHolding.shares * updatedHolding.currentPrice;
              updatedHolding.totalReturn = updatedHolding.marketValue - (updatedHolding.shares * updatedHolding.avgCost);
              updatedHolding.totalReturnPercent = ((updatedHolding.currentPrice - updatedHolding.avgCost) / updatedHolding.avgCost) * 100;
              
              return updatedHolding;
            });
            
            set({ 
              holdings: updatedHoldings, 
              isUpdatingPrices: false,
              lastRefresh: new Date().toISOString()
            });
            
            // Recalculate portfolio and performance metrics
            get().calculatePortfolio();
            get().calculatePerformanceMetrics();
            
          } catch (error) {
            console.error('Failed to refresh data:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to refresh market data',
              isUpdatingPrices: false 
            });
          }
        },

        refreshHoldingPrice: async (symbol) => {
          const { holdings } = get();
          const holding = holdings.find(h => h.symbol === symbol);
          
          if (!holding) {
            console.warn(`Holding with symbol ${symbol} not found`);
            return;
          }

          try {
            const quote = await marketDataService.getQuote(symbol);
            
            const updatedHoldings = holdings.map(h => {
              if (h.symbol !== symbol) return h;
              
              const updated = {
                ...h,
                currentPrice: quote.price,
                dayChange: quote.change,
                dayChangePercent: quote.changePercent,
                lastUpdated: quote.lastUpdated,
                volume: quote.volume,
                marketCap: quote.marketCap,
                pe: quote.pe,
                high52Week: quote.high52Week,
                low52Week: quote.low52Week,
              };
              
              // Recalculate derived values
              updated.marketValue = updated.shares * updated.currentPrice;
              updated.totalReturn = updated.marketValue - (updated.shares * updated.avgCost);
              updated.totalReturnPercent = ((updated.currentPrice - updated.avgCost) / updated.avgCost) * 100;
              
              return updated;
            });
            
            set({ holdings: updatedHoldings });
            get().calculatePortfolio();
            
          } catch (error) {
            console.error(`Failed to refresh price for ${symbol}:`, error);
            set({ 
              error: error instanceof Error ? error.message : `Failed to refresh price for ${symbol}`
            });
          }
        },

        bulkRefreshPrices: async (symbols) => {
          const { holdings } = get();
          const targetSymbols = symbols || holdings.map(h => h.symbol);
          
          if (targetSymbols.length === 0) return;

          set({ isUpdatingPrices: true, error: null });
          
          try {
            const quotes = await marketDataService.getBatchQuotes(targetSymbols);
            
            const updatedHoldings = holdings.map(holding => {
              const quote = quotes[holding.symbol];
              if (!quote) return holding;
              
              const updated = {
                ...holding,
                currentPrice: quote.price,
                dayChange: quote.change,
                dayChangePercent: quote.changePercent,
                lastUpdated: quote.lastUpdated,
                volume: quote.volume,
                marketCap: quote.marketCap,
                pe: quote.pe,
                high52Week: quote.high52Week,
                low52Week: quote.low52Week,
              };
              
              // Recalculate derived values
              updated.marketValue = updated.shares * updated.currentPrice;
              updated.totalReturn = updated.marketValue - (updated.shares * updated.avgCost);
              updated.totalReturnPercent = ((updated.currentPrice - updated.avgCost) / updated.avgCost) * 100;
              
              return updated;
            });
            
            set({ 
              holdings: updatedHoldings,
              isUpdatingPrices: false,
              lastRefresh: new Date().toISOString()
            });
            
            get().calculatePortfolio();
            
          } catch (error) {
            console.error('Failed to bulk refresh prices:', error);
            set({ 
              error: error instanceof Error ? error.message : 'Failed to refresh prices',
              isUpdatingPrices: false 
            });
          }
        },

        setViewMode: (mode) => set({ viewMode: mode }),

        updateMarketDataSettings: (settings) => {
          const currentSettings = get().marketDataSettings;
          const newSettings = { ...currentSettings, ...settings };
          
          // Recreate market data service if provider or API key changed
          if (settings.provider || settings.apiKey) {
            const config: MarketDataConfig = {
              provider: newSettings.provider,
              apiKey: newSettings.apiKey,
              rateLimitMs: 1000,
            };
            marketDataService = createMarketDataService(config);
          }
          
          set({ marketDataSettings: newSettings });
        },

        searchSymbols: async (query) => {
          try {
            return await marketDataService.searchSymbols(query);
          } catch (error) {
            console.error('Failed to search symbols:', error);
            return [];
          }
        },

        getCompanyInfo: async (symbol) => {
          try {
            return await marketDataService.getCompanyInfo(symbol);
          } catch (error) {
            console.error(`Failed to get company info for ${symbol}:`, error);
            return null;
          }
        },

        calculatePortfolio: () => {
          const { holdings } = get();
          
          if (holdings.length === 0) {
            set({ portfolio: null });
            return;
          }

          const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
          const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
          const totalReturn = totalValue - totalCost;
          const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
          
          // Calculate daily change
          const dailyChange = holdings.reduce((sum, h) => sum + (h.shares * h.dayChange), 0);
          const dailyChangePercent = totalValue > 0 ? (dailyChange / (totalValue - dailyChange)) * 100 : 0;

          // Calculate asset allocation
          const assetAllocation = {
            stocks: 0,
            etfs: 0,
            bonds: 0,
            crypto: 0,
            cash: 0,
            reit: 0,
          };

          holdings.forEach(holding => {
            const percentage = (holding.marketValue / totalValue) * 100;
            holding.allocation = percentage;
            
            switch (holding.assetClass) {
              case 'stock':
                assetAllocation.stocks += percentage;
                break;
              case 'etf':
                assetAllocation.etfs += percentage;
                break;
              case 'bond':
                assetAllocation.bonds += percentage;
                break;
              case 'crypto':
                assetAllocation.crypto += percentage;
                break;
              case 'reit':
                assetAllocation.reit += percentage;
                break;
            }
          });

          const portfolio: Portfolio = {
            totalValue,
            totalCost,
            totalReturn,
            totalReturnPercent,
            dailyChange,
            dailyChangePercent,
            assetAllocation,
            lastUpdated: new Date().toISOString(),
          };

          // Update holdings with calculated allocations
          set({ portfolio, holdings: [...holdings] });
        },

        calculatePerformanceMetrics: () => {
          const { holdings, portfolio } = get();
          
          if (!portfolio || holdings.length === 0) {
            set({ performanceMetrics: null });
            return;
          }

          // Mock performance metrics calculation
          // In a real implementation, you'd calculate these based on historical data
          const mockMetrics: PerformanceMetrics = {
            volatility: 15.5 + Math.random() * 10, // Mock volatility
            sharpeRatio: 0.8 + Math.random() * 0.5, // Mock Sharpe ratio
            beta: 0.9 + Math.random() * 0.3, // Mock beta
            maxDrawdown: -(5 + Math.random() * 15), // Mock max drawdown
            annualizedReturn: portfolio.totalReturnPercent * (365 / 30), // Rough annualized estimate
            benchmarkComparison: {
              portfolio: portfolio.totalReturnPercent,
              sp500: 8.5 + Math.random() * 5, // Mock S&P 500 return
              nasdaq: 10.2 + Math.random() * 8, // Mock NASDAQ return
            },
          };

          set({ performanceMetrics: mockMetrics });
        },

        clearError: () => set({ error: null }),
        
        resetData: () => set({
          holdings: [],
          goals: [],
          portfolio: null,
          performanceMetrics: null,
          error: null,
          lastRefresh: null,
        }),
      }),
      {
        name: 'investment-store',
        partialize: (state) => ({
          holdings: state.holdings,
          goals: state.goals,
          marketDataSettings: state.marketDataSettings,
          viewMode: state.viewMode,
        }),
      }
    ),
    {
      name: 'investment-store',
    }
  )
);

// Derived selectors
export const usePortfolio = () => useInvestmentStore((state) => state.portfolio);
export const useHoldings = () => useInvestmentStore((state) => state.holdings);
export const useInvestmentGoals = () => useInvestmentStore((state) => state.goals);
export const usePerformanceMetrics = () => useInvestmentStore((state) => state.performanceMetrics);
export const useInvestmentLoading = () => useInvestmentStore((state) => state.isLoading);
export const useMarketDataSettings = () => useInvestmentStore((state) => state.marketDataSettings);

// Auto-refresh functionality
let autoRefreshInterval: NodeJS.Timeout | null = null;

export const setupAutoRefresh = () => {
  const clearAutoRefresh = () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      autoRefreshInterval = null;
    }
  };

  const startAutoRefresh = () => {
    clearAutoRefresh();
    
    const settings = useInvestmentStore.getState().marketDataSettings;
    
    if (!settings.enableRealTimeUpdates || settings.autoRefreshInterval <= 0) {
      return;
    }

    autoRefreshInterval = setInterval(() => {
      const { holdings, refreshAllData } = useInvestmentStore.getState();
      
      if (holdings.length > 0) {
        console.log('Auto-refreshing market data...');
        refreshAllData();
      }
    }, settings.autoRefreshInterval * 60 * 1000); // Convert minutes to milliseconds
  };

  // Subscribe to settings changes
  let previousSettings = useInvestmentStore.getState().marketDataSettings;
  useInvestmentStore.subscribe((state) => {
    if (JSON.stringify(state.marketDataSettings) !== JSON.stringify(previousSettings)) {
      previousSettings = state.marketDataSettings;
      startAutoRefresh();
    }
  });

  // Start initial auto-refresh
  startAutoRefresh();

  return clearAutoRefresh;
};

export default useInvestmentStore;