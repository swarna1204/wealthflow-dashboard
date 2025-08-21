import DashboardLayout from '@/components/layout/DashboardLayout';

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-1">Set and track your financial goals.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Financial Goals</h2>
          <p className="text-gray-600">Coming soon - Create and monitor progress toward your financial targets.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}