import React from "react";

const UserPagination = ({ page = 0, totalPages = 0, onPageChange = () => {} }) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const currentPage = Math.min(Math.max(page, 0), safeTotalPages - 1);
  const firstPage = Math.max(0, Math.min(currentPage - 2, safeTotalPages - 5));
  const pages = Array.from(
    { length: Math.min(safeTotalPages, 5) },
    (_, index) => firstPage + index
  );

  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium transition-colors";

  return (
    <div className="flex justify-end border-t border-gray-100 px-6 py-5">
      <nav className="flex items-center gap-2" aria-label="User pagination">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
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
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`${buttonClass} ${
              pageNumber === currentPage
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === safeTotalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className={`${buttonClass} text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default UserPagination;
