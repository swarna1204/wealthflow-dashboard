// src/components/settings/MarketDataSettings.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Zap,
  Clock,
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  RefreshCw,
  Globe,
  Shield
} from 'lucide-react';
import useInvestmentStore, { useMarketDataSettings } from '@/store/useInvestmentStore';
import { PROVIDER_CONFIG, RATE_LIMITS } from '@/config/marketData';

interface MarketDataSettingsProps {
  onClose?: () => void;
}

export default function MarketDataSettings({ onClose }: MarketDataSettingsProps) {
  const { updateMarketDataSettings, refreshAllData, isUpdatingPrices } = useInvestmentStore();
  const marketDataSettings = useMarketDataSettings();
  const [tempSettings, setTempSettings] = useState(marketDataSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateMarketDataSettings(tempSettings);
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    await refreshAllData();
  };

  const handleProviderChange = (provider: any) => {
    setTempSettings(prev => ({ ...prev, provider }));
    setShowApiKeyInput(provider !== 'mock');
  };

  const providerInfo = PROVIDER_CONFIG[tempSettings.provider];
  const rateLimit = RATE_LIMITS[tempSettings.provider];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Market Data Settings</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Configure your market data provider and real-time updates
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Globe className="w-4 h-4 inline mr-2" />
            Data Provider
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                  tempSettings.provider === key
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProviderChange(key)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{config.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{config.description}</p>
                    <div className="mt-2 space-y-1">
                      {config.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  {tempSettings.provider === key && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                {config.website && (
                  <a
                    href={config.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        {(showApiKeyInput || tempSettings.provider !== 'mock') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4 inline mr-2" />
              API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={tempSettings.apiKey || ''}
                onChange={(e) => setTempSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your API key is stored securely in your browser and never sent to our servers
            </p>
          </div>
        )}

        {/* Provider Information */}
        {providerInfo && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  About {providerInfo.name}
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {providerInfo.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {rateLimit && (
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Rate limit: {rateLimit.free} requests/minute (free tier)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Zap className="w-4 h-4 inline mr-2" />
            Real-time Updates
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Enable automatic updates</p>
                <p className="text-xs text-gray-500">
                  Automatically refresh portfolio data at regular intervals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSettings.enableRealTimeUpdates}
                  onChange={(e) => setTempSettings(prev => ({ 
                    ...prev, 
                    enableRealTimeUpdates: e.target.checked 
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {tempSettings.enableRealTimeUpdates && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Update Interval (minutes)
                </label>
                <select
                  value={tempSettings.autoRefreshInterval}
                  onChange={(e) => setTempSettings(prev => ({ 
                    ...prev, 
                    autoRefreshInterval: parseInt(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value={1}>1 minute (High frequency)</option>
                  <option value={5}>5 minutes (Recommended)</option>
                  <option value={15}>15 minutes (Moderate)</option>
                  <option value={30}>30 minutes (Low frequency)</option>
                  <option value={60}>1 hour</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Consider your API rate limits when setting update frequency
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-600" />
            Current Status
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Provider</p>
              <p className="font-medium text-gray-900">
                {PROVIDER_CONFIG[marketDataSettings.provider]?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Auto Updates</p>
              <p className="font-medium text-gray-900">
                {marketDataSettings.enableRealTimeUpdates ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Update Interval</p>
              <p className="font-medium text-gray-900">
                {marketDataSettings.autoRefreshInterval} minutes
              </p>
            </div>
            <div>
              <p className="text-gray-600">API Key</p>
              <p className="font-medium text-gray-900">
                {marketDataSettings.apiKey ? 'Configured' : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleTestConnection}
            disabled={isUpdatingPrices}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpdatingPrices ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}