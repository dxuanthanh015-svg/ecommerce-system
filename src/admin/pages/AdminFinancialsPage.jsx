import React from "react";
import OverviewCards from "../components/FinancialManagement/OverviewCards";
import RevenueChart from "../components/FinancialManagement/RevenueChart";
import PayoutHealth from "../components/FinancialManagement/PayoutHealth";
import PayoutTable from "../components/FinancialManagement/PayoutTable";
import { FINANCIAL_OVERVIEW } from "../components/FinancialManagement/financialManagement.data";

const AdminFinancialsPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Financial Overview</h1>
          <p className="text-sm text-gray-500">Manage platform revenue, seller payouts, and transaction health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border rounded shadow-sm">Export Report</button>
          <button className="px-4 py-2 bg-black text-white rounded">+ Manual Payout</button>
        </div>
      </div>

      <OverviewCards overview={FINANCIAL_OVERVIEW} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <RevenueChart data={FINANCIAL_OVERVIEW.chartData} />
        </div>
        <div className="col-span-4">
          <PayoutHealth items={FINANCIAL_OVERVIEW.payoutHealth} />
        </div>
      </div>

      <div className="mt-6">
        <PayoutTable payouts={FINANCIAL_OVERVIEW.payouts} />
      </div>
    </div>
  );
};

export default AdminFinancialsPage;
