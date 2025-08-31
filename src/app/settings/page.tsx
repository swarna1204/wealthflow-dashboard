// src/app/settings/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Globe,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MarketDataSettings from '@/components/settings/MarketDataSettings';

// Settings Sections
const settingSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'market-data', label: 'Market Data', icon: Globe },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'data', label: 'Data Management', icon: Download },
];

// Profile Settings Component
const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    timezone: 'America/New_York',
    language: 'en-US'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Preferences Settings Component
const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',
    theme: 'light',
    defaultView: 'overview',
    compactMode: false,
    showTooltips: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={preferences.currency}
              onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Dashboard View</label>
            <select
              value={preferences.defaultView}
              onChange={(e) => setPreferences(prev => ({ ...prev, defaultView: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="overview">Overview</option>
              <option value="holdings">Holdings</option>
              <option value="performance">Performance</option>
              <option value="goals">Goals</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Compact Mode</h4>
              <p className="text-sm text-gray-500">Use less spacing and smaller elements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.compactMode}
                onChange={(e) => setPreferences(prev => ({ ...prev, compactMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Show Tooltips</h4>
              <p className="text-sm text-gray-500">Display helpful tooltips throughout the app</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.showTooltips}
                onChange={(e) => setPreferences(prev => ({ ...prev, showTooltips: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Settings Component
const NotificationsSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    priceAlerts: true,
    portfolioUpdates: false,
    goalReminders: true,
    marketNews: false,
    weeklyReports: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when stock prices change significantly' },
            { key: 'portfolioUpdates', label: 'Portfolio Updates', desc: 'Daily portfolio performance summaries' },
            { key: 'goalReminders', label: 'Goal Reminders', desc: 'Reminders about your investment goals progress' },
            { key: 'marketNews', label: 'Market News', desc: 'Important market news and updates' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly portfolio performance reports' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">Your Data is Secure</h4>
              <p className="text-sm text-green-700">
                All your financial data is stored locally in your browser. We don't store any personal or financial information on our servers.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">API Keys</h4>
            <p className="text-sm text-gray-600 mb-3">
              Your market data API keys are stored securely in your browser and are never transmitted to our servers.
            </p>
            <div className="text-sm text-gray-500">
              Current provider: Mock Data (No API key required)
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Data Storage</h4>
            <p className="text-sm text-gray-600">
              Your portfolio data is stored locally using your browser's secure storage. This data is not shared with third parties and remains on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Management Component
const DataManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    alert('Portfolio data exported successfully!');
  };

  const handleDeleteAllData = async () => {
    if (showDeleteConfirm) {
      // Actually delete data
      localStorage.clear();
      alert('All data has been deleted. Page will refresh.');
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download your complete portfolio data as a JSON file for backup or transfer purposes.
            </p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export Portfolio Data'}</span>
            </button>
          </div>
          
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="text-sm font-medium text-red-900 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Danger Zone
            </h4>
            <p className="text-sm text-red-700 mb-4">
              This action will permanently delete all your portfolio data, settings, and preferences. This cannot be undone.
            </p>
            <button
              onClick={handleDeleteAllData}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showDeleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {showDeleteConfirm ? 'Click Again to Confirm Delete' : 'Delete All Data'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Settings Page Component
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'market-data':
        return <MarketDataSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'data':
        return <DataManagement />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and application settings</p>
          </div>
        </motion.div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              {renderSettingsContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}