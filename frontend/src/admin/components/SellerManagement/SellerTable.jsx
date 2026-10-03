import { useEffect } from "react";
import SellerRow from "./SellerRow";


const SellerTable = ({
  sellers = [],
  currentPage = 1,
  onPageChange,
  onReview,
  onEdit,
  onMore,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  const sellerNumber = sellers.length;
  const sellerPerPage = 8;
  const pageNumber = Math.ceil(sellerNumber / sellerPerPage);
  const page = Math.min(Math.max(currentPage, 1), Math.max(pageNumber, 1));
  const startIndex = (page - 1) * sellerPerPage + 1;
  const currentItem = sellers.slice(startIndex - 1, (startIndex + sellerPerPage) - 1);

  const firstPage = Math.max(1, Math.min(page - 2, pageNumber - 4));
  const pages = Array.from(
    { length: Math.min(pageNumber, 5) },
    (_, index) => firstPage + index
  );
  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium transition-colors";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-semibold text-xs select-none">
              <th className="py-3 px-5 text-left font-medium">Store Name</th>
              <th className="py-3 px-5 text-left font-medium">Owner</th>
              <th className="py-3 px-5 text-left font-medium">Total GMV</th>
              <th className="py-3 px-5 text-left font-medium">Status</th>
              <th className="py-3 px-5 text-left font-medium">Joined Date</th>
              <th className="py-3 px-5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItem.map((s, idx) => (
              <SellerRow
                key={s.id || s._id || idx}
                seller={s}
                onReview={onReview}
                onEdit={onEdit}
                onMore={onMore}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 px-5 flex items-center justify-between border-t border-gray-100 bg-white">
        <div className="text-xs text-gray-500 font-medium">
          Showing {sellerNumber > 0 ? ((page - 1) * sellerPerPage + 1) : 0} - {page * sellerPerPage > sellerNumber ? sellerNumber : page * sellerPerPage} of {sellerNumber} sellers
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
            className={`${buttonClass} text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onPageChange?.(pageNumber)}
              className={`${buttonClass} ${
                pageNumber === page
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            aria-label="Next page"
            disabled={page === pageNumber || pageNumber === 0}
            onClick={() => onPageChange?.(page + 1)}
            className={`${buttonClass} text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerTable;
