import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import OrderTracker from "../../../customer/components/Order/OrderTracker";
import { getOrderDeliveryInfo } from "../../../services/orderService";
import { formatVnd } from "../../../utils/currency";


export default function StoreOrderDetailModal({ order, isOpen, onClose, onStatusChange }) {
  if (!isOpen || !order) return null;

  const items = order.items || [];
  const delivery = getOrderDeliveryInfo(order);
  const recipientName = delivery.recipientName;
  const addressLine = delivery.addressLine;
  const cityLine = delivery.cityLine;
  const phone = delivery.phone;
  const email = delivery.email;

  const totalAmount = Number(order.totalAmount) || Number(order.total) || 0;
  const status = order.orderStatus || order.status || "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Order #{order.orderId}
              </h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === "Delivered"
                ? "bg-emerald-100 text-emerald-800"
                : status === "Shipped"
                  ? "bg-indigo-100 text-indigo-800"
                  : status === "Cancelled"
                    ? "bg-rose-100 text-rose-800"
                    : status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                }`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {order.date || order.formattedDate || "Recent"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Order Progress Tracker */}
          <OrderTracker status={status} />

          {/* Customer & Shipping Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Customer Details</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{recipientName}</p>
              <p className="text-xs text-slate-600">{email}</p>
              <p className="text-xs text-slate-600">Phone: {phone}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Shipping Destination</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{addressLine}</p>
              <p className="text-xs text-slate-500">{cityLine}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Ordered Products ({items.length || 1})
            </h3>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-400">
                          Qty: <span className="font-semibold text-slate-700">{item.quantity || 1}</span>
                          {item.size ? ` • Size: ${item.size}` : ""}
                          {item.color ? ` • Color: ${item.color}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      {formatVnd((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-slate-500">
                  Item details stored on order total: {formatVnd(totalAmount)}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Payment Method</span>
              <span className="font-bold text-slate-800">{order.paymentMethod || "VietQR / Card"}</span>
            </div>
            {order.voucherCode && (
              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Voucher Applied</span>
                <span>{order.voucherCode} (-{formatVnd(order.discountAmount)})</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Order Amount</span>
              <span className="text-base font-extrabold text-indigo-600">{formatVnd(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 sm:px-8 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>

          {/* Quick status progression buttons */}
          <div className="flex items-center gap-2">
            {status === "Pending" && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(order.orderId, "Processing");
                  onClose();
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer"
              >
                Confirm &amp; Start Processing
              </button>
            )}
            {status === "Processing" && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(order.orderId, "Shipped");
                  onClose();
                }}
                className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition cursor-pointer"
              >
                Handover to Carrier (Shipped)
              </button>
            )}
            {status === "Shipped" && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs font-semibold text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Đang giao hàng • Chờ khách hàng xác nhận đã nhận hàng</span>
              </span>
            )}
            {(status === "Delivered" || status === "Completed") && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-700">
                <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Đơn hàng đã hoàn tất</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
