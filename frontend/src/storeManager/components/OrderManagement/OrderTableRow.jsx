import React from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const getInitials = (name) => {
  if (!name) return "CU";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const OrderTableRow = ({
  order,
  onConfirmOrder,
  onShipOrder,
  onDeliverOrder,
  onCancelOrder,
  onViewOrder,
  isUpdating = false,
  updatingOrderId = null,
}) => {
  const {
    orderId,
    customerName = "Customer Name",
    customerEmail = "customer@example.com",
    date = "Oct 24, 2023 10:42 AM",
    totalAmount = 1249.00,
    paymentStatus = "Paid",
    orderStatus = "Pending"
  } = order;

  const isThisOrderUpdating = isUpdating && String(updatingOrderId) === String(orderId || order?.id || order?._id);
  const initials = getInitials(customerName);

  return (
    <tr className="hover:bg-slate-50/70 transition-colors border-b border-gray-100 font-sans">
      {/* Order ID */}
      <td className="py-4 px-6">
        <button
          type="button"
          onClick={() => onViewOrder && onViewOrder(order)}
          className="font-extrabold text-gray-900 text-xs sm:text-sm hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>#{orderId}</span>
          <VisibilityOutlinedIcon sx={{ fontSize: 14, opacity: 0.6 }} />
        </button>
      </td>

      {/* Customer Name & Email */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {initials}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
              {customerName}
            </h4>
            <p className="text-[11px] text-gray-400 font-normal">
              {customerEmail}
            </p>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-xs text-gray-500 font-medium leading-relaxed">
        {date}
      </td>

      {/* Total Amount */}
      <td className="py-4 px-6 text-xs sm:text-sm font-extrabold text-gray-900">
        ${typeof totalAmount === "number" ? totalAmount.toFixed(2) : totalAmount}
      </td>

      {/* Status Badge */}
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
            orderStatus?.toLowerCase() === "delivered"
              ? "bg-emerald-100 text-emerald-800"
              : orderStatus?.toLowerCase() === "shipped"
              ? "bg-indigo-100 text-indigo-800"
              : orderStatus?.toLowerCase() === "cancelled"
              ? "bg-rose-100 text-rose-800"
              : orderStatus?.toLowerCase() === "processing"
              ? "bg-blue-100 text-blue-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {orderStatus}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {orderStatus?.toLowerCase() === "pending" && (
            <>
              <button
                type="button"
                disabled={isThisOrderUpdating}
                onClick={() => onConfirmOrder && onConfirmOrder(orderId)}
                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5"
              >
                {isThisOrderUpdating && (
                  <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                )}
                <span>Confirm Order</span>
              </button>
              <button
                type="button"
                disabled={isThisOrderUpdating}
                onClick={() => onCancelOrder && onCancelOrder(orderId)}
                className="border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          )}

          {(orderStatus?.toLowerCase() === "packing" || orderStatus?.toLowerCase() === "processing") && (
            <>
              <button
                type="button"
                disabled={isThisOrderUpdating}
                onClick={() => onShipOrder && onShipOrder(orderId)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-wait flex items-center gap-1.5"
              >
                {isThisOrderUpdating && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                )}
                <span>Ship Order</span>
              </button>
              <button
                type="button"
                disabled={isThisOrderUpdating}
                onClick={() => onCancelOrder && onCancelOrder(orderId)}
                className="border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          )}

          {orderStatus?.toLowerCase() === "shipped" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>In Transit • Awaiting Customer</span>
            </span>
          )}

          {(orderStatus?.toLowerCase() === "delivered" || orderStatus?.toLowerCase() === "completed") && (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200/70">
              <span>Completed</span>
            </span>
          )}

          {orderStatus?.toLowerCase() === "cancelled" && (
            <span className="text-rose-500 font-bold text-xs px-2 py-1">
              Cancelled
            </span>
          )}

          {/* View Details Icon Button */}
          <button
            type="button"
            onClick={() => onViewOrder && onViewOrder(order)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title="View Order Details"
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
