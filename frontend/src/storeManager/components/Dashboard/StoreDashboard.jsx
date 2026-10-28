import React from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { formatVnd } from "../../../utils/currency";

import KpiCard from "./KpiCard";
import RevenueChartCard from "./RevenueChartCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import RecentOrdersTable from "./RecentOrdersTable";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useStoreAnalytics } from "../../../hooks/useProductQuery";
import { useUpdateOrderStatus } from "../../../hooks/useOrderQuery";
import toast from "react-hot-toast";

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const { data: currentStore } = useCurrentStore();
  const { mutateAsync: updateOrderStatus, isPending: isApproving, variables: approvingVars } = useUpdateOrderStatus();

  const storeDisplayName = currentStore?.name || currentUser?.firstName || "Your Store";

  const {
    data: storeMetrics,
    isLoading: isLoadingAnalytics,
    isError: hasAnalyticsError,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useStoreAnalytics("Last 6 Months");
  const orders = storeMetrics?.recentOrders || [];
  const lowStockItems = storeMetrics?.lowStockItems || [];
  const chartData = storeMetrics?.revenueChart;

  const handleApproveOrder = async (orderId) => {
    if (!currentStore?.id || isApproving) return;
    try {
      await updateOrderStatus({ orderId, status: "Processing", storeId: currentStore.id });
      toast.success(`Đã duyệt thành công đơn hàng ${orderId}!`);
    } catch (err) {
      console.error("[Dashboard] Error approving order:", err);
      toast.error(`Có lỗi xảy ra khi duyệt đơn hàng ${orderId}!`);
    }
  };

  const handleExportReport = () => {
    const rows = [
      ["Store", storeDisplayName],
      ["Today revenue", storeMetrics?.todayRevenue || 0],
      ["Total revenue", storeMetrics?.totalRevenue || 0],
      ["Pending orders", storeMetrics?.pendingOrdersCount || 0],
      ["Low stock products", lowStockItems.length],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `store_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const pendingOrdersCount = storeMetrics?.pendingOrdersCount || 0;

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Welcome back to <span className="font-bold text-indigo-600">{storeDisplayName}</span>, here is your performance today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Export Report</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/store-manager/products/add")}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Top KPI Metrics Row (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="TODAY'S REVENUE"
          value={formatVnd(storeMetrics?.todayRevenue || 0)}
          trendText={`Total: ${formatVnd(storeMetrics?.totalRevenue || 0)}`}
          subtitle="Real-time sales today"
          trendColorClass="text-emerald-600 font-extrabold"
          icon={AccountBalanceWalletOutlinedIcon}
          iconBgClass="bg-purple-100/80 text-purple-700"
        />

        <KpiCard
          title="PENDING ORDERS"
          value={pendingOrdersCount}
          subtitle="Requires fulfillment"
          trendText={pendingOrdersCount > 0 ? "⚡ Needs action" : "✓ Up to date"}
          trendColorClass={pendingOrdersCount > 0 ? "text-amber-600 font-extrabold" : "text-emerald-600 font-bold"}
          icon={AssignmentOutlinedIcon}
          iconBgClass="bg-amber-100/80 text-amber-700"
        />

        <KpiCard
          title="LOW STOCK ALERTS"
          value={lowStockItems.length}
          subtitle="Products < 5 in stock"
          trendText={lowStockItems.length > 0 ? "📦 Low inventory" : "✓ In Stock"}
          trendColorClass={lowStockItems.length > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}
          icon={WarningAmberOutlinedIcon}
          iconBgClass="bg-rose-100/80 text-rose-600"
        />
      </div>

      {/* Middle Grid: Revenue Overview & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RevenueChartCard
            customData={chartData}
            isLoading={isLoadingAnalytics}
            isError={hasAnalyticsError}
            error={analyticsError}
            onRetry={refetchAnalytics}
          />
        </div>
        <div className="lg:col-span-4">
          <LowStockAlertsCard items={lowStockItems} />
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div>
        <RecentOrdersTable
          orders={orders}
          onApproveOrder={handleApproveOrder}
          isApproving={isApproving}
          approvingOrderId={approvingVars?.orderId}
        />
      </div>
    </div>
  );
};

export default StoreDashboard;
