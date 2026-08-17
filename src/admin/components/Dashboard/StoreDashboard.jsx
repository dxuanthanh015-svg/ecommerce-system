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
import KpiCard from "../Dashboard/KpiCard";
import RevenueChart from "../Dashboard/RevenueChart";
import SystemLogs from "../Dashboard/SystemLogs";
import NewStoreRegistrations from "../Dashboard/NewStoreRegistrations";

// Default Mock Data for demonstration (reusable API contract schema)
const defaultDashboardData = {
  kpis: {
    todayRevenue: 1245.00,
    monthlyTarget: 10400.00,
    monthlyPercentage: 12,
    pendingOrdersCount: 45,
    lowStockAlertsCount: 12
  },
  platformHealth: {
    score: 99.98,
    status: "Stable Operations"
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
  platformHealth: {
    score: 99.98,
    status: "Stable Operations"
  },
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
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Tuesday, August 11, 2026</p>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={onExport} className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="TOTAL GMV" value="$4.28M" meta={<span className="text-emerald-600">+12.5% from last month</span>} icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />} />
        <KpiCard title="ACTIVE SELLERS" value="1,248" meta={<span className="text-emerald-600">+8.2% from last month</span>} icon={<AssignmentOutlinedIcon sx={{ fontSize: 20 }} />} />
        <KpiCard title="NEW CUSTOMERS" value="15.4k" meta={<span className="text-emerald-600">+15.1% from last month</span>} icon={<VisibilityOutlinedIcon sx={{ fontSize: 20 }} />} />
        <KpiCard title="PLATFORM HEALTH" value={`${data.platformHealth.score}%`} meta={<span className="text-gray-500">{data.platformHealth.status}</span>} icon={<TrendingUpIcon sx={{ fontSize: 20 }} />} accent="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueChart data={data.revenueChart} />
        </div>
        <div className="lg:col-span-4">
          <SystemLogs logs={data.systemLogs || []} />
        </div>
      </div>

      <NewStoreRegistrations items={data.newStores || []} />
    </div>
  );
};

export default StoreDashboard;
