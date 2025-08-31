// src/components/setup/MarketDataSetupGuide.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Key,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Globe,
  Zap,
  Shield,
  Clock,
  DollarSign,
  AlertCircle,
  Activity
} from 'lucide-react';
import { PROVIDER_CONFIG } from '@/config/marketData';

interface MarketDataSetupGuideProps {
  onClose: () => void;
  onProviderSelect: (provider: string, apiKey: string) => void;
}

const steps = [
  {
    id: 'choose',
    title: 'Choose a Data Provider',
    description: 'Select the market data service that best fits your needs',
    icon: Globe
  },
  {
    id: 'signup',
    title: 'Create Free Account',
    description: 'Sign up for a free account to get your API key',
    icon: Key
  },
  {
    id: 'configure',
    title: 'Configure WealthFlow',
    description: 'Add your API key to enable live market data',
    icon: Zap
  },
  {
    id: 'enjoy',
    title: 'Start Tracking',
    description: 'Your portfolio will update with real-time market data',
    icon: Rocket
  }
];

export default function MarketDataSetupGuide({ onClose, onProviderSelect }: MarketDataSetupGuideProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setCurrentStep(1);
  };

  const handleComplete = () => {
    if (selectedProvider && apiKey) {
      onProviderSelect(selectedProvider, apiKey);
      onClose();
    }
  };

  const selectedConfig = selectedProvider ? PROVIDER_CONFIG[selectedProvider] : null;

  return (
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
        className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Rocket className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Set Up Live Market Data
                </h2>
                <p className="text-gray-600 mt-1">
                  Transform your portfolio tracking with real-time market data
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isComplete 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Step 0: Choose Provider */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose Your Market Data Provider
                </h3>
                <p className="text-gray-600">
                  All providers offer free tiers to get you started
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(PROVIDER_CONFIG).map(([key, config]) => {
                  if (key === 'mock') return null;
                  
                  return (
                    <motion.button
                      key={key}
                      onClick={() => handleProviderSelect(key)}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {config.name}
                        </h4>
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          FREE TIER
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {config.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {config.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {config.rateLimit.free} req/min
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Free
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Your API keys are stored securely in your browser and never sent to our servers
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 1: Sign Up Instructions */}
          {currentStep === 1 && selectedConfig && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Create Your {selectedConfig.name} Account
                </h3>
                <p className="text-gray-600">
                  Sign up for a free account to get your API key
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">
                      {selectedConfig.name}
                    </h4>
                    <p className="text-blue-800 mb-4">
                      {selectedConfig.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-blue-900">What you get for free:</p>
                      {selectedConfig.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-2 text-blue-600" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {selectedConfig.website && (
                      <a
                        href={selectedConfig.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sign Up Free <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Quick Setup Tips:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Look for "API Key" or "Token" in your account dashboard</li>
                      <li>Some providers call it an "API Token" or "Access Token"</li>
                      <li>Copy the full key including any prefixes (like "pk_" or "token_")</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I have my API Key
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure API Key */}
          {currentStep === 2 && selectedConfig && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Configure Your API Key
                </h3>
                <p className="text-gray-600">
                  Paste your {selectedConfig.name} API key below
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Key className="w-4 h-4 inline mr-2" />
                    {selectedConfig.name} API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your API key here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Your data is secure:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>API key is stored only in your browser</li>
                        <li>Never transmitted to our servers</li>
                        <li>Used only to fetch market data directly from {selectedConfig.name}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!apiKey.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Test Connection
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Complete Setup */}
          {currentStep === 3 && selectedConfig && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You're All Set!
                </h3>
                <p className="text-gray-600">
                  Your WealthFlow portfolio will now update with live market data from {selectedConfig.name}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  What happens next:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center">
                    <Zap className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Real-time Updates</p>
                    <p className="text-gray-600">Live price updates for all your holdings</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Globe className="w-6 h-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900">Market Data</p>
                    <p className="text-gray-600">Company info, volume, and more</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Activity className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900">Smart Search</p>
                    <p className="text-gray-600">Find stocks and ETFs instantly</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Complete Setup
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}