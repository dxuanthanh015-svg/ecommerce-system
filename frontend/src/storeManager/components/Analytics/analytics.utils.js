const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const exportAnalyticsReportCSV = (analyticsData = {}, storeName = "Store") => {
  const rows = [["Store", storeName], ["Section", "Metric", "Value"]];
  (analyticsData.summaryCards || []).forEach((card) => rows.push(["Summary", card.label, card.value]));
  const labels = analyticsData.revenueBreakdown?.labels || [];
  const gross = analyticsData.revenueBreakdown?.series?.find((series) => series.name === "Gross Revenue")?.data || [];
  const net = analyticsData.revenueBreakdown?.series?.find((series) => series.name === "Net Revenue")?.data || [];
  labels.forEach((label, index) => rows.push(["Revenue", label, `Gross ${gross[index] ?? 0}; Net ${net[index] ?? 0}`]));
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
