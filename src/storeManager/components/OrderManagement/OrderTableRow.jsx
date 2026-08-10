import React from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
  onCancelOrder
}) => {
  const navigate = useNavigate();
  const {
    orderId,
    customerName = "Customer Name",
    customerEmail = "customer@example.com",
    date = "Oct 24, 2023 10:42 AM",
    totalAmount = 1249.00,
    paymentStatus = "Paid",
    orderStatus = "Pending"
  } = order;

  const initials = getInitials(customerName);

  return (
    <tr className="hover:bg-gray-50/60 transition-colors border-b border-gray-50 font-sans">
      {/* Order ID */}
      <td 
        onClick={() => navigate(`/store-manager/orders/${orderId.replace("#", "")}`)}
        className="py-4 px-6 font-extrabold text-gray-900 text-xs sm:text-sm cursor-pointer hover:text-indigo-600 transition-colors"
      >
        {orderId}
      </td>

      {/* Customer Name & Email */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
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

      {/* Payment Status Badge */}
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
            paymentStatus?.toLowerCase() === "paid"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {paymentStatus}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {orderStatus?.toLowerCase() === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onConfirmOrder && onConfirmOrder(orderId)}
                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Confirm Order
              </button>
              <button
                type="button"
                onClick={() => onCancelOrder && onCancelOrder(orderId)}
                className="border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-0.5"
              >
                <span>Cancel Order</span>
                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
              </button>
            </>
          )}

          {(orderStatus?.toLowerCase() === "packing" || orderStatus?.toLowerCase() === "confirmed") && (
            <>
              <button
                type="button"
                onClick={() => onShipOrder && onShipOrder(orderId)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Ship Order
              </button>
              <button
                type="button"
                onClick={() => onCancelOrder && onCancelOrder(orderId)}
                className="border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-0.5"
              >
                <span>Cancel Order</span>
                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
              </button>
            </>
          )}

          {(orderStatus?.toLowerCase() === "shipped" || orderStatus?.toLowerCase() === "delivered" || orderStatus?.toLowerCase() === "completed") && (
            <span className="text-gray-400 italic text-xs font-semibold px-2 py-1">
              Completed
            </span>
          )}

          {orderStatus?.toLowerCase() === "cancelled" && (
            <span className="text-rose-500 font-bold text-xs px-2 py-1">
              Cancelled
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
