import React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const BasicInformation = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
      <h2 className="text-base sm:text-lg font-extrabold text-gray-900 pb-3 border-b border-gray-100">
        Basic Information
      </h2>

      <div className="space-y-4">
        {/* Product Title */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="e.g. Winter Explorer Waterproof Jacket"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>

        {/* Grid: Brand & Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Brand <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              placeholder="e.g. NexCart Outdoor"
              required
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Color Variant
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
              placeholder="e.g. Navy Blue / Black"
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Full Description <span className="text-rose-500">*</span>
          </label>
          
          {/* Text Formatting Bar */}
          <div className="bg-[#eef2f9] border border-gray-200 border-b-0 rounded-t-xl p-2 flex items-center gap-1 text-gray-600">
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatBoldIcon sx={{ fontSize: 16 }} /></button>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatItalicIcon sx={{ fontSize: 16 }} /></button>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatUnderlinedIcon sx={{ fontSize: 16 }} /></button>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatListBulletedIcon sx={{ fontSize: 16 }} /></button>
          </div>

          <textarea
            name="description"
            rows={4}
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Write a detailed description highlighting product features..."
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-b-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
