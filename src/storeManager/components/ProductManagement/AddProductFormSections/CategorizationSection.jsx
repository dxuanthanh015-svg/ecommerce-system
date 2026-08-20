import React from "react";

const CategorizationSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
      <h3 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
        Categorization
      </h3>

      {/* Top Level Category */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Top Level Category (Gender / Audience) <span className="text-rose-500">*</span>
        </label>
        <select
          name="topLavelCategory"
          value={formData.topLavelCategory || "Men"}
          onChange={handleChange}
          required
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium cursor-pointer transition-all"
        >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Second Level Category */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Second Level Category (Product Type) <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="secondLavelCategory"
          value={formData.secondLavelCategory || ""}
          onChange={handleChange}
          placeholder="e.g. Clothing / Accessories"
          required
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
        />
      </div>

      {/* Third Level Category */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Third Level Category (Sub Type)
        </label>
        <input
          type="text"
          name="thirdLavelCategory"
          value={formData.thirdLavelCategory || ""}
          onChange={handleChange}
          placeholder="e.g. jackets_coats / shirt / dress"
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
        />
      </div>

      {/* Fourth Level Category */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Fourth Level Category (Tag filter)
        </label>
        <input
          type="text"
          name="fourthLavelCategory"
          value={formData.fourthLavelCategory || ""}
          onChange={handleChange}
          placeholder="e.g. jackets_coats / casual"
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
        />
      </div>
    </div>
  );
};

export default CategorizationSection;
