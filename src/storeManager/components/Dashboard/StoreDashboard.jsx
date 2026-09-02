import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import KpiCard from "./KpiCard";
import RevenueChartCard from "./RevenueChartCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import RecentOrdersTable from "./RecentOrdersTable";
import { storeService, orderService, productService } from "../../../services";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useCurrentProducts } from "../../../hooks/useProductQuery";
import toast from "react-hot-toast";

const StoreDashboard = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const { data: currentStore } = useCurrentStore();
  const { data: currentProducts = [] } = useCurrentProducts();

  const storeDisplayName = currentStore?.name || currentUser?.firstName || "Your Store";
  const [storeRevenueData, setStoreRevenueData] = useState({ todayRevenue: 0, totalRevenue: 0, orders: [] });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải orders + low stock sau khi có store
  useEffect(() => {
    if (!currentStore) return;
    const loadData = async () => {
      try {
        setLoading(true);
        // Luôn lấy revenue theo đúng storeId — KHÔNG dùng fetchOrderRevenue() (dữ liệu chung)
        const revenue = await orderService.fetchStoreRevenueById(currentStore.id) ||
          { todayRevenue: 0, totalRevenue: 0, orders: [] };

        // Re-calculate revenue để đảm bảo đồng bộ với orders hiện tại
        const syncedRevenue = await orderService.recalculateStoreRevenue(currentStore.id) || revenue;

        // Lọc thêm đảm bảo chỉ tính orders của store này - đồng bộ logic với Analytics
        const todayStr = new Date().toDateString();
        const allOrders = syncedRevenue.orders || [];
        const orders = allOrders.filter((o) => {
          const orderStoreId = o.storeId || o.id_store || o.items?.[0]?.id_store || o.items?.[0]?.storeId;
          return orderStoreId && String(orderStoreId).trim() === String(currentStore.id).trim();
        });

        // Dùng giá trị đã sync từ API thay vì tính toán lại
        setStoreRevenueData({ 
          ...syncedRevenue, 
          orders 
        });

        // Lấy sản phẩm low stock từ /currentProducts
        const prods = await productService.fetchCurrentProducts();
        const low = prods
          .filter((p) => (Number(p.quantity) || 0) < 5)
          .map((p) => ({
            id: p.id,
            name: p.title,
            sku: `SKU-${(p.id_store || "NX").toString().substring(0, 4).toUpperCase()}-${p.id}`,
            count: Number(p.quantity) || 0,
          }))
          .slice(0, 5);
        setLowStockItems(low);
      } catch (err) {
        console.error("[Dashboard] Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentStore]);

  const orders = storeRevenueData.orders || [];

  const chartData = useMemo(() => {
    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const last7days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      const dateStr = d.toDateString();
      const value = orders
        .filter((o) => o.date && new Date(o.date).toDateString() === dateStr)
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
      return { label: dayNames[d.getDay()], value: Math.round(value) };
    });

    const last30days = [
      { label: "Day 1-5", min: 26, max: 30 },
      { label: "Day 6-10", min: 21, max: 25 },
      { label: "Day 11-15", min: 16, max: 20 },
      { label: "Day 16-20", min: 11, max: 15 },
      { label: "Day 21-25", min: 6, max: 10 },
      { label: "Day 26-30", min: 0, max: 5 },
    ].map((range) => {
      const value = orders
        .filter((o) => {
          if (!o.date) return false;
          const diffDays = Math.floor((now - new Date(o.date)) / (1000 * 60 * 60 * 24));
          return diffDays >= range.min && diffDays <= range.max;
        })
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
      return { label: range.label, value: Math.round(value) };
    });

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thismonth = [
      { label: "Week 1", start: 1, end: 7 },
      { label: "Week 2", start: 8, end: 14 },
      { label: "Week 3", start: 15, end: 21 },
      { label: "Week 4", start: 22, end: 31 },
    ].map((week) => {
      const value = orders
        .filter((o) => {
          if (!o.date) return false;
          const d = new Date(o.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear &&
            d.getDate() >= week.start && d.getDate() <= week.end;
        })
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
      return { label: week.label, value: Math.round(value) };
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const thisyear = monthNames.map((monthLabel, monthIdx) => {
      const value = orders
        .filter((o) => {
          if (!o.date) return false;
          const d = new Date(o.date);
          return d.getFullYear() === currentYear && d.getMonth() === monthIdx;
        })
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
      return { label: monthLabel, value: Math.round(value) };
    });

    return { last7days, last30days, thismonth, thisyear };
  }, [orders]);

  const handleApproveOrder = async (orderId) => {
    if (!currentStore?.id) return;
    await orderService.updateOrderStatusInAllRevenue(orderId, "Processing", currentStore.id);
    setStoreRevenueData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.orderId === orderId ? { ...o, status: "Processing" } : o
      ),
    }));
    toast.success(`Đã duyệt thành công đơn hàng ${orderId}!`);
  };

  const handleExportReport = () => {
    toast.success(`Đã xuất báo cáo doanh thu "${storeDisplayName}" dưới dạng CSV!`);
  };

  const pendingOrdersCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  ).length;

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
          value={`$${(storeRevenueData.todayRevenue || 0).toFixed(2)}`}
          trendText={`Total: $${(storeRevenueData.totalRevenue || 0).toFixed(2)}`}
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
          <RevenueChartCard customData={chartData} />
        </div>
        <div className="lg:col-span-4">
          <LowStockAlertsCard items={lowStockItems} />
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div>
        <RecentOrdersTable orders={orders} onApproveOrder={handleApproveOrder} />
      </div>
    </div>
  );
};

export default StoreDashboard;
