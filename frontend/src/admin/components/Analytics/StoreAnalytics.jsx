import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCardsRow from "./SummaryCardsRow";
import RevenueChart from "./RevenueChart";
import TransferHistoryTable from "./TransferHistoryTable";
import RankedProductList from "./RankedProductList";
import { adminService } from "../../../services/adminService";

const StoreAnalytics = () => {
  const [range, setRange] = useState("Last 6 Months");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "analytics", range],
    queryFn: () => adminService.fetchAdminAnalytics(range),
    staleTime: 60_000,
  });

  if (isLoading) return <div className="p-8 text-slate-500">Đang tải Analytics từ cơ sở dữ liệu...</div>;
  if (isError) return <div className="m-6 rounded-xl border border-rose-200 bg-white p-6 text-rose-700">Không tải được Analytics. <button onClick={() => refetch()} className="underline">Thử lại</button></div>;

  const header = data?.header || {};
  const summaryCards = data?.summaryCards || [];
  const revenueBreakdown = data?.revenueBreakdown || {};
  const transferHistory = data?.transferHistory || {};
  const rankedLists = data?.rankedLists || [];

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <AnalyticsHeader
          title={header.title || "Analytics"}
          description={header.description || ""}
          exportLabel={header.exportLabel || "Export Report"}
          onExport={() => {}}
        />
        <SummaryCardsRow cards={summaryCards} />
        <RevenueChart
          title={revenueBreakdown.title || "Revenue vs Fees Breakdown"}
          series={revenueBreakdown.series || []}
          activeRange={revenueBreakdown.activeRange || range}
          rangeOptions={revenueBreakdown.rangeOptions || []}
          onRangeChange={setRange}
        />
        <TransferHistoryTable
          title={transferHistory.title || "Transfer History"}
          items={transferHistory.items || []}
          filterLabel={transferHistory.filterLabel || ""}
          onFilter={() => {}}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {rankedLists.map((list) => (
            <RankedProductList key={list.id} title={list.title} metricType={list.metricType} items={list.items || []} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
