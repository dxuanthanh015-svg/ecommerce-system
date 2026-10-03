import React from "react";
import { useNavigate } from "react-router-dom";

const FormHeader = ({ isEdit, productId, handleSubmit, isSubmitting = false }) => {
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
          disabled={isSubmitting}
          onClick={(e) => handleSubmit(e, "Draft")}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Save as Draft
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={(e) => handleSubmit(e, "Active")}
          className="bg-[#5B21B6] hover:bg-purple-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-75 disabled:cursor-wait flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isEdit ? "Saving..." : "Adding Product..."}</span>
            </>
          ) : (
            <span>{isEdit ? "Save Changes" : "Publish Product"}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormHeader;
