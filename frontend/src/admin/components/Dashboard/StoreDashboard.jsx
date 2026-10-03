import React from "react";
import KpiCard from "../Dashboard/KpiCard";
import RevenueChart from "../Dashboard/RevenueChart";
import SystemLogs from "../Dashboard/SystemLogs";
import NewStoreRegistrations from "../Dashboard/NewStoreRegistrations";
import { useAdminDashboardQuery } from "../../../hooks/useAdminQuery";

const StoreDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading dashboard...</div>;
  }
  if (isError || !data) {
    return <div className="p-8 text-center text-rose-500 font-medium">Error loading dashboard</div>;
  }

  const onExport = () => {
    if (!data) return;
    const gmv = Number(data.totalGMV || data.totalGVM || 0).toFixed(2);
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total GMV", `$${gmv}`],
      ["Active Sellers", data.activeSeller || 0],
      ["New Customers", data.newCustomer || 0],
      ["New Applications", data.newApplication || 0],
    ];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform_overview_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="space-y-6 font-sans pb-10">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Platform Overview</h1>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={onExport}
              className="bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* TOTAL GMV */}
          <KpiCard
            title="TOTAL GMV"
            value={`$${Number(data.totalGMV || data.totalGVM || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            accent="bg-gray-900 w-1/3"
            icon={
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          {/* ACTIVE SELLERS */}
          <KpiCard
            title="ACTIVE SELLERS"
            value={data.activeSeller !== undefined ? Number(data.activeSeller).toLocaleString() : "0"}
            accent="bg-slate-600 w-1/3"
            icon={
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />

          {/* NEW CUSTOMERS */}
          <KpiCard
            title="NEW CUSTOMERS"
            value={data.newCustomer !== undefined ? Number(data.newCustomer).toLocaleString() : "0"}
            accent="bg-gray-900 w-1/3"
            icon={
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
          />

          {/* NEW APPLICATIONS */}
          <KpiCard
            title="NEW APPLICATIONS"
            value={data.newApplication ?? 0}
            statusDot={data.newApplication > 0 ? "bg-amber-500 animate-pulse" : "bg-gray-400"}
            meta={data.newApplication > 0 ? `${data.newApplication} đơn chờ duyệt` : "Không có đơn chờ duyệt"}
            accent="bg-amber-500 w-1/3"
            icon={
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>

        {/* Charts & Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <RevenueChart revenueChartData={data?.revenueChart} />
          </div>
          <div className="lg:col-span-4">
            <SystemLogs logs={data?.systemLogs || []} />
          </div>
        </div>

        {/* New Store Registrations Table */}
        <NewStoreRegistrations items={data?.newStores || []} />
      </div>
    </div>
  );
};

export default StoreDashboard;
