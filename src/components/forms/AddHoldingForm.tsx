// src/components/forms/AddHoldingForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Hash,
  Building,
  Tag,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Info,
  Loader2,
  TrendingDown,
  Activity
} from 'lucide-react';
import useInvestmentStore from '@/store/useInvestmentStore';
import { type SymbolSearchResult, type CompanyInfo } from '@/lib/services/marketDataService';

interface HoldingFormData {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector: string;
  assetClass: 'stock' | 'etf' | 'bond' | 'crypto' | 'reit';
  purchaseDate: string;
}

interface AddHoldingFormProps {
  onClose: () => void;
  editingHolding?: {
    id: string;
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
    sector: string;
    assetClass: 'stock' | 'etf' | 'bond' | 'crypto' | 'reit';
  };
}

// Predefined sectors and asset classes
const sectors = [
  'Technology',
  'Healthcare',
  'Financial Services', 
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Consumer Staples',
  'Energy',
  'Utilities',
  'Real Estate',
  'Materials',
  'Diversified'
];

const assetClasses: Array<'stock' | 'etf' | 'bond' | 'crypto' | 'reit'> = ['stock', 'etf', 'bond', 'crypto', 'reit'];

export default function AddHoldingForm({ onClose, editingHolding }: AddHoldingFormProps) {
  const { addHolding, updateHolding, searchSymbols, getCompanyInfo } = useInvestmentStore();
  
  // Form state
  const [formData, setFormData] = useState<HoldingFormData>({
    symbol: editingHolding?.symbol || '',
    name: editingHolding?.name || '',
    shares: editingHolding?.shares || 0,
    avgCost: editingHolding?.avgCost || 0,
    currentPrice: editingHolding?.currentPrice || 0,
    sector: editingHolding?.sector || '',
    assetClass: editingHolding?.assetClass || 'stock',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  
  // UI State
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [symbolSuggestions, setSymbolSuggestions] = useState<SymbolSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof HoldingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [lastQuoteTime, setLastQuoteTime] = useState<string>('');

  // Calculate market value and returns
  const marketValue = formData.shares * formData.currentPrice;
  const totalCost = formData.shares * formData.avgCost;
  const totalReturn = marketValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  // Update form field
  const updateField = <K extends keyof HoldingFormData>(field: K, value: HoldingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HoldingFormData, string>> = {};
    
    if (!formData.symbol) newErrors.symbol = 'Symbol is required';
    if (!formData.name) newErrors.name = 'Company name is required';
    if (formData.shares <= 0) newErrors.shares = 'Shares must be positive';
    if (formData.avgCost <= 0) newErrors.avgCost = 'Average cost must be positive';
    if (formData.currentPrice <= 0) newErrors.currentPrice = 'Current price must be positive';
    if (!formData.sector) newErrors.sector = 'Sector is required';
    if (!formData.assetClass) newErrors.assetClass = 'Asset class is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Symbol search with debouncing
  useEffect(() => {
    const searchForSymbols = async () => {
      if (formData.symbol && formData.symbol.length > 1) {
        setIsLoadingSearch(true);
        try {
          const results = await searchSymbols(formData.symbol);
          setSymbolSuggestions(results.slice(0, 8));
        } catch (error) {
          console.error('Search failed:', error);
          setSymbolSuggestions([]);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSymbolSuggestions([]);
      }
    };

    const timeoutId = setTimeout(searchForSymbols, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.symbol, searchSymbols]);

  // Fetch quote and company info when symbol changes
  const fetchCompanyData = async (symbol: string) => {
    if (!symbol || symbol.length < 2) return;
    
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      // Get company info
      const companyInfo = await getCompanyInfo(symbol);
      
      if (companyInfo) {
        setFormData(prev => ({
          ...prev,
          name: companyInfo.name,
          sector: companyInfo.sector,
          assetClass: symbol.match(/^[A-Z]{3,4}$/) ? 'etf' : 'stock', // Simple heuristic
        }));
        setCompanyData(companyInfo);
      }

      setLastQuoteTime(new Date().toLocaleTimeString());
      setShowSuggestions(false);
      
    } catch (error) {
      console.error('Company data fetch failed:', error);
      setQuoteError(error instanceof Error ? error.message : 'Failed to fetch company data');
      setCompanyData(null);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Manual refresh company data
  const refreshCompanyData = () => {
    if (formData.symbol) {
      fetchCompanyData(formData.symbol);
    }
  };

  // Auto-fetch company data when symbol is selected
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.symbol && formData.symbol.length >= 2) {
        fetchCompanyData(formData.symbol);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData.symbol]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const holdingData = {
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        shares: formData.shares,
        avgCost: formData.avgCost,
        currentPrice: formData.currentPrice,
        sector: formData.sector,
        assetClass: formData.assetClass,
        dayChange: 0,
        dayChangePercent: 0,
      };

      if (editingHolding) {
        await updateHolding(editingHolding.id, holdingData);
      } else {
        await addHolding(holdingData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save holding:', error);
      setErrors({ symbol: 'Failed to save holding. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSuggestion = (suggestion: SymbolSearchResult) => {
    updateField('symbol', suggestion.symbol);
    setShowSuggestions(false);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingHolding ? 'Edit Holding' : 'Add New Holding'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingHolding ? 'Update your investment details' : 'Add a new investment with live market data'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {/* Symbol Input with Live Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Stock Symbol
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL, MSFT, GOOGL"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {isLoadingQuote && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {isLoadingSearch && (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                  {formData.symbol && !isLoadingQuote && (
                    <button
                      type="button"
                      onClick={refreshCompanyData}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Symbol Suggestions */}
              {showSuggestions && symbolSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {symbolSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.symbol}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.symbol}</div>
                          <div className="text-sm text-gray-600 truncate">{suggestion.name}</div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {suggestion.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {errors.symbol && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.symbol}
                </p>
              )}
              
              {quoteError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {quoteError}
                </p>
              )}

              {/* Company Data Status */}
              {companyData && lastQuoteTime && (
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Activity className="w-3 h-3 mr-1" />
                  Company data fetched at {lastQuoteTime}
                </div>
              )}
            </div>

            {/* Company Information Display */}
            {companyData && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Company Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600 font-medium">Company</p>
                    <p className="text-blue-900">{companyData.name}</p>
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Sector</p>
                    <p className="text-blue-900">{companyData.sector}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-700 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Live market data will be fetched when you save this holding
                </div>
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Company Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Company name will auto-populate"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Shares and Prices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shares */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Shares
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.shares || ''}
                  onChange={(e) => updateField('shares', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.shares && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.shares}
                  </p>
                )}
              </div>

              {/* Average Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Average Cost per Share
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.avgCost || ''}
                  onChange={(e) => updateField('avgCost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.avgCost && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.avgCost}
                  </p>
                )}
              </div>

              {/* Current Price Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Current Price (Preview)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentPrice || ''}
                    onChange={(e) => updateField('currentPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Will be fetched live"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-xs text-gray-500">Live on save</div>
                  </div>
                </div>
                {errors.currentPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.currentPrice}
                  </p>
                )}
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => updateField('purchaseDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.purchaseDate}
                  </p>
                )}
              </div>
            </div>

            {/* Sector and Asset Class Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Sector
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => updateField('sector', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select sector</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sector}
                  </p>
                )}
              </div>

              {/* Asset Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Class
                </label>
                <select
                  value={formData.assetClass}
                  onChange={(e) => updateField('assetClass', e.target.value as HoldingFormData['assetClass'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select asset class</option>
                  {assetClasses.map((assetClass) => (
                    <option key={assetClass} value={assetClass}>
                      {assetClass.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.assetClass && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.assetClass}
                  </p>
                )}
              </div>
            </div>

            {/* Investment Summary Preview */}
            {formData.shares && formData.avgCost && formData.currentPrice && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Investment Preview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Market Value</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(marketValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Cost</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(totalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Return</p>
                    <p className={`font-semibold flex items-center justify-center ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalReturn >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {formatCurrency(totalReturn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Return %</p>
                    <p className={`font-semibold ${totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 text-center">
                  <Info className="w-3 h-3 inline mr-1" />
                  Final values will be calculated with live market data
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingQuote}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{editingHolding ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{editingHolding ? 'Update Holding' : 'Add Holding'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}