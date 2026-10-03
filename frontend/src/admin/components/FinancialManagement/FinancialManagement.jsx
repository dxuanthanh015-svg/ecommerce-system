import React from "react";
import OverviewCards from "./OverviewCards";
import RevenueChart from "./RevenueChart";
import PayoutHealth from "./PayoutHealth";
import PayoutTable from "./PayoutTable";
import { FINANCIAL_OVERVIEW } from "./financialManagement.data";

const FinancialManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
          <p className="text-base text-gray-500 mt-1">Manage platform revenue, seller payouts, and transaction health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Manual Payout
          </button>
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

export default FinancialManagement;