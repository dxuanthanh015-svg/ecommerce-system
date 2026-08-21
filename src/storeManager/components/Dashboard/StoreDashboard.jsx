import React, { useState, useMemo } from "react";
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
import { product_mock_data } from "../../../Data/product_mock_data";

const defaultMockOrders = [
  {
    orderId: "#ORD-9012",
    customer: "Sarah Jenkins",
    date: "Today, 10:45 AM",
    total: 124.50,
    status: "Pending",
  },
  {
    orderId: "#ORD-9011",
    customer: "Michael Chen",
    date: "Today, 09:30 AM",
    total: 85.00,
    status: "Pending",
  },
  {
    orderId: "#ORD-9010",
    customer: "Emily Rodriguez",
    date: "Yesterday, 04:15 PM",
    total: 210.75,
    status: "Processing",
  },
  {
    orderId: "#ORD-9009",
    customer: "David Thompson",
    date: "Yesterday, 02:20 PM",
    total: 45.00,
    status: "Processing",
  },
  {
    orderId: "#ORD-9008",
    customer: "Jessica Lee",
    date: "Yesterday, 11:10 AM",
    total: 150.25,
    status: "Shipped",
  },
];

import { getStoreOrderRevenue, updateStoreOrderStatus } from "../../../customer/utils/orderInventoryUtils";

const StoreDashboard = () => {
  const navigate = useNavigate();
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const storeDisplayName = currentStore.name || user.firstName || "Your Store";

  // Load real store orders and revenue from localStorage
  const [storeRevenueData, setStoreRevenueData] = useState(() => {
    return getStoreOrderRevenue(currentStore?.id) || {
      storeId: currentStore?.id,
      todayRevenue: 0,
      totalRevenue: 0,
      orders: [],
    };
  });

  const orders = storeRevenueData.orders || [];

  // Calculate real low stock items for this store
  const lowStockItems = useMemo(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products"));
    const allProducts = (savedProducts && savedProducts.length > 0) ? savedProducts : product_mock_data;

    // Filter products belonging to this store
    const storeProducts = allProducts.filter(
      (p) => String(p.id_store || p.storeId) === String(currentStore?.id)
    );

    return storeProducts
      .filter((p) => (Number(p.quantity) || 0) < 5)
      .map((p) => ({
        id: p.id,
        name: p.title,
        sku: `SKU-${p.id_store ? p.id_store.substring(0, 4).toUpperCase() : "NX"}-${p.id}`,
        count: Number(p.quantity) || 0,
      }))
      .slice(0, 5);
  }, [currentStore.id]);

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
        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear &&
          d.getDate() >= week.start &&
          d.getDate() <= week.end
        );
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

  const handleApproveOrder = (orderId) => {
    if (!currentStore.id) return;
    updateStoreOrderStatus(currentStore.id, orderId, "Processing");
    const updated = getStoreOrderRevenue(currentStore.id);
    setStoreRevenueData(updated);
    alert(`Đã duyệt thành công đơn hàng ${orderId}!`);
  };

  const handleExportReport = () => {
    alert(`Báo cáo doanh thu của gian hàng "${storeDisplayName}" đã được xuất dưới dạng CSV!`);
  };

  const pendingOrdersCount = orders.filter(
    (o) => (o.status || "").toLowerCase() === "pending"
  ).length;

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Header & Actions Bar */}
      {console.log(chartData)}
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
