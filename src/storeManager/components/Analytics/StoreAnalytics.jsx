import React, { useState, useMemo, useEffect } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCardsRow from "./SummaryCardsRow";
import RevenueChart from "./RevenueChart";
import TransferHistoryTable from "./TransferHistoryTable";
import RankedProductList from "./RankedProductList";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useStoreRevenue } from "../../../hooks/useOrderQuery";
import { defaultAnalyticsData } from "./analytics.data";
import {
  getStoreAnalyticsData,
  exportAnalyticsReportCSV,
} from "./analytics.utils";
import { useMostViewProduct, useTop5Product } from "../../../hooks/useProductQuery";
import { useViewsData } from "../../../hooks/useProductQuery";

const StoreAnalytics = () => {
  const { data: currentStore } = useCurrentStore();
  const storeId = currentStore?.id || currentStore?._id;
  const storeName = currentStore?.name || "NexCart Store";
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [bestSellers, setBestSellers] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);

  // Sử dụng React Query cache để tải dữ liệu analytics
  const { data: allViews } = useViewsData();
  const { data: revenueData, isLoading: loading } = useStoreRevenue(storeId);
  const { data: viewed } = useMostViewProduct(storeId, allViews, revenueData);
  const { data: top5Product } = useTop5Product(storeId, revenueData);
  const { data: analyticData } = useStoreAnalytics(storeId, analyticsData.revenueBreakdown.activeRange, revenueData);
  useEffect(() => {
    if (!storeId || !revenueData) return;
    const loadAnalytics = async () => {
      try {
        const data = analyticData
        setAnalyticsData(data);
        setBestSellers(top5Product);
        setMostViewed(viewed);
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    };
    loadAnalytics();
  }, [storeId, revenueData]);

  const handleExport = () => {
    exportAnalyticsReportCSV(analyticsData, storeName);
  };

  const handleRangeChange = async (range) => {
    try {
      const data = await getStoreAnalyticsData(storeId, range);
      setAnalyticsData(data);
    } catch {
      setAnalyticsData((prev) => ({
        ...prev,
        revenueBreakdown: { ...prev.revenueBreakdown, activeRange: range },
      }));
    }
  };

  const bestSellersList = useMemo(
    () => analyticsData.rankedLists?.find((l) => l.id === "best-sellers") || analyticsData.rankedLists?.[0],
    [analyticsData]
  );

  const mostViewedList = useMemo(
    () => analyticsData.rankedLists?.find((l) => l.id === "most-viewed") || analyticsData.rankedLists?.[1],
    [analyticsData]
  );

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
