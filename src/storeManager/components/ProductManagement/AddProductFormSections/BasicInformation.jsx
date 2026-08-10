import React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";

const BasicInformation = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
        Basic Information
      </h2>

      <div className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Product Name *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Minimalist Ceramic Vase"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 font-normal transition-all"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. NexCart Originals"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 font-normal transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1.5">
            Description *
          </label>
          
          {/* Formatting Toolbar */}
          <div className="bg-[#eef2f9] border border-gray-200 border-b-0 rounded-t-xl p-2 flex items-center gap-1 text-gray-600">
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatBoldIcon sx={{ fontSize: 16 }} /></button>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatItalicIcon sx={{ fontSize: 16 }} /></button>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatUnderlinedIcon sx={{ fontSize: 16 }} /></button>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatListBulletedIcon sx={{ fontSize: 16 }} /></button>
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><FormatListNumberedIcon sx={{ fontSize: 16 }} /></button>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <button type="button" className="p-1 hover:bg-gray-200 rounded cursor-pointer"><ImageIcon sx={{ fontSize: 16 }} /></button>
          </div>

          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed product description..."
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-b-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 font-normal transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
