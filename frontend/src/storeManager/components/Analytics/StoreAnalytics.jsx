import React, { useState, useMemo } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCardsRow from "./SummaryCardsRow";
import RevenueChart from "./RevenueChart";
import TransferHistoryTable from "./TransferHistoryTable";
import RankedProductList from "./RankedProductList";
import { defaultAnalyticsData } from "./analytics.data";
import { exportAnalyticsReportCSV } from "./analytics.utils";
import {
  useStoreAnalytics,
} from "../../../hooks/useProductQuery";

const StoreAnalytics = () => {
  const storeName = "Store";

  const [activeRange, setActiveRange] = useState("Last 6 Months");

  // Sử dụng React Query cache để tải dữ liệu analytics
  const { data: analyticData } = useStoreAnalytics(activeRange);

  const analyticsData = (analyticData && analyticData.header) ? analyticData : defaultAnalyticsData;

  const handleExport = () => {
    exportAnalyticsReportCSV(analyticsData, storeName);
  };

  const handleRangeChange = (range) => {
    setActiveRange(range);
  };

  const bestSellersList = useMemo(
    () => analyticsData?.rankedLists?.find((l) => l.id === "best-sellers") || analyticsData?.rankedLists?.[0],
    [analyticsData]
  );

  const mostViewedList = useMemo(
    () => analyticsData?.rankedLists?.find((l) => l.id === "most-viewed") || analyticsData?.rankedLists?.[1],
    [analyticsData]
  );
  const bestSellers = bestSellersList?.items || [];
  const mostViewed = mostViewedList?.items || [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* 1. Header with Export button */}
      <AnalyticsHeader
        title={analyticsData.header.title}
        description={analyticsData.header.description}
        exportLabel={analyticsData.header.exportLabel}
        onExport={handleExport}
      />

      {/* 2. Top Metric Cards Row (Gross Revenue, Platform Fees, Net Revenue) */}
      <SummaryCardsRow cards={analyticsData.summaryCards} />

      {/* 3. Stacked Bar Chart: Revenue vs Fees Breakdown */}
      <RevenueChart
        title={analyticsData.revenueBreakdown.title}
        series={analyticsData.revenueBreakdown.series}
        labels={analyticsData.revenueBreakdown.labels}
        activeRange={analyticsData.revenueBreakdown.activeRange}
        rangeOptions={analyticsData.revenueBreakdown.rangeOptions}
        onRangeChange={handleRangeChange}
      />

      {/* 4. Transfer History Table */}
      <TransferHistoryTable
        title={analyticsData.transferHistory.title}
        items={analyticsData.transferHistory.items}
      />

      {/* 5. Ranked Lists Grid: Top 5 Best Sellers & Most Viewed Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bestSellersList && (
          <RankedProductList
            title={bestSellersList.title}
            metricType={bestSellersList.metricType}
            items={bestSellers}
          />
        )}
        {mostViewedList && (
          <RankedProductList
            title={mostViewedList.title}
            metricType={mostViewedList.metricType}
            items={mostViewed}
          />
        )}
      </div>
    </div>
  );
};

export default StoreAnalytics;
