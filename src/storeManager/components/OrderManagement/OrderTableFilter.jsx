import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const statusTabs = [
  "All",
  "Pending",
  "Packing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returns/Refunds"
];

const OrderTableFilter = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 font-sans">
      {/* Search Input Box */}
      <div className="relative w-full xl:w-80">
        <SearchIcon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          sx={{ fontSize: 18 }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID, Customer..."
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 transition-all font-normal"
        />
      </div>

      {/* Horizontal Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus.toLowerCase() === tab.toLowerCase();
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onStatusChange(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTableFilter;
