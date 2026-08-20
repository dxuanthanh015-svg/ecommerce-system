import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const tabsList = [
  { id: "all", label: "Tất Cả Sản Phẩm" },
  { id: "bestseller", label: "🔥 Bán Chạy Nhất" },
  { id: "new", label: "✨ Hàng Mới Về" },
  { id: "sale", label: "🏷️ Đang Giảm Giá" },
];

const StoreTabs = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, totalCount }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {tabsList.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* In-Store Search Bar & Item Count */}
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          <strong className="text-gray-900 font-bold">{totalCount}</strong> sản phẩm
        </span>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm sản phẩm trong gian hàng..."
            className="w-full bg-[#f4f6fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 transition-all placeholder-gray-400"
          />
          <SearchIcon
            sx={{ fontSize: 18 }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreTabs;
