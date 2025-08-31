// src/components/dashboard/MarketDataIndicator.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Zap,
  TrendingUp,
  Globe
} from 'lucide-react';
import useInvestmentStore, { useMarketDataSettings } from '@/store/useInvestmentStore';
import { PROVIDER_CONFIG } from '@/config/marketData';

interface MarketDataIndicatorProps {
  onOpenSettings?: () => void;
  className?: string;
}

export default function MarketDataIndicator({ onOpenSettings, className = '' }: MarketDataIndicatorProps) {
  const {
    refreshAllData,
    isUpdatingPrices,
    lastRefresh,
    error,
    holdings,
    clearError
  } = useInvestmentStore();
  
  const marketDataSettings = useMarketDataSettings();
  const [showDetails, setShowDetails] = useState(false);

  const providerConfig = PROVIDER_CONFIG[marketDataSettings.provider];
  const hasApiKey = marketDataSettings.provider === 'mock' || Boolean(marketDataSettings.apiKey);
  const canRefresh = holdings.length > 0 && hasApiKey;

  // Calculate status
  const getStatus = () => {
    if (error) return 'error';
    if (isUpdatingPrices) return 'updating';
    if (!hasApiKey && marketDataSettings.provider !== 'mock') return 'needs-setup';
    if (marketDataSettings.enableRealTimeUpdates) return 'live';
    return 'ready';
  };

  const status = getStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-50';
      case 'updating': return 'text-blue-600 bg-blue-50';
      case 'ready': return 'text-gray-600 bg-gray-50';
      case 'needs-setup': return 'text-amber-600 bg-amber-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'live':
        return <Wifi className="w-4 h-4" />;
      case 'updating':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <Activity className="w-4 h-4" />;
      case 'needs-setup':
        return <Settings className="w-4 h-4" />;
      case 'error':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live': return 'Live Updates';
      case 'updating': return 'Updating...';
      case 'ready': return 'Ready';
      case 'needs-setup': return 'Setup Required';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleRefresh = async () => {
    if (canRefresh) {
      clearError();
      await refreshAllData();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        <div className="flex items-center space-x-1">
          <Globe className="w-3 h-3 opacity-70" />
          <span className="text-xs opacity-70">{providerConfig?.name || 'Unknown'}</span>
        </div>
      </motion.div>

      {/* Detailed Status Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Market Data Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Provider Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Data Provider</span>
                <span className="text-sm font-medium text-gray-900">
                  {providerConfig?.name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">API Status</span>
                <div className="flex items-center">
                  {hasApiKey ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-700">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-600 mr-1" />
                      <span className="text-xs text-amber-700">No API Key</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Auto Refresh</span>
                <div className="flex items-center">
                  {marketDataSettings.enableRealTimeUpdates ? (
                    <>
                      <Zap className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-700">
                        Every {marketDataSettings.autoRefreshInterval}m
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">Disabled</span>
                  )}
                </div>
              </div>
            </div>

            {/* Last Refresh */}
            {lastRefresh && (
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-gray-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Last Update
                </span>
                <span className="text-gray-900 font-medium">
                  {formatTimeAgo(lastRefresh)}
                </span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-900 mb-1">Connection Error</p>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Holdings Count */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-gray-600">Holdings Tracked</span>
              <span className="text-gray-900 font-medium">{holdings.length}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={!canRefresh || isUpdatingPrices}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdatingPrices ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh Now
                  </>
                )}
              </button>
              
              {onOpenSettings && (
                <button
                  onClick={() => {
                    setShowDetails(false);
                    onOpenSettings();
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </button>
              )}
            </div>

            {/* Quick Setup Link */}
            {!hasApiKey && marketDataSettings.provider !== 'mock' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    if (onOpenSettings) onOpenSettings();
                  }}
                  className="w-full text-xs text-blue-600 hover:text-blue-800 transition-colors text-center"
                >
                  Configure API Key for Live Data →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating refresh button for quick access */}
      {!showDetails && canRefresh && (
        <motion.button
          onClick={handleRefresh}
          disabled={isUpdatingPrices}
          className="absolute -right-2 -top-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RefreshCw className={`w-3 h-3 ${isUpdatingPrices ? 'animate-spin' : ''}`} />
        </motion.button>
      )}
    </div>
  );
}