import React from "react";
import KpiCard from "../Dashboard/KpiCard";
import RevenueChart from "../Dashboard/RevenueChart";
import SystemLogs from "../Dashboard/SystemLogs";
import NewStoreRegistrations from "../Dashboard/NewStoreRegistrations";
import { useAdminDashboardQuery } from "../../../hooks/useAdminQuery";
import { formatVnd } from "../../../utils/currency";

const StoreDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (isError || !data) return <div className="p-8 text-center text-rose-500">Error loading dashboard</div>;

  const exportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total GMV", formatVnd(data.totalGMV || 0)],
      ["Active Sellers", data.activeSeller || 0],
      ["New Users", data.newCustomer || 0],
      ["New Applications", data.newApplication || 0],
    ];
    const csv = "data:text/csv;charset=utf-8,\uFEFF" + rows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `platform_overview_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="space-y-6 pb-10 font-sans">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Platform Overview</h1>
            <p className="mt-1 text-xs text-gray-500">{new Date().toLocaleDateString("en-US", { dateStyle: "full" })}</p>
          </div>
          <button type="button" onClick={exportReport} className="rounded-lg bg-[#0f172a] px-4 py-2.5 text-xs font-semibold text-white hover:bg-black">Export Report</button>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="TOTAL GMV" value={formatVnd(data.totalGMV || 0)} accent="bg-gray-900 w-1/3" />
          <KpiCard title="ACTIVE SELLERS" value={Number(data.activeSeller || 0).toLocaleString()} accent="bg-slate-600 w-1/3" />
          <KpiCard title="NEW USERS" value={Number(data.newCustomer || 0).toLocaleString()} accent="bg-gray-900 w-1/3" />
          <KpiCard title="NEW APPLICATIONS" value={data.newApplication ?? 0} statusDot={data.newApplication > 0 ? "bg-amber-500 animate-pulse" : "bg-gray-400"} meta={data.newApplication > 0 ? `${data.newApplication} đơn chờ duyệt` : "Không có đơn chờ duyệt"} accent="bg-amber-500 w-1/3" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8"><RevenueChart revenueChartData={data.revenueChart} /></div>
          <div className="lg:col-span-4"><SystemLogs logs={data.systemLogs || []} /></div>
        </div>
        <NewStoreRegistrations items={data.newStores || []} />
      </div>
    </div>
  );
};

export default StoreDashboard;
