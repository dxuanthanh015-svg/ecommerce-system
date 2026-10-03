import React from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const ShopInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <StorefrontOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
        <h3 className="text-base sm:text-lg font-extrabold text-indigo-700 tracking-tight">
          Shop Information
        </h3>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Shop Name */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            SHOP NAME <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName || ""}
            onChange={handleChange}
            placeholder="e.g., The Minimalist Boutique"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>

        {/* Shop Description */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            SHOP DESCRIPTION
          </label>
          <textarea
            rows={3}
            name="shopDescription"
            value={formData.shopDescription || ""}
            onChange={handleChange}
            placeholder="Briefly describe what your shop sells..."
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>

        {/* Primary Category */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            PRIMARY CATEGORY <span className="text-rose-500">*</span>
          </label>
          <select
            name="primaryCategory"
            value={formData.primaryCategory || ""}
            onChange={handleChange}
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all cursor-pointer"
          >
            <option value="">Select a category</option>
            <option value="Fashion & Apparel">Fashion & Apparel</option>
            <option value="Footwear & Shoes">Footwear & Shoes</option>
            <option value="Accessories & Jewelry">Accessories & Jewelry</option>
            <option value="Electronics & Gadgets">Electronics & Gadgets</option>
            <option value="Home & Living">Home & Living</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoSection;
