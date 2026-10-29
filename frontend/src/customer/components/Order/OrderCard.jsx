import { useNavigate } from "react-router-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PendingActionsTwoToneIcon from '@mui/icons-material/PendingActionsTwoTone';
import FreeCancellationRoundedIcon from '@mui/icons-material/FreeCancellationRounded';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { formatVnd } from "../../../utils/currency";

const getStatusBadge = (status) => {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "delivered":
    case "completed":
      return (
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
          <span>Delivered</span>
        </span>
      );
    case "shipped":
    case "in transit":
      return (
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
          <span>In Transit</span>
        </span>
      );
    case "processing":
    case "packing":
      return (
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
          <span>Processing</span>
        </span>
      );
    case "pending":
      return (
        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <PendingActionsTwoToneIcon sx={{ fontSize: 14 }} />
          <span>Pending</span>
        </span>
      );
    case "cancelled":
      return (
        <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <FreeCancellationRoundedIcon sx={{ fontSize: 14 }} />
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
          <span>{status || "Processing"}</span>
        </span>
      );
  }
};

const getOrderItemImage = (item) =>
  item?.productImageUrl || item?.imageUrl || item?.image || (typeof item === "string" ? item : undefined);

const OrderCard = ({ order, product, onConfirmReceived, isConfirming = false }) => {
  const navigate = useNavigate();

  const currentOrder = order || product || {};
  const orderId = currentOrder.orderId || currentOrder.id || "NX-8472-91";
  const date = currentOrder.date || "Oct 24, 2024";
  const status = currentOrder.status || "Pending";
  const isInTransit = ["shipped", "in transit", "in_transit"].includes(String(status).trim().toLowerCase());
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
              src={getOrderItemImage(item) || "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=300"}
              alt={item.productTitle || item.title || "Order item"}
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
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              TOTAL
            </span>
            <span className="text-lg font-extrabold text-gray-900">
              {formatVnd(total)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {isInTransit && onConfirmReceived && (
              <button
                type="button"
                disabled={isConfirming}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Xác nhận bạn đã nhận được đơn hàng #${orderId}?`)) {
                    onConfirmReceived(orderId);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60 flex items-center gap-1.5 shrink-0"
              >
                {isConfirming ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <TaskAltIcon sx={{ fontSize: 16 }} />
                )}
                <span>{isConfirming ? "Đang xử lý..." : "Đã nhận hàng"}</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/account/order/${orderId}`)}
              className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
