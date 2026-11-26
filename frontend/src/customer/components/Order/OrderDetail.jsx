import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderTracker from "./OrderTracker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useOrderDetail, useUpdateOrderStatus, useConfirmOrderReceived, useRequestReturnOrder } from "../../../hooks/useOrderQuery";
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
  const { mutateAsync: requestReturnOrder } = useRequestReturnOrder();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const currentStatus = userOrder?.status || "Pending";
  const normalizedStatus = String(currentStatus).trim().toLowerCase();
  const isInTransit = ["shipped", "in transit", "in_transit", "in-transit"]
    .includes(normalizedStatus);
  const isDelivered = normalizedStatus === "delivered" || normalizedStatus === "completed";
  const isReturnRequested = normalizedStatus === "return_requested";
  const isReturned = normalizedStatus === "returned";
  const displayedStatus = isInTransit ? "In Transit" : isReturnRequested ? "Yêu cầu trả hàng" : isReturned ? "Đã trả hàng" : currentStatus;

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
        await updateStatusMutate({ orderId, status: "Cancelled", cancelByCustomer: true });
        toast.success("Đã hủy đơn hàng thành công.");
      } catch (err) {
        console.error("Error cancelling order:", err);
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi hủy đơn hàng!");
      }
    }
  };

  const handleRequestReturn = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      toast.error("Vui lòng nhập lý do trả hàng!");
      return;
    }
    setSubmittingReturn(true);
    try {
      await requestReturnOrder({ orderId, reason: returnReason.trim() });
      toast.success("Yêu cầu trả hàng đã được gửi tới cửa hàng!");
      setIsReturnModalOpen(false);
      setReturnReason("");
    } catch (err) {
      console.error("Error requesting return:", err);
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi yêu cầu trả hàng!");
    } finally {
      setSubmittingReturn(false);
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
                {displayedStatus}
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

        {/* Delivered Actions & Return Order Banner */}
        {isDelivered && (
          <div className="mb-6 bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <TaskAltIcon sx={{ fontSize: 22 }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Đơn hàng đã được giao thành công
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nếu sản phẩm có vấn đề (lỗi, sai kích cỡ, không đúng mô tả), bạn có thể yêu cầu trả hàng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="shrink-0 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Yêu cầu trả hàng</span>
            </button>
          </div>
        )}

        {/* Return Requested Banner */}
        {isReturnRequested && (
          <div className="mb-6 bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <span className="text-lg">📦</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Đơn hàng đang yêu cầu hoàn trả
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Lý do: <span className="font-semibold text-amber-900">{userOrder.returnReason || "Không có lý do chi tiết"}</span>
                </p>
                <p className="text-[11px] text-amber-600 mt-1">
                  Vui lòng gửi lại sản phẩm cho cửa hàng. Sau khi cửa hàng xác nhận đã nhận hàng hoàn, tồn kho sẽ tự động được hoàn lại.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
              Chờ shop xác nhận nhận hàng
            </span>
          </div>
        )}

        {/* Returned Banner */}
        {isReturned && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <TaskAltIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900">
                Đơn hàng đã được trả hàng thành công
              </h4>
              <p className="text-xs text-purple-700 mt-0.5">
                Cửa hàng đã xác nhận nhận lại sản phẩm hoàn và hệ thống đã tự động cập nhật lại tồn kho.
              </p>
            </div>
          </div>
        )}

        {/* Two-Column Grid: Order Items & Delivery/Summary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-4">Purchased Items</h2>
              <div className="divide-y divide-gray-100">
                {items.map((item, idx) => {
                  const title = item.productTitle || item.title || item.product?.title || "Sản phẩm";
                  const imageUrl = item.productImageUrl || item.imageUrl || item.image || item.product?.imageUrl || item.product?.images?.[0];
                  const quantity = Number(item.quantity) || 1;

                  return (
                  <div key={item.id || item.productId || idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3 sm:gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-16 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
                      />
                    ) : (
                      <div aria-label="Không có ảnh sản phẩm" className="w-16 h-20 rounded-xl border border-gray-100 bg-gray-50 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Size: <span className="font-semibold text-gray-700">{item.size || "M"}</span> • Color: <span className="font-semibold text-gray-700">{item.color || "Default"}</span> • Qty: <span className="font-semibold text-gray-700">{quantity}</span>
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
                        {formatVnd((Number(item.itemSubtotal) || getEffectivePrice(item) * quantity))}
                      </p>
                    </div>
                  </div>
                  );
                })}
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

        {/* Modal Yêu cầu trả hàng */}
        {isReturnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 font-sans">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Yêu cầu trả hàng
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Vui lòng nêu rõ lý do trả hàng (sản phẩm lỗi, sai màu/size, hàng không giống mô tả...) để shop xử lý.
              </p>
              <form onSubmit={handleRequestReturn}>
                <textarea
                  rows={4}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Nhập chi tiết lý do bạn muốn trả hàng..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-indigo-600 transition"
                  required
                />
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReturnModalOpen(false);
                      setReturnReason("");
                    }}
                    disabled={submittingReturn}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReturn}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition disabled:opacity-60 cursor-pointer"
                  >
                    {submittingReturn ? "Đang gửi..." : "Xác nhận gửi yêu cầu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetail;
