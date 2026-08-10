import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

const checkoutItems = [
  {
    id: 1,
    title: "Silk Minimalist Bl...",
    meta: "Color: White, Size: M",
    price: 145.00,
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Navy Leather Cr...",
    meta: "Color: Navy",
    price: 295.00,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
  }
];

const OrderSummary = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigate("/account/order");
  };

  const subtotal = 440.00;
  const taxes = 35.20;
  const total = subtotal + taxes;

  return (
    <div>
      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs sticky top-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
          Order Summary
        </h2>

        {/* Product List */}
        <div className="space-y-4">
          {checkoutItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100" />
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-gray-500">{item.meta}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Discount Code Input */}
        <div className="pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="DISCOUNT CODE"
              className="flex-1 bg-[#f8f9fc] border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setAppliedPromo(true)}
              className="bg-[#1E293B] hover:bg-black text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              APPLY
            </button>
          </div>
          {appliedPromo && (
            <p className="text-[11px] font-medium text-emerald-600 mt-1.5">
              Promo code applied successfully!
            </p>
          )}
        </div>

        {/* Price Calculation Lines */}
        <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Shipping</span>
            <span className="text-gray-500 font-medium">Calculated next step</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Taxes</span>
            <span className="font-bold text-gray-900">${taxes.toFixed(2)}</span>
          </div>
        </div>

        {/* Total & CTA */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>Place Order</span>
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