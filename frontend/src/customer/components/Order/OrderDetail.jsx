import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderTracker from "./OrderTracker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useOrderDetail, useUpdateOrderStatus, useConfirmOrderReceived } from "../../../hooks/useOrderQuery";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { getOrderDeliveryInfo } from "../../../services/orderService";
import toast from "react-hot-toast";
import { formatVnd } from "../../../utils/currency";
import { getEffectivePrice } from "../../../utils/productPricing";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [confirming, setConfirming] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { data: userOrder, isLoading: loading } = useOrderDetail(orderId, currentUser?.email);
  const { mutateAsync: updateStatusMutate } = useUpdateOrderStatus();
  const { mutateAsync: confirmReceived } = useConfirmOrderReceived();

  const currentStatus = userOrder?.status || "Pending";
  const isInTransit = ["shipped", "in transit", "in_transit", "in-transit"]
    .includes(String(currentStatus).trim().toLowerCase());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]/60 py-16 font-sans flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!userOrder) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]/60 py-16 font-sans">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
            <p className="text-sm text-gray-500">
              We couldn't find details for order #{orderId}. It may have been deleted or archived.
            </p>
            <button
              onClick={() => navigate("/account/order")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              <span>Back to My Orders</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmReceived = async () => {
    if (confirming) return;
    if (!window.confirm(`Xác nhận bạn đã nhận được đầy đủ hàng cho đơn #${orderId}?`)) return;
    setConfirming(true);
    try {
      await confirmReceived(orderId);
      toast.success("Xác nhận đã nhận hàng thành công! Đơn hàng đã hoàn tất.");
    } catch (err) {
      console.error("Error confirming order:", err);
      toast.error("Có lỗi xảy ra khi xác nhận đơn hàng!");
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await updateStatusMutate({ orderId, status: "Cancelled" });
        toast.success("Đã hủy đơn hàng thành công.");
      } catch (err) {
        console.error("Error cancelling order:", err);
        toast.error("Có lỗi xảy ra khi hủy đơn hàng!");
      }
    }
  };

  const items = userOrder.items || [];
  const delivery = getOrderDeliveryInfo(userOrder);
  const recipientName = delivery.recipientName;
  const addressLine = delivery.addressLine;
  const cityLine = delivery.cityLine;
  const phoneLine = delivery.phone;

  const subtotal = Number(userOrder.subtotal) || Number(userOrder.total) || 0;
  const tax = Number(userOrder.tax) || 0;
  const discount = Number(userOrder.discountAmount) || 0;
  const total = Number(userOrder.total) || Number(userOrder.totalAmount) || (subtotal + tax - discount);

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button & Actions Row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/account/order")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Back to Orders</span>
          </button>

          {/* Quick Actions (Confirm / Cancel) */}
          <div className="flex items-center gap-2">
            {isInTransit && (
              <button
                type="button"
                onClick={handleConfirmReceived}
                disabled={confirming}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
              >
                {confirming ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <TaskAltIcon sx={{ fontSize: 16 }} />
                )}
                <span>{confirming ? "Đang xử lý..." : "Đã nhận được hàng"}</span>
              </button>
            )}
            {currentStatus === "Pending" && (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <CancelOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Order Overview Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Order #{userOrder.orderId}
              </h1>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${currentStatus === "Delivered"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : currentStatus === "Cancelled"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}>
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {userOrder.formattedDate || userOrder.date || "Recently"} • {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-gray-400 font-medium">Total Paid</span>
            <p className="text-2xl font-black text-gray-900">{formatVnd(total)}</p>
          </div>
        </div>

        {/* Order Tracker */}
        <div className="mb-6">
          <OrderTracker status={currentStatus} />
        </div>

        {/* Shipped Prompt Banner for User Confirmation */}
        {isInTransit && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <TaskAltIcon sx={{ fontSize: 22 }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Gói hàng đang trên đường giao đến bạn
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Khi bạn đã nhận được bưu kiện đầy đủ và nguyên vẹn, vui lòng nhấn xác nhận bên dưới để hoàn tất đơn hàng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmReceived}
              disabled={confirming}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {confirming ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              ) : (
                <TaskAltIcon sx={{ fontSize: 16 }} />
              )}
              <span>{confirming ? "Đang xử lý..." : "Xác nhận đã nhận hàng"}</span>
            </button>
          </div>
        )}

        {/* Two-Column Grid: Order Items & Delivery/Summary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-4">Purchased Items</h2>
              <div className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.productImageUrl || item.imageUrl || item.image || "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=300"}
                      alt={item.productTitle || item.title || "Order item"}
                      className="w-16 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {item.productTitle || item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Size: <span className="font-semibold text-gray-700">{item.size || "M"}</span> • Color: <span className="font-semibold text-gray-700">{item.color || "Default"}</span> • Qty: <span className="font-semibold text-gray-700">{item.quantity || 1}</span>
                      </p>
                      <p className="text-xs font-bold text-indigo-600 mt-1">
                        {formatVnd(getEffectivePrice(item))}
                        {getEffectivePrice(item) < (Number(item.price) || 0) && (
                          <span className="ml-2 text-gray-400 line-through font-normal">
                            {formatVnd(item.price)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-gray-900">
                        {formatVnd(getEffectivePrice(item) * (Number(item.quantity) || 1))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address & Payment Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Delivery Address Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-gray-900">Delivery Address</h2>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <LocationOnOutlinedIcon sx={{ fontSize: 16 }} className="text-indigo-600" />
                  <span>{recipientName}</span>
                </div>
                <p className="pl-6 font-medium text-slate-800">{addressLine}</p>
                {cityLine ? <p className="pl-6 text-slate-500">{cityLine}</p> : null}
                <div className="flex items-center gap-2 pl-6 pt-1 text-slate-500">
                  <LocalPhoneOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>{phoneLine}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-gray-900">Payment Breakdown</h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-900">{formatVnd(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatVnd(discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-black text-gray-900">
                  <span>Total</span>
                  <span>{formatVnd(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
