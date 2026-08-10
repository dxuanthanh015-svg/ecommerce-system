import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ProductTableFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories = ["All Categories", "Electronics", "Home Goods", "Apparel", "Footwear"],
  statuses = ["All Statuses", "In Stock", "Low Stock", "Out of Stock"],
  totalItems = 42,
  showingFrom = 1,
  showingTo = 10
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
      {/* Left Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <SearchIcon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            sx={{ fontSize: 18 }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Name/SKU..."
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 transition-all font-normal"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-44">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 appearance-none cursor-pointer pr-8 transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <KeyboardArrowDownIcon
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            sx={{ fontSize: 18 }}
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-40">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 appearance-none cursor-pointer pr-8 transition-all"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <KeyboardArrowDownIcon
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            sx={{ fontSize: 18 }}
          />
        </div>
      </div>

      {/* Right Counter */}
      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
        Showing {showingFrom}-{showingTo} of {totalItems} products
      </span>
    </div>
  );
};

export default ProductTableFilter;
