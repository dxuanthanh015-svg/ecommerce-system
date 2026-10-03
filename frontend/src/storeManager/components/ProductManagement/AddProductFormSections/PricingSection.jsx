import React from "react";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const PricingSection = ({ formData, handleChange }) => {
  const priceNum = Number(formData.price) || 0;
  const discountedNum = Number(formData.discountedPrice) || 0;
  const computedDiscountPercent =
    priceNum > 0 && discountedNum > 0 && priceNum > discountedNum
      ? Math.round(((priceNum - discountedNum) / priceNum) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-base font-extrabold text-gray-900">
          Pricing & Flash Sale
        </h3>
        {computedDiscountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
            -{computedDiscountPercent}% OFF
          </span>
        )}
      </div>

      {/* Listed Price & Discounted Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Original Price ($) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="1999"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-bold transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Discounted Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            name="discountedPrice"
            value={formData.discountedPrice || ""}
            onChange={handleChange}
            placeholder="999"
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-bold transition-all"
          />
        </div>
      </div>

      {/* Flash Sale Toggle & Settings */}
      <div className="pt-2 border-t border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <BoltIcon sx={{ fontSize: 18 }} />
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">
                Enable Flash Sale
              </span>
              <span className="text-[10px] text-gray-400 font-medium block">
                Highlight product in Flash Sale deals
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isFlashSale"
              checked={Boolean(formData.isFlashSale)}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        {/* Flash Sale End Time (strictly null when isFlashSale is false) */}
        {formData.isFlashSale ? (
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-3">
            <div>
              <label className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
                FLASH SALE END TIME
              </label>
              <input
                type="datetime-local"
                name="flashSaleEndTime"
                value={
                  formData.flashSaleEndTime
                    ? formData.flashSaleEndTime.substring(0, 16)
                    : ""
                }
                onChange={handleChange}
                className="w-full bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl px-3 py-2 text-xs text-amber-950 font-bold transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Stock Left
                </label>
                <input
                  type="number"
                  name="stockLeft"
                  value={formData.stockLeft ?? 5}
                  onChange={handleChange}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Claimed (%)
                </label>
                <input
                  type="number"
                  name="claimedPercent"
                  value={formData.claimedPercent ?? 85}
                  onChange={handleChange}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 italic">
            * Flash Sale End Time is set to <strong>null</strong> when Flash Sale is disabled.
          </p>
        )}
      </div>

      {/* Trending Product Toggle */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <TrendingUpIcon sx={{ fontSize: 18 }} />
          </div>
          <div>
            <span className="text-xs font-extrabold text-gray-900 block">
              Trending Product
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              Show in Trending Deals section
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isTrending"
            checked={Boolean(formData.isTrending)}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
        </label>
      </div>
    </div>
  );
};

export default PricingSection;
