// src/app/budgets/page.tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function BudgetsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">Manage your spending budgets and track progress.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Budget Management</h2>
          <p className="text-gray-600">Coming soon - Create and track your spending budgets by category.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}