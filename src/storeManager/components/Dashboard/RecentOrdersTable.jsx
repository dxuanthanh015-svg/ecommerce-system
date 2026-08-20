import React from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const defaultOrdersMock = [
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

const getStatusBadge = (status) => {
  const s = status?.toLowerCase();
  if (s === "pending") {
    return "bg-amber-100/80 text-amber-800 border border-amber-200/60";
  }
  if (s === "processing" || s === "paid") {
    return "bg-emerald-100/80 text-emerald-800 border border-emerald-200/60";
  }
  if (s === "shipped") {
    return "bg-indigo-100/80 text-indigo-800 border border-indigo-200/60";
  }
  return "bg-gray-100 text-gray-800";
};

const RecentOrdersTable = ({ orders = defaultOrdersMock, onApproveOrder }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
      {/* Table Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Recent Orders
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Latest customer purchases awaiting action
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/store-manager/orders")}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {orders && orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="pb-3 px-2">ORDER ID</th>
                <th className="pb-3 px-4">CUSTOMER</th>
                <th className="pb-3 px-4">DATE</th>
                <th className="pb-3 px-4">TOTAL</th>
                <th className="pb-3 px-4">STATUS</th>
                <th className="pb-3 px-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-semibold">
              {orders.map((order, index) => {
                const orderTotal = Number(order.totalAmount) || Number(order.total) || 0;
                const displayDate = order.formattedDate || (order.date ? new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Today");

                return (
                  <tr key={order.orderId || index} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-2 font-bold text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {order.customer || order.customerName || "Customer"}
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-normal text-xs">
                      {displayDate}
                    </td>
                    <td className="py-4 px-4 font-black text-gray-900">
                      ${orderTotal.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => onApproveOrder && onApproveOrder(order.orderId)}
                            className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                            title="Approve Order"
                          >
                            <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => navigate("/store-manager/orders")}
                          className="w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                          title="View Details"
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-3xl mb-2">🛍️</p>
            <h4 className="text-sm font-bold text-gray-700">No orders yet</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              When customers purchase products from your store, their orders and revenue will appear here in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersTable;
