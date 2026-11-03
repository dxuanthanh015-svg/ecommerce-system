import React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const COLOR_OPTIONS = [
  { name: "Black", code: "#111827" },
  { name: "White", code: "#ffffff" },
  { name: "Red", code: "#ef4444" },
  { name: "Blue", code: "#3b82f6" },
  { name: "Navy", code: "#1e3a8a" },
  { name: "Green", code: "#22c55e" },
  { name: "Yellow", code: "#eab308" },
  { name: "Pink", code: "#ec4899" },
  { name: "Beige", code: "#d6c2a1" },
  { name: "Gray", code: "#9ca3af" },
  { name: "Brown", code: "#92400e" },
  { name: "Purple", code: "#8b5cf6" },
];

const BasicInformation = ({ formData, handleChange, handleToggleColor }) => {
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

        {/* Grid: Brand */}
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

        </div>

        <fieldset>
          <legend className="text-xs font-bold text-gray-700 mb-2">Available colors</legend>
          <p className="text-xs text-gray-500 mb-3">Chọn tất cả màu sản phẩm thực sự có. Các màu này sẽ hiện thành swatch ở trang chi tiết.</p>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => {
              const selected = (formData.colors || []).some((item) => item.name.toLowerCase() === color.name.toLowerCase());
              return (
                <button
                  key={color.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleToggleColor(color)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${selected ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"}`}
                >
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.code }} />
                  {color.name}
                </button>
              );
            })}
          </div>
          {!(formData.colors || []).length && <p className="mt-2 text-xs text-rose-600">Chọn ít nhất một màu.</p>}
        </fieldset>

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
