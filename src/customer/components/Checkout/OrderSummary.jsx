import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { loadVouchers, voucherValidate } from "../../../storeManager/components/Promotions/voucher.utils";

const OrderSummary = ({ savedAddress = [], selectedAddress, paymentMethod }) => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);

  const [items, setItems] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("checkoutCart")) ||
      JSON.parse(localStorage.getItem("cart")) ||
      []
    );
  });

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const storeId = items[0]?.id_store || items[0]?.storeId || "store-001";

  // Load available active vouchers for this store
  const availableVouchers = useMemo(() => {
    const all = loadVouchers(storeId);
    return all.filter((v) => (v.status || "").toLowerCase() === "active");
  }, [storeId]);

  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.price || 0) * (Number(item.quantity) || 1);
  }, 0);

  // 0.5% shipping fee for orders > $500, otherwise FREE
  const rawShippingFee = subtotal > 500 ? subtotal * 0.005 : 0;
  const isFreeShippingApplied = appliedVoucher?.discountType === "Free Shipping";
  const shippingFee = isFreeShippingApplied ? 0 : rawShippingFee;

  const taxes = subtotal * 0.08;
  const originalTotal = subtotal + rawShippingFee + taxes;
  const finalTotal = Math.max(0, originalTotal - discountAmount);

  const handleApplyCode = (codeToApply) => {
    const targetCode = (codeToApply || promoCode).trim();
    if (!targetCode) {
      setVoucherError("Vui lòng nhập mã giảm giá!");
      setVoucherMessage("");
      return;
    }

    const result = voucherValidate(
      targetCode,
      storeId,
      subtotal,
      currentUser.id || "guest"
    );

    if (result.valid) {
      setAppliedVoucher(result.voucher);
      setDiscountAmount(result.discountAmount);
      setVoucherMessage(result.message || "Áp dụng mã giảm giá thành công!");
      setVoucherError("");
      setPromoCode(result.code);
    } else {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      setVoucherMessage("");
      setVoucherError(result.error || "Mã không hợp lệ hoặc đã hết hạn!");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setPromoCode("");
    setVoucherMessage("");
    setVoucherError("");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!savedAddress || savedAddress.length === 0) {
      alert("Chưa có địa chỉ giao hàng! Vui lòng điền và lưu địa chỉ mới.");
      return;
    }
    if (!selectedAddress) {
      alert("Vui lòng chọn một địa chỉ giao hàng từ danh sách Saved Delivery Addresses!");
      return;
    }
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    const generatedOrderId = "NX-" + Math.floor(10000 + Math.random() * 90000);
    const orderData = {
      orderId: generatedOrderId,
      storeId: storeId,
      subtotal: subtotal,
      tax: taxes,
      discountAmount: discountAmount,
      voucherCode: appliedVoucher?.code || null,
      total: finalTotal,
      items: items,
      address: selectedAddress,
      paymentMethod: paymentMethod,
    };

    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
    navigate("/checkout/qr", { state: { order: orderData } });
  };

  return (
    <div>
      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs sticky top-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
          Order Summary
        </h2>

        {/* Product List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100"
                />
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {item.title} x {item.quantity}
                  </h4>
                  <p className="text-[11px] text-gray-500">{item.meta}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                ${(Number(item.price) || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Voucher & Promotion Code Section */}
        <div className="pt-2 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setVoucherError("");
              }}
              placeholder="DISCOUNT CODE"
              className="flex-1 bg-[#f8f9fc] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {appliedVoucher ? (
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
                <span>Bỏ chọn</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleApplyCode(promoCode)}
                className="bg-[#1E293B] hover:bg-black text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                APPLY
              </button>
            )}
          </div>

          {/* Feedback messages */}
          {appliedVoucher && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl text-xs text-emerald-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                <span>{voucherMessage}</span>
              </div>
              <span className="font-extrabold">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {voucherError && (
            <p className="text-[11px] font-medium text-rose-600 mt-1">
              {voucherError}
            </p>
          )}

          {/* Collapsible Dropdown for Available Vouchers */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowVoucherList((prev) => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100/70 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-indigo-600">
                <ConfirmationNumberOutlinedIcon sx={{ fontSize: 16 }} />
                <span>
                  Mã giảm giá có sẵn ({availableVouchers.length})
                </span>
              </span>
              {showVoucherList ? (
                <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
              ) : (
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
              )}
            </button>

            {/* Dropdown Content */}
            {showVoucherList && (
              <div className="p-3 pt-1 space-y-2 border-t border-slate-100 max-h-56 overflow-y-auto bg-white">
                {availableVouchers.length > 0 ? (
                  availableVouchers.map((v) => {
                    const isSelected = appliedVoucher?.id === v.id;
                    const isEligible = !v.minOrderValue || subtotal >= Number(v.minOrderValue);
                    const remaining =
                      v.usageLimit > 0
                        ? Math.max(0, v.usageLimit - (v.usedCount || 0))
                        : "∞";

                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (isEligible) {
                            handleApplyCode(v.code);
                          }
                        }}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${isSelected
                            ? "border-indigo-500 bg-indigo-50/60"
                            : isEligible
                              ? "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer"
                              : "border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed"
                          }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                              {v.code}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800">
                              {v.discountType === "Percentage"
                                ? `${v.value}% OFF`
                                : v.discountType === "Flat Amount"
                                  ? `$${v.value} OFF`
                                  : "Free Shipping"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {v.minOrderValue > 0 ? `Đơn tối thiểu $${v.minOrderValue}` : "Không giới hạn đơn tối thiểu"} • Còn {remaining} lượt
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={!isEligible}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              handleRemoveVoucher();
                            } else {
                              handleApplyCode(v.code);
                            }
                          }}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition shrink-0 ${isSelected
                              ? "bg-indigo-600 text-white"
                              : isEligible
                                ? "bg-slate-900 hover:bg-indigo-600 text-white"
                                : "bg-slate-200 text-slate-400"
                            }`}
                        >
                          {isSelected ? "Đang dùng" : isEligible ? "Áp dụng" : `Thiếu $${(v.minOrderValue - subtotal).toFixed(2)}`}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-xs text-slate-400 py-3">
                    Hiện chưa có mã giảm giá nào.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Price Calculation Lines */}
        <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>

          {/* Discount Line */}
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-semibold">
              <span className="flex items-center gap-1">
                <LocalOfferOutlinedIcon sx={{ fontSize: 15 }} />
                <span>Discount ({appliedVoucher?.code})</span>
              </span>
              <span className="font-bold">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-600">
            <span>Shipping</span>
            {subtotal > 500 ? (
              isFreeShippingApplied ? (
                <div>
                  <span className="line-through text-gray-400 text-xs font-semibold mr-1.5">
                    ${rawShippingFee.toFixed(2)}
                  </span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
              ) : (
                <span className="font-bold text-gray-900">
                  ${rawShippingFee.toFixed(2)}
                </span>
              )
            ) : (
              <span className="font-bold text-emerald-600">FREE</span>
            )}
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <span>Taxes</span>
            <span className="font-bold text-gray-900">${taxes.toFixed(2)}</span>
          </div>
        </div>

        {/* Total & CTA with Linethrough */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-bold text-gray-900">Total</span>
            <div className="text-right">
              {discountAmount > 0 && (
                <span className="line-through text-gray-400 text-sm font-semibold mr-2">
                  ${originalTotal.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-extrabold text-gray-900">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>CHECKOUT</span>
            <LockOutlinedIcon sx={{ fontSize: 16 }} />
          </button>

          <p className="text-[10px] text-gray-400 font-semibold text-center uppercase tracking-wider mt-3">
            BY PLACING YOUR ORDER, YOU AGREE TO OUR TERMS & CONDITIONS.
          </p>
        </div>
      </div>

      {/* Guarantee Badges */}
      <div className="flex items-center justify-around mt-6 text-center text-gray-400 py-2">
        <div className="flex flex-col items-center space-y-1">
          <ShieldOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="text-[10px] font-bold tracking-wider">SECURE</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <VerifiedUserOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="text-[10px] font-bold tracking-wider">VERIFIED</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <AutorenewOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="text-[10px] font-bold tracking-wider">30 DAYS</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;