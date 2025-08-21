import DashboardLayout from '@/components/layout/DashboardLayout';

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all your financial transactions.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction History</h2>
          <p className="text-gray-600">Coming soon - Detailed transaction management and categorization.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}