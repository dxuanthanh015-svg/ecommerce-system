import React from "react";

const OrderPagination = ({
  currentPage = 1,
  totalPages = 3,
  showingFrom = 1,
  showingTo = 4,
  totalEntries = 24,
  onPageChange
}) => {
  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 font-sans">
      {/* Left Text */}
      <span className="text-xs text-gray-500 font-medium">
        Showing {showingFrom} to {showingTo} of {totalEntries} entries
      </span>

      {/* Right Page Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 text-xs font-semibold cursor-pointer transition-colors"
        >
          &lt;
        </button>

        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange && onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentPage === page
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 text-xs font-semibold cursor-pointer transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
