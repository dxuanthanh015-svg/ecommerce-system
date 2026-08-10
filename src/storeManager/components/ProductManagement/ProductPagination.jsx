import React from "react";
import { buildPaginationItems } from "./productManagement.utils";

const ProductPagination = ({
  currentPage = 1,
  totalPages = 5,
  onPageChange
}) => {
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
    <div className="p-4 sm:p-5 flex items-center justify-between border-t border-gray-100 font-sans">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:text-gray-500 transition-colors cursor-pointer"
      >
        <span>&lt; Previous</span>
      </button>

      <div className="flex items-center gap-1.5">
        {paginationItems.map((item) =>
          typeof item === "string" ? (
            <span key={item} className="text-xs text-gray-400 font-bold px-1">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange && onPageChange(item)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                currentPage === item
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:text-gray-500 transition-colors cursor-pointer"
      >
        <span>Next &gt;</span>
      </button>
    </div>
  );
};

export default ProductPagination;
