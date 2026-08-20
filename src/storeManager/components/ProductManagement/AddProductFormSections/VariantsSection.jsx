import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StraightenIcon from "@mui/icons-material/Straighten";

const VariantsSection = ({
  formData,
  handleSizeQuantityChange,
  handleAddSize,
  handleRemoveSize,
}) => {
  const [newSizeName, setNewSizeName] = useState("");

  const onAddClick = () => {
    if (newSizeName.trim()) {
      handleAddSize(newSizeName);
      setNewSizeName("");
    }
  };

  const sizesList = formData.size || [];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <StraightenIcon sx={{ fontSize: 18 }} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Size Variants & Stock Quantities
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Manage inventory stock for each size option
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 block">Total Quantity</span>
          <span className="text-sm font-black text-indigo-600">
            {formData.quantity || 0} items
          </span>
        </div>
      </div>

      {/* Sizes List with Quantity Inputs */}
      <div className="space-y-3">
        {sizesList.map((sizeItem, idx) => (
          <div
            key={sizeItem.name || idx}
            className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-2xl border border-gray-200/80 gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs uppercase">
                {sizeItem.name}
              </span>
              <span className="text-xs font-bold text-gray-700">
                Size {sizeItem.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Stock:</span>
                <input
                  type="number"
                  min="0"
                  value={sizeItem.quantity ?? 0}
                  onChange={(e) => handleSizeQuantityChange(idx, e.target.value)}
                  className="w-20 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-3 py-1.5 text-xs text-gray-900 font-extrabold text-center"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSize(sizeItem.name)}
                className="w-8 h-8 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Remove size"
              >
                <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Size Tag Bar */}
      <div className="pt-2 flex items-center gap-3">
        <input
          type="text"
          value={newSizeName}
          onChange={(e) => setNewSizeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddClick();
            }
          }}
          placeholder="Add new size (e.g., XL, XXL)..."
          className="flex-1 bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium transition-all"
        />
        <button
          type="button"
          onClick={onAddClick}
          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
        >
          <AddIcon sx={{ fontSize: 16 }} />
          <span>Add Size</span>
        </button>
      </div>
    </div>
  );
};

export default VariantsSection;
