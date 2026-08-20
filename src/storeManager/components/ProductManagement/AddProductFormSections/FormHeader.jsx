import React from "react";
import { useNavigate } from "react-router-dom";

const FormHeader = ({ isEdit, productId, handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
          <span
            onClick={() => navigate('/store-manager/products')}
            className="hover:text-indigo-600 cursor-pointer"
          >
            Products
          </span>
          <span>›</span>
          <span className="text-gray-900 font-bold">
            {isEdit ? `Edit Product #${productId || ''}` : "Add New Product"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Create a new product listing with variants and imagery.
        </p>
      </div>

      {/* Top Right Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, "Draft")}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, "Active")}
          className="bg-[#5B21B6] hover:bg-purple-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
        >
          {isEdit ? "Save Changes" : "Publish Product"}
        </button>
      </div>
    </div>
  );
};

export default FormHeader;
