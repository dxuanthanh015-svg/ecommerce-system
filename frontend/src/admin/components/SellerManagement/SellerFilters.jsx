import React, { useState } from "react";

const SellerFilters = ({
  searchTerm = "",
  onSearchChange,
  activeFilter = "ALL",
  onFilterChange,
  onNewStoreClick,
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { key: "ALL", label: "All Stores" },
    { key: "ACTIVE", label: "Active" },
    { key: "PENDING", label: "Pending Approval" },
    { key: "BLOCKED", label: "Blocked" },
  ];

  return (
    <div className="flex items-center gap-2.5">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search stores..."
          className="w-52 sm:w-64 bg-white border border-gray-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all shadow-2xs"
        />
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          className={`bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer ${
            activeFilter !== "ALL" ? "border-gray-900 text-gray-900" : ""
          }`}
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter {activeFilter !== "ALL" && `(${activeFilter})`}
        </button>

        {/* Filter Dropdown */}
        {isFilterDropdownOpen && (
          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30 animate-fadeIn">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onFilterChange && onFilterChange(opt.key);
                  setIsFilterDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeFilter === opt.key
                    ? "bg-gray-100 text-gray-900 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Store Button */}
      <button
        type="button"
        onClick={() => onNewStoreClick && onNewStoreClick()}
        className="bg-black hover:bg-gray-900 text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        New Store
      </button>
    </div>
  );
};

export default SellerFilters;
