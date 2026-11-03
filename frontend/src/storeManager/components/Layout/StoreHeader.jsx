import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationBell from "../../../components/NotificationBell";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useCurrentStore } from "../../../hooks/useStoreQuery";

const StoreHeader = ({ onMenuClick = () => {} }) => {
  const { data: userData } = useCurrentUser();
  const { data: storeData } = useCurrentStore();
  const user = userData || {};
  const currentStore = storeData || {};

  const managerName = currentStore?.owner || `${user?.firstName || 'Store'} ${user?.lastName || 'Manager'}`;
  const avatarUrl = user?.avatarUrl || currentStore?.imageUrl;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8 font-sans">
      <button type="button" onClick={onMenuClick} aria-label="Mở menu" className="shrink-0 rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
        <MenuIcon sx={{ fontSize: 22 }} />
      </button>
      {/* Search Input Box */}
      <div className="relative min-w-0 flex-1 sm:max-w-96">
        <SearchIcon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          sx={{ fontSize: 18 }}
        />
        <input
          type="text"
          placeholder="Tìm đơn hàng, sản phẩm..."
          className="w-full bg-[#f0f3fa] border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 font-normal transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Notification Bell */}
        <NotificationBell audience="storeManager" />

        {/* Help / Support Icon */}
        <button
          type="button"
          className="hidden rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer sm:inline-flex"
          aria-label="Help"
        >
          <HelpOutlineIcon sx={{ fontSize: 22 }} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Account Profile Avatar */}
        <div className="flex items-center gap-2.5 p-1 hover:bg-gray-50 rounded-xl transition-colors">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={managerName}
              className="w-8 h-8 rounded-full object-cover border border-indigo-100 shadow-2xs"
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 28 }} className="text-gray-600" />
          )}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-tight">
              {managerName}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {currentStore.name || "Store Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
