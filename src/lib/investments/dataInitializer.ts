// src/lib/investments/dataInitializer.ts
import useInvestmentStore from '@/store/useInvestmentStore';
import mockInvestmentData, { 
  mockHoldings, 
  mockInvestmentGoals, 
  mockMarketData,
  portfolioScenarios,
  generateRandomMarketData
} from '@/data/mockInvestments';

// Initialize store with mock data
export const initializeInvestmentStore = async (scenario: 'beginner' | 'intermediate' | 'advanced' = 'advanced') => {
  const store = useInvestmentStore.getState();
  
  // Clear existing data
  store.resetData();
  
  console.log(`🚀 Initializing investment store with ${scenario} scenario...`);
  
  try {
    // Add mock data based on scenario
    const selectedScenario = portfolioScenarios[scenario];
    
    if (scenario === 'advanced') {
      // Use full mock holdings for advanced scenario with proper async handling
      const holdingPromises = mockHoldings.map(async (holding) => {
        const { id, marketValue, totalReturn, totalReturnPercent, allocation, lastUpdated, ...holdingData } = holding;
        try {
          await store.addHolding(holdingData);
          return { success: true, symbol: holding.symbol };
        } catch (error) {
          // Silently handle expected missing symbols
          console.debug(`⏭️  Skipping ${holding.symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return { success: false, symbol: holding.symbol, error };
        }
      });
      
      const results = await Promise.all(holdingPromises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`📊 Added ${successful} holdings${failed > 0 ? ` (${failed} skipped due to missing data)` : ''}`);
      
    } else {
      // Use scenario-specific holdings with proper async handling
      const holdingPromises = selectedScenario.holdings.map(async (holdingTemplate) => {
        const marketData = mockMarketData[holdingTemplate.symbol];
        const currentPrice = marketData?.price || holdingTemplate.avgCost * 1.1;
        
        try {
          await store.addHolding({
            ...holdingTemplate,
            currentPrice,
            dayChange: marketData?.change || 0,
            dayChangePercent: marketData?.changePercent || 0,
          });
          return { success: true, symbol: holdingTemplate.symbol };
        } catch (error) {
          console.debug(`⏭️  Skipping ${holdingTemplate.symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return { success: false, symbol: holdingTemplate.symbol, error };
        }
      });
      
      const results = await Promise.all(holdingPromises);
      const successful = results.filter(r => r.success).length;
      console.log(`📊 Added ${successful} holdings from ${scenario} scenario`);
    }
    
    // Add investment goals with error handling
    let goalsAdded = 0;
    mockInvestmentGoals.forEach((goal) => {
      try {
        const { id, createdAt, ...goalData } = goal;
        store.addGoal(goalData);
        goalsAdded++;
      } catch (error) {
        console.debug(`Failed to add goal ${goal.name}:`, error);
      }
    });
    
    if (goalsAdded > 0) {
      console.log(`🎯 Added ${goalsAdded} investment goals`);
    }
    
    // Calculate all metrics
    store.calculatePortfolio();
    store.calculatePerformanceMetrics();
    
    // Final summary
    const finalState = useInvestmentStore.getState();
    console.log(`✅ Investment store initialized successfully!`);
    console.log(`📈 Portfolio Summary: ${finalState.holdings.length} holdings, Total Value: $${finalState.portfolio?.totalValue?.toLocaleString() || '0'}`);
    
  } catch (error) {
    console.error('❌ Failed to initialize investment store:', error);
    throw error;
  }
};

// Simulate market updates for testing
export const simulateMarketUpdate = async () => {
  const store = useInvestmentStore.getState();
  const { holdings } = store;
  
  if (holdings.length === 0) {
    console.log('📭 No holdings to update');
    return;
  }
  
  console.log(`🔄 Simulating market update for ${holdings.length} holdings...`);
  
  try {
    // Refresh all holdings with simulated market data
    await store.refreshAllData();
    console.log('✅ Market data updated for all holdings');
    
    // Log summary of changes
    const updatedState = useInvestmentStore.getState();
    console.log(`📊 Updated Portfolio Value: $${updatedState.portfolio?.totalValue?.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Failed to simulate market update:', error);
  }
};

// Add a single test holding with better error handling
export const addTestHolding = async (symbol: string = 'AAPL') => {
  const store = useInvestmentStore.getState();
  
  // Check if holding already exists
  const existingHolding = store.holdings.find(h => h.symbol === symbol);
  if (existingHolding) {
    console.log(`⚠️  Holding ${symbol} already exists, skipping...`);
    return;
  }
  
  const marketData = mockMarketData[symbol];
  
  const testHolding = {
    symbol,
    name: getCompanyName(symbol),
    shares: 10,
    avgCost: marketData?.price ? marketData.price * 0.9 : 150, // Simulate a gain
    currentPrice: marketData?.price || 165,
    sector: getSector(symbol),
    assetClass: getAssetClass(symbol),
    dayChange: marketData?.change || 2.5,
    dayChangePercent: marketData?.changePercent || 1.5,
  };
  
  try {
    await store.addHolding(testHolding);
    console.log(`✅ Added test holding: ${symbol} (${testHolding.name})`);
  } catch (error) {
    console.error(`❌ Failed to add test holding ${symbol}:`, error);
    throw error;
  }
};

// Add a test investment goal with validation
export const addTestGoal = () => {
  const store = useInvestmentStore.getState();
  
  // Check if goal already exists
  const existingGoal = store.goals.find(g => g.name === 'Emergency Fund');
  if (existingGoal) {
    console.log(`⚠️  Goal 'Emergency Fund' already exists, skipping...`);
    return;
  }
  
  const testGoal = {
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 15000,
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 years from now
    category: 'emergency' as const,
    status: 'on-track' as const,
  };
  
  try {
    store.addGoal(testGoal);
    console.log(`✅ Added test investment goal: ${testGoal.name}`);
  } catch (error) {
    console.error('❌ Failed to add test goal:', error);
    throw error;
  }
};

// Debug utilities with better formatting
export const logPortfolioState = () => {
  const store = useInvestmentStore.getState();
  
  console.log('\n📊 === PORTFOLIO STATE ===');
  console.log(`Holdings: ${store.holdings.length}`);
  console.log(`Total Value: $${store.portfolio?.totalValue?.toLocaleString() || '0'}`);
  console.log(`Goals: ${store.goals.length}`);
  console.log(`Last Refresh: ${store.lastRefresh ? new Date(store.lastRefresh).toLocaleTimeString() : 'Never'}`);
  console.log(`Market Provider: ${store.marketDataSettings.provider}`);
  console.log('=========================\n');
  
  // Show individual holdings summary
  if (store.holdings.length > 0) {
    console.log('📈 Holdings Summary:');
    store.holdings.forEach((holding, index) => {
      const returnColor = holding.totalReturn >= 0 ? '🟢' : '🔴';
      console.log(`  ${index + 1}. ${holding.symbol} - ${holding.shares} shares - $${holding.marketValue.toLocaleString()} ${returnColor}`);
    });
    console.log('');
  }
};

// Portfolio health check with detailed reporting
export const validatePortfolioData = () => {
  const store = useInvestmentStore.getState();
  const { holdings, portfolio } = store;
  
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Check holdings
  holdings.forEach((holding, index) => {
    if (holding.shares <= 0) {
      issues.push(`Holding ${index + 1} (${holding.symbol}): Invalid shares (${holding.shares})`);
    }
    if (holding.currentPrice <= 0) {
      issues.push(`Holding ${index + 1} (${holding.symbol}): Invalid price ($${holding.currentPrice})`);
    }
    if (Math.abs(holding.marketValue - (holding.shares * holding.currentPrice)) > 0.01) {
      issues.push(`Holding ${index + 1} (${holding.symbol}): Market value calculation error`);
    }
    
    // Warnings for unusual values
    if (holding.avgCost <= 0) {
      warnings.push(`Holding ${index + 1} (${holding.symbol}): Unusual average cost ($${holding.avgCost})`);
    }
    if (Math.abs(holding.dayChangePercent) > 20) {
      warnings.push(`Holding ${index + 1} (${holding.symbol}): Unusual daily change (${holding.dayChangePercent.toFixed(2)}%)`);
    }
  });
  
  // Check portfolio calculations
  if (portfolio && holdings.length > 0) {
    const calculatedValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
    if (Math.abs(portfolio.totalValue - calculatedValue) > 0.01) {
      issues.push(`Portfolio total value mismatch: $${portfolio.totalValue.toLocaleString()} vs calculated $${calculatedValue.toLocaleString()}`);
    }
    
    const allocationTotal = Object.values(portfolio.assetAllocation).reduce((sum, val) => sum + val, 0);
    if (Math.abs(allocationTotal - 100) > 0.1) {
      issues.push(`Asset allocation total: ${allocationTotal.toFixed(2)}% (should be 100%)`);
    }
  }
  
  // Report results
  console.log('\n🔍 === PORTFOLIO VALIDATION ===');
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ Portfolio data validation passed - no issues found!');
  } else {
    if (issues.length > 0) {
      console.log('❌ Critical Issues Found:');
      issues.forEach(issue => console.log(`  🚨 ${issue}`));
    }
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
  }
  console.log('===============================\n');
  
  return { issues, warnings };
};

// Helper functions with expanded coverage
function getCompanyName(symbol: string): string {
  const companyNames: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla, Inc.',
    'META': 'Meta Platforms, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'SPY': 'SPDR S&P 500 ETF Trust',
    'QQQ': 'Invesco QQQ Trust',
    'VTI': 'Vanguard Total Stock Market ETF',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'AMD': 'Advanced Micro Devices Inc.',
    'BND': 'Vanguard Total Bond Market ETF',
  };
  return companyNames[symbol] || `${symbol} Corporation`;
}

function getSector(symbol: string): string {
  const sectors: Record<string, string> = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Communication Services',
    'AMZN': 'Consumer Discretionary',
    'TSLA': 'Consumer Discretionary',
    'META': 'Communication Services',
    'NVDA': 'Technology',
    'SPY': 'Diversified',
    'QQQ': 'Diversified',
    'VTI': 'Diversified',
    'BTC': 'Cryptocurrency',
    'ETH': 'Cryptocurrency',
    'BNB': 'Cryptocurrency',
    'AMD': 'Technology',
    'BND': 'Fixed Income',
  };
  return sectors[symbol] || 'Technology';
}

function getAssetClass(symbol: string): 'stock' | 'etf' | 'bond' | 'crypto' | 'reit' {
  const etfs = ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'VEA', 'VWO'];
  const cryptos = ['BTC', 'ETH', 'BNB', 'ADA', 'DOT', 'SOL'];
  const bonds = ['BND', 'AGG', 'TLT', 'IEF'];
  
  if (etfs.includes(symbol)) return 'etf';
  if (cryptos.includes(symbol)) return 'crypto';
  if (bonds.includes(symbol)) return 'bond';
  return 'stock';
}

// Enhanced refresh with progress reporting
export const refreshAllMarketData = async () => {
  const store = useInvestmentStore.getState();
  const { holdings } = store;
  
  if (holdings.length === 0) {
    console.log('📭 No holdings to refresh');
    return;
  }
  
  console.log(`🔄 Refreshing market data for ${holdings.length} holdings...`);
  
  try {
    await store.refreshAllData();
    const updatedState = useInvestmentStore.getState();
    console.log('✅ All market data refreshed successfully');
    console.log(`📊 Portfolio Value: $${updatedState.portfolio?.totalValue?.toLocaleString()}`);
  } catch (error) {
    console.error('❌ Failed to refresh market data:', error);
    throw error;
  }
};

// Test market data connection with detailed reporting
export const testMarketConnection = async () => {
  const store = useInvestmentStore.getState();
  
  console.log('🔌 Testing market data connection...');
  
  try {
    const symbols = await store.searchSymbols('AAPL');
    const isConnected = symbols.length > 0;
    
    console.log(`${isConnected ? '✅' : '❌'} Market data connection test: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
    if (isConnected) {
      console.log(`📡 Found ${symbols.length} symbols for "AAPL" search`);
    }
    
    return isConnected;
  } catch (error) {
    console.error('❌ Market data connection test failed:', error);
    return false;
  }
};

// Export utilities for easy access
export const investmentDevUtils = {
  initialize: initializeInvestmentStore,
  simulateUpdate: simulateMarketUpdate,
  addTestHolding,
  addTestGoal,
  logState: logPortfolioState,
  validate: validatePortfolioData,
  refreshData: refreshAllMarketData,
  testConnection: testMarketConnection,
  
  // Quick access to mock data
  data: mockInvestmentData,
  
  // Scenario helpers
  loadScenario: (scenario: 'beginner' | 'intermediate' | 'advanced') => {
    return initializeInvestmentStore(scenario);
  },
  
  // Additional utilities
  clearAll: () => {
    const store = useInvestmentStore.getState();
    store.resetData();
    console.log('🧹 All investment data cleared');
  },
  
  // Add multiple test holdings with progress
  addMultipleHoldings: async () => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'SPY'];
    console.log(`➕ Adding ${symbols.length} test holdings...`);
    
    for (const [index, symbol] of symbols.entries()) {
      try {
        await addTestHolding(symbol);
        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to add ${symbol}:`, error);
      }
    }
    
    console.log('✅ Finished adding test holdings');
  },
  
  // Quick portfolio summary
  quickSummary: () => {
    const store = useInvestmentStore.getState();
    const { holdings, portfolio, goals } = store;
    
    console.log(`📋 Quick Summary: ${holdings.length} holdings | $${portfolio?.totalValue?.toLocaleString() || '0'} value | ${goals.length} goals`);
  }
};