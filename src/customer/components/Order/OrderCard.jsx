import React from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return (
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
          <span>Delivered</span>
        </span>
      );
    case "In Transit":
      return (
        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
          <span>In Transit</span>
        </span>
      );
    case "Processing":
    default:
      return (
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
          <span>Processing</span>
        </span>
      );
  }
};

const OrderCard = ({ order, product }) => {
  const navigate = useNavigate();

  const currentOrder = order || product || {};
  const orderId = currentOrder.orderId || currentOrder.id || "NX-8472-91";
  const date = currentOrder.date || "Oct 24, 2024";
  const status = currentOrder.status || "Delivered";
  const total = currentOrder.total || currentOrder.discountedPrice || currentOrder.price || 142.50;

  // Extract items list and image URLs from order items
  const items = currentOrder.items || currentOrder.products || currentOrder.orderItems || (currentOrder.imageUrl ? [currentOrder] : [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop" }
  ]);

  const maxDisplay = 2;
  const displayItems = items.slice(0, maxDisplay);
  const extraCount = currentOrder.extraCount !== undefined 
    ? currentOrder.extraCount 
    : (items.length > maxDisplay ? items.length - maxDisplay : 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4 hover:shadow-md transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
          ORDER #{orderId}
        </span>
        {getStatusBadge(status)}
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 border-b border-gray-100 pb-3">
        {date}
      </p>

      {/* Items & Price Content Row */}
      <div className="flex items-end justify-between pt-1">
        {/* Thumbnails */}
        <div className="flex items-center gap-2">
          {displayItems.map((item, idx) => (
            <img
              key={item.id || idx}
              src={item.imageUrl || item.image || item}
              alt="Item thumbnail"
              className="w-14 h-14 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
            />
          ))}
          {extraCount > 0 && (
            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center border border-indigo-100">
              +{extraCount}
            </div>
          )}
        </div>

        {/* Total & Action Button */}
        <div className="text-right space-y-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              TOTAL
            </span>
            <span className="text-lg font-extrabold text-gray-900">
              ${typeof total === "number" ? total.toFixed(2) : total}
            </span>
          </div>

          <button
            onClick={() => navigate(`/account/order/${orderId}`)}
            className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
