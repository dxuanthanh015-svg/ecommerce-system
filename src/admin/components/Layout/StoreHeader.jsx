import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const StoreHeader = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-3.5 px-6 sm:px-8 sticky top-0 z-30 font-sans">
      <div className="max-w-full mx-auto flex items-center gap-4">
        {/* Left: App Title */}
        <div className="flex items-center min-w-[220px]">
          <h2 className="text-base font-extrabold text-gray-900">NexCart Platform</h2>
        </div>

        {/* Center: Search */}
        <div className="flex-1 px-4">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users, sellers..."
                className="w-full border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm bg-white placeholder-gray-400"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 20 }} />
            </div>
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <NotificationsOutlinedIcon sx={{ fontSize: 22 }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            aria-label="Help"
          >
            <HelpOutlineIcon sx={{ fontSize: 22 }} />
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            type="button"
            className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-gray-700"
          >
            <AccountCircleIcon sx={{ fontSize: 26 }} className="text-gray-600" />
            <span className="text-xs font-bold text-gray-900 hidden md:inline">Manager Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
