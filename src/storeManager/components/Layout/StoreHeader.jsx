import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const StoreHeader = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-3.5 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Search Input Box */}
      <div className="relative w-72 sm:w-96">
        <SearchIcon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          sx={{ fontSize: 18 }}
        />
        <input
          type="text"
          placeholder="Search orders, products..."
          className="w-full bg-[#f0f3fa] border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 font-normal transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <NotificationsOutlinedIcon sx={{ fontSize: 22 }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Help / Support Icon */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          aria-label="Help"
        >
          <HelpOutlineIcon sx={{ fontSize: 22 }} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Account Profile Avatar */}
        <button
          type="button"
          className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-gray-700"
        >
          <AccountCircleIcon sx={{ fontSize: 26 }} className="text-gray-600" />
          <span className="text-xs font-bold text-gray-900 hidden md:inline">
            Manager Admin
          </span>
        </button>
      </div>
    </header>
  );
};

export default StoreHeader;
