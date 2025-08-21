// components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  User,
  LogOut,
  X,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    active: true
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
    active: false
  },
  {
    name: 'Budgets',
    href: '/budgets',
    icon: PiggyBank,
    active: false,
    badge: '3'
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    active: false
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    active: false
  },
  {
    name: 'Investments',
    href: '/investments',
    icon: TrendingUp,
    active: false
  }
];

const bottomItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User
  }
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed for desktop, sliding for mobile */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-xl lg:shadow-none flex-shrink-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">WealthFlow</h1>
              <p className="text-xs text-gray-500">Personal Finance</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
              A
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
              <p className="text-sm text-gray-500">Premium Member</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`font-medium ${item.active ? 'text-blue-700' : ''}`}>
                    {item.name}
                  </span>
                  
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-6 border-t border-gray-100 space-y-2">
            {bottomItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
            
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </nav>

        {/* Bottom Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white">
            <h4 className="font-semibold mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-blue-100 mb-3">
              Get advanced analytics and unlimited budgets
            </p>
            <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}