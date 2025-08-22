// src/app/transactions/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Trash2,
  MoreHorizontal,
  Calendar,
  Tag
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionForm from '@/components/forms/TransactionForm';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Transaction } from '@/lib/types';
import { transactionCategories } from '@/data/categories';

type SortField = 'date' | 'amount' | 'category' | 'description';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactionStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Type filter
        const matchesType = filterType === 'all' || transaction.type === filterType;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = Math.abs(a.amount) - Math.abs(b.amount);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'description':
            comparison = a.description.localeCompare(b.description);
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [transactions, searchTerm, filterType, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = transactionCategories.find(cat => cat.name === categoryName);
    return category?.icon || '📝';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = transactionCategories.find(cat => cat.name === categoryName);
    return category?.color || '#8B5CF6';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your financial transactions
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(undefined);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    filterType === type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
            </span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                Income: {formatCurrency(
                  filteredTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
              <span className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                Expenses: {formatCurrency(
                  Math.abs(filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0))
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <button
                  onClick={() => handleSort('description')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Description</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Category</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Amount</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Date</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-700">Type</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-700">Actions</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {paginatedTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Description */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900 truncate">
                        {transaction.description}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                        <span 
                          className="text-sm font-medium truncate"
                          style={{ color: getCategoryColor(transaction.category) }}
                        >
                          {transaction.category}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-1">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {transaction.type}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {paginatedTransactions.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first transaction'
                }
              </p>
              {(!searchTerm && filterType === 'all') && (
                <button
                  onClick={() => {
                    setEditingTransaction(undefined);
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Transaction</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            onClose={() => {
              setShowForm(false);
              setEditingTransaction(undefined);
            }}
            onSuccess={() => {
              // Reset pagination if we're on a page that might not exist after adding
              if (currentPage > 1 && paginatedTransactions.length === 1) {
                setCurrentPage(1);
              }
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}