import React, { useMemo } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCardsRow from "./SummaryCardsRow";
import RevenueChart from "./RevenueChart";
import TransferHistoryTable from "./TransferHistoryTable";
import RankedProductList from "./RankedProductList";
import { createAnalyticsState } from "./analytics.data";

const StoreAnalytics = ({ apiData }) => {
  const data = useMemo(() => createAnalyticsState(apiData), [apiData]);

  const { header, summaryCards, revenueBreakdown, transferHistory, rankedLists } = data;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Page Header */}
      <AnalyticsHeader
        title={header.title}
        description={header.description}
        exportLabel={header.exportLabel}
        onExport={() => console.log("Export report")}
      />

      {/* Summary Metric Cards */}
      <SummaryCardsRow cards={summaryCards} />

      {/* Revenue vs Fees Bar Chart */}
      <RevenueChart
        title={revenueBreakdown.title}
        series={revenueBreakdown.series}
        activeRange={revenueBreakdown.activeRange}
        rangeOptions={revenueBreakdown.rangeOptions}
        onRangeChange={(range) => console.log("Range changed:", range)}
      />

      {/* Transfer History Table */}
      <TransferHistoryTable
        title={transferHistory.title}
        items={transferHistory.items}
        filterLabel={transferHistory.filterLabel}
        onFilter={() => console.log("Filter clicked")}
      />

      {/* Ranked Product Lists — Best Sellers & Most Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rankedLists.map((list) => (
          <RankedProductList
            key={list.id}
            title={list.title}
            metricType={list.metricType}
            items={list.items}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreAnalytics;
