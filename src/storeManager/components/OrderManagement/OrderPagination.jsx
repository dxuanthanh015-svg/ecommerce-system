import { useEffect } from "react";

const OrderPagination = ({
  currentPage,
  totalPages,
  showingFrom,
  showingTo,
  totalEntries,
  onPageChange,
}) => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

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

        {new Array(totalPages).fill(0).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(event) => onPageChange(event, index + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === index + 1
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={(event) => onPageChange(event, currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 text-xs font-semibold cursor-pointer transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
