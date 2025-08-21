import DashboardLayout from '@/components/layout/DashboardLayout';

export default function InvestmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600 mt-1">Track your investment portfolio and performance.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Investment Portfolio</h2>
          <p className="text-gray-600">Coming soon - Portfolio tracking and investment analytics.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}