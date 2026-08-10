import React from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Default Mock Data for demonstration (reusable API contract schema)
const defaultDashboardData = {
  kpis: {
    todayRevenue: 1245.00,
    monthlyTarget: 10400.00,
    monthlyPercentage: 12,
    pendingOrdersCount: 45,
    lowStockAlertsCount: 12
  },
  revenueChart: [
    { day: "Mon", value: 35 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 40 },
    { day: "Thu", value: 65 },
    { day: "Fri", value: 45 },
    { day: "Sat", value: 80 },
    { day: "Sun", value: 95 }
  ],
  lowStockItems: [
    { id: 1, name: "Matte Ceramic Mug", sku: "HM-092", count: 4 },
    { id: 2, name: "Wire Desk Organizer", sku: "OF-114", count: 2 },
    { id: 3, name: "Minimalist Desk Lamp", sku: "DL-201", count: 3 }
  ],
  recentOrders: [
    {
      orderId: "#ORD-9012",
      customer: "Sarah Jenkins",
      date: "Today, 10:45 AM",
      total: 124.50,
      status: "Pending"
    },
    {
      orderId: "#ORD-9011",
      customer: "Michael Chen",
      date: "Today, 09:30 AM",
      total: 85.00,
      status: "Pending"
    },
    {
      orderId: "#ORD-9010",
      customer: "Emily Rodriguez",
      date: "Yesterday, 04:15 PM",
      total: 210.75,
      status: "Processing"
    },
    {
      orderId: "#ORD-9009",
      customer: "David Thompson",
      date: "Yesterday, 02:20 PM",
      total: 45.00,
      status: "Processing"
    },
    {
      orderId: "#ORD-9008",
      customer: "Jessica Lee",
      date: "Yesterday, 11:10 AM",
      total: 150.25,
      status: "Shipped"
    }
  ]
};

// Helper for dynamic status badge styling
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "processing":
      return "bg-emerald-100 text-emerald-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-indigo-100 text-indigo-800";
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StoreDashboard = ({ dashboardData = defaultDashboardData, onExport, onApproveOrder }) => {
  const navigate = useNavigate();
  const data = { ...defaultDashboardData, ...dashboardData };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Welcome back, here is your store's performance today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExport}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Export Report
          </button>
          <button
            type="button"
            onClick={() => navigate("/store-manager/products/add")}
            className="bg-[#5B21B6] hover:bg-purple-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* 3 KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              TODAY'S REVENUE
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              ${data.kpis.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-2">
              <TrendingUpIcon sx={{ fontSize: 16 }} />
              <span>{data.kpis.monthlyPercentage}% of Monthly (${data.kpis.monthlyTarget.toLocaleString('en-US')})</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              PENDING ORDERS
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {data.kpis.pendingOrdersCount}
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mt-2">
              <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Requires attention</span>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              LOW STOCK ALERTS
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {data.kpis.lowStockAlertsCount}
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mt-2">
              <span>📦 Products &lt; 5 items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Low Stock Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Revenue Overview Chart Box */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Revenue Overview
            </h3>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>Last 7 Days</span>
              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Dynamic Bar Chart */}
          <div className="bg-[#f4f3ff] rounded-2xl p-6 h-[220px] flex items-end justify-between gap-3">
            {data.revenueChart.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className="w-full bg-indigo-400 group-hover:bg-indigo-600 rounded-t-lg transition-all duration-300 relative"
                  style={{ height: `${bar.value}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
                    {bar.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Low Stock Alerts Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  Low Stock Alerts
                </h3>
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[11px] flex items-center justify-center">
                  {data.lowStockItems.length}
                </span>
              </div>
              <button 
                onClick={() => navigate('/store-manager/products')}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Dynamic Low Stock Items List */}
            <div className="space-y-4 pt-4">
              {data.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-[11px] text-gray-400">SKU: {item.sku}</p>
                  </div>
                  <span className="font-bold text-rose-600 whitespace-nowrap">
                    {item.count} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Generate Restock Order
          </button>
        </div>

      </div>

      {/* Bottom Section: Recent Orders Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Recent Orders
          </h3>
          <button
            onClick={() => navigate('/store-manager/orders')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </button>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4">ORDER ID</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">TOTAL</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((row) => (
                <tr key={row.orderId} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{row.orderId}</td>
                  <td className="py-4 px-4 font-medium text-gray-800">{row.customer}</td>
                  <td className="py-4 px-4 text-gray-500">{row.date}</td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {typeof row.total === 'number' ? `$${row.total.toFixed(2)}` : row.total}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400">
                      {row.status?.toLowerCase() === "pending" && (
                        <button 
                          onClick={() => onApproveOrder && onApproveOrder(row.orderId)}
                          className="hover:text-emerald-600 transition-colors cursor-pointer" 
                          title="Approve Order"
                        >
                          <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/store-manager/orders/${row.orderId.replace('#', '')}`)}
                        className="hover:text-indigo-600 transition-colors cursor-pointer" 
                        title="View Details"
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StoreDashboard;
