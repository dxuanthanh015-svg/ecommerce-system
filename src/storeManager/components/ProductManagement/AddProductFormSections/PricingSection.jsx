import React from "react";

const PricingSection = ({ price, promoPrice, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
        Pricing
      </h3>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Listed Price *
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
            $
          </span>
          <input
            type="number"
            step="0.01"
            name="price"
            value={price}
            onChange={handleChange}
            placeholder="0.00"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-8 pr-4 py-3 text-xs sm:text-sm text-gray-900 font-bold transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Promo Price
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
            $
          </span>
          <input
            type="number"
            step="0.01"
            name="promoPrice"
            value={promoPrice}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-8 pr-4 py-3 text-xs sm:text-sm text-gray-900 font-bold transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
