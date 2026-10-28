export const defaultAnalyticsData = {
  header: { title: "Analytics & Financials", description: "Track your revenue, fees, and payouts.", exportLabel: "Export Report" },
  summaryCards: [],
  revenueBreakdown: { title: "Revenue vs Fees Breakdown", activeRange: "Last 6 Months", rangeOptions: ["Last 6 Months", "Last 12 Months", "Year to Date"], labels: [], series: [] },
  transferHistory: { title: "Transfer History", items: [] },
  rankedLists: [
    { id: "best-sellers", title: "Top 5 Best Sellers", metricType: "currency", items: [] },
    { id: "most-viewed", title: "Most Viewed Products", metricType: "number", items: [] },
  ],
};
