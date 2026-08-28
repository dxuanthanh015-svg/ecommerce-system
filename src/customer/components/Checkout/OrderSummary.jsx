import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { voucherService, cartService, authService } from "../../../services";

const OrderSummary = ({ savedAddress = [], selectedAddress, paymentMethod }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [promoCode, setPromoCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [items, setItems] = useState(location.state?.checkoutItems || []);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  const storeId = items[0]?.id_store || items[0]?.storeId || "store-001";

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        if (!location.state?.checkoutItems || location.state.checkoutItems.length === 0) {
          let cart = [];
          if (user?.email) {
            cart = await cartService.fetchCart(user.email);
          } else {
            cart = await cartService.fetchGuestCart();
          }
          setItems(cart || []);
        }

        const vList = await voucherService.fetchVouchers(storeId);
        setAvailableVouchers((vList || []).filter((v) => (v.status || "").toLowerCase() === "active"));
      } catch (err) {
        console.error("Error loading order summary:", err);
      }
    };
    init();
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

  const handleApplyCode = async (codeToApply) => {
    const targetCode = (codeToApply || promoCode).trim();
    if (!targetCode) {
      setVoucherError("Please fill your voucher code!");
      setVoucherMessage("");
      return;
    }

    try {
      const result = await voucherService.validateVoucher(
        targetCode,
        storeId,
        subtotal,
        items
      );

      if (result.isValid) {
        setAppliedVoucher(result.voucher);
        setDiscountAmount(result.discountAmount);
        setVoucherMessage(result.message || "Apply voucher successfully!");
        setVoucherError("");
        setPromoCode(result.voucher.code);
      } else {
        setAppliedVoucher(null);
        setDiscountAmount(0);
        setVoucherMessage("");
        setVoucherError(result.message || "Invalid voucher code or expired!");
      }
    } catch (err) {
      setVoucherError(err.message);
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
      alert("No delivery address yet! Please fill and save a new address.");
      return;
    }
    if (!selectedAddress) {
      alert("Please select a delivery address from the Saved Delivery Addresses list!");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method!");
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
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100"
                />
                <div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Size: <span className="font-semibold text-gray-700">{item.size || "M"}</span> | Color: <span className="font-semibold text-gray-700">{item.color || "Default"}</span> | Qty: {item.quantity || 1}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-gray-900 shrink-0">
                ${(Number(item.price || 0) * (Number(item.quantity) || 1)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-gray-100" />

        {/* Voucher Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Voucher / Promo Code
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter promo code..."
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={Boolean(appliedVoucher)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-600 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 font-bold uppercase tracking-wider outline-none transition disabled:opacity-50"
              />
              <LocalOfferOutlinedIcon
                sx={{ fontSize: 16 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {appliedVoucher ? (
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
                <span>Remove</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleApplyCode()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Apply
              </button>
            )}
          </div>

          {/* Feedback Messages */}
          {voucherMessage && (
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />
              <span>{voucherMessage}</span>
            </p>
          )}
          {voucherError && (
            <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
              <span>✕ {voucherError}</span>
            </p>
          )}

          {/* Available Vouchers Drawer Toggle */}
          {availableVouchers.length > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowVoucherList(!showVoucherList)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <ConfirmationNumberOutlinedIcon sx={{ fontSize: 15 }} />
                <span>Store Vouchers ({availableVouchers.length} available)</span>
                {showVoucherList ? (
                  <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
                )}
              </button>

              {/* Vouchers Dropdown */}
              {showVoucherList && (
                <div className="mt-2.5 space-y-2 max-h-48 overflow-y-auto p-1 bg-gray-50/70 rounded-xl border border-gray-100">
                  {availableVouchers.map((v) => {
                    const isCurrent = appliedVoucher?.code === v.code;
                    return (
                      <div
                        key={v.id}
                        className={`p-2.5 bg-white rounded-lg border flex items-center justify-between gap-2 transition ${isCurrent
                          ? "border-indigo-600 ring-1 ring-indigo-600"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div>
                          <span className="text-xs font-black text-indigo-600 tracking-wider">
                            {v.code}
                          </span>
                          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                            {v.description || `${v.discountValue}% off`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyCode(v.code);
                            setShowVoucherList(false);
                          }}
                          disabled={isCurrent}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${isCurrent
                            ? "bg-emerald-50 text-emerald-700 cursor-default"
                            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                            }`}
                        >
                          {isCurrent ? "Applied" : "Use"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Cost Breakdown */}
        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold text-gray-900">
              {shippingFee === 0 ? (
                <span className="text-emerald-600">FREE</span>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Taxes (8%)</span>
            <span className="font-bold text-gray-900">${taxes.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Promo Discount ({appliedVoucher?.code})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-gray-900">Total</span>
            <span className="text-2xl font-black text-indigo-600">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Place Order CTA */}
        <button
          type="button"
          onClick={handlePlaceOrder}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <LockOutlinedIcon sx={{ fontSize: 16 }} />
          <span>PAY WITH VIETQR (${finalTotal.toFixed(2)})</span>
        </button>

        {/* Trust Badges */}
        <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 font-medium border-t border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <ShieldOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
            <span>256-Bit SSL</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
            <span>Buyer Protection</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <AutorenewOutlinedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;