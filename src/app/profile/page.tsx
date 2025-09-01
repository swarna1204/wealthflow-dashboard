'use client';

import React, { useState } from 'react';
import { User, TrendingUp, DollarSign, Clock, Settings, Bell, Shield, CreditCard, ArrowRight, Target, Wallet, PieChart, BarChart3, RefreshCw } from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock user data that fits your personal finance app
  const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "March 2024",
    membershipType: "Premium Member"
  };

  // Financial overview stats with proper currency formatting
  const financialStats = [
    {
      label: "Monthly Income",
      value: 4800,
      change: 200,
      changeText: "from last month",
      positive: true,
      icon: DollarSign,
      loading: isLoading
    },
    {
      label: "Total Savings",
      value: 12450,
      change: 850,
      changeText: "this month",
      positive: true,
      icon: Wallet,
      loading: isLoading
    },
    {
      label: "Active Goals",
      value: 3,
      change: null,
      changeText: "MacBook Pro in progress",
      icon: Target,
      loading: isLoading
    }
  ];

  // Recent activity with timestamps and proper formatting
  const recentActivity = [
    {
      id: 1,
      type: "income",
      description: "Salary deposit",
      amount: 4800,
      category: "Income",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      positive: true
    },
    {
      id: 2,
      type: "expense",
      description: "Grocery Store - Weekly Shopping",
      amount: 85.50,
      category: "Food & Dining",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      positive: false
    },
    {
      id: 3,
      type: "goal",
      description: "Added to MacBook Pro fund",
      amount: 300,
      category: "Goals",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      positive: true
    },
    {
      id: 4,
      type: "expense",
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      positive: false
    }
  ];

  const accountSettings = [
    { 
      icon: User, 
      label: "Personal Information", 
      description: "Update your profile and preferences"
    },
    { 
      icon: Shield, 
      label: "Security & Privacy", 
      description: "Password, 2FA, and data settings"
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      description: "Budget alerts and reminders"
    },
    { 
      icon: CreditCard, 
      label: "Connected Accounts", 
      description: "Link your bank accounts and cards"
    }
  ];

  const quickActions = [
    { 
      label: "Add Transaction", 
      desc: "Record income or expense",
      icon: DollarSign,
      color: "indigo"
    },
    { 
      label: "Create Budget", 
      desc: "Set spending limits",
      icon: PieChart,
      color: "green"
    },
    { 
      label: "New Goal", 
      desc: "Save for something special",
      icon: Target,
      color: "blue"
    },
    { 
      label: "View Analytics", 
      desc: "Track your progress",
      icon: BarChart3,
      color: "purple"
    }
  ];

  // Simulate data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'income': return '💰';
      case 'expense': return '💸';
      case 'goal': return '🎯';
      case 'budget': return '📊';
      default: return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-100 text-green-600';
      case 'expense': return 'bg-red-100 text-red-600';
      case 'goal': return 'bg-blue-100 text-blue-600';
      case 'budget': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Refresh Button */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">{userProfile.email}</p>
                <p className="text-sm text-gray-500">{userProfile.membershipType} • Member since {userProfile.joinDate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Financial Overview with Loading States */}
        <div className="grid md:grid-cols-3 gap-6">
          {financialStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50">
                    {stat.loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  {stat.positive && !stat.loading && (
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                      ↗️
                    </span>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.loading ? '---' : (
                    typeof stat.value === 'number' && stat.label.includes('Income' || 'Savings') 
                      ? formatCurrency(stat.value)
                      : stat.value.toString()
                  )}
                </p>
                
                {!stat.loading && (
                  <p className="text-sm text-gray-500">
                    {stat.change && `+${formatCurrency(stat.change)} `}{stat.changeText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity with Formatted Times and Currency */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {activity.category} • {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      activity.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.positive ? '+' : '-'}{formatCurrency(activity.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>
            
            <div className="space-y-3">
              {accountSettings.map((setting, index) => {
                const IconComponent = setting.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-lg mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-700 mb-1">
                    {action.label}
                  </p>
                  <p className="text-sm text-gray-500 group-hover:text-blue-600">
                    {action.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Goals Progress with Formatted Currency */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Goals</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">MacBook Pro</h3>
                <span className="text-sm text-gray-600">
                  {formatCurrency(1850)} / {formatCurrency(2500)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '74%' }}></div>
              </div>
              <p className="text-sm text-gray-500">
                74% complete • {formatCurrency(650)} remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;