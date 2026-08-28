import React, { useState, useMemo, useEffect } from "react";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCardsRow from "./SummaryCardsRow";
import RevenueChart from "./RevenueChart";
import TransferHistoryTable from "./TransferHistoryTable";
import RankedProductList from "./RankedProductList";
import { storeService } from "../../../services";
import { defaultAnalyticsData } from "./analytics.data";
import {
  getStoreAnalyticsData,
  top5BestSellers,
  getMostViewProducts,
  exportAnalyticsReportCSV,
} from "./analytics.utils";

const StoreAnalytics = () => {
  const [storeId, setStoreId] = useState(null);
  const [storeName, setStoreName] = useState("NexCart Store");
  const [analyticsData, setAnalyticsData] = useState(defaultAnalyticsData);
  const [bestSellers, setBestSellers] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStore = async () => {
      const store = await storeService.getCurrentStore();
      const currentId = store?.id || store?._id;
      if (currentId) {
        setStoreId(currentId);
        setStoreName(store?.name || "NexCart Store");
      } else {
        console.warn("Chưa tìm thấy Store ID của người dùng hiện tại");
        setLoading(false);
      }
    };
    loadStore();
  }, []);

  useEffect(() => {
    if (!storeId) return;
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [data, sellers, viewed] = await Promise.all([
          getStoreAnalyticsData(storeId, analyticsData.revenueBreakdown.activeRange),
          top5BestSellers(storeId),
          getMostViewProducts(storeId),
        ]);
        setAnalyticsData(data);
        setBestSellers(sellers);
        setMostViewed(viewed);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [storeId]);

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
