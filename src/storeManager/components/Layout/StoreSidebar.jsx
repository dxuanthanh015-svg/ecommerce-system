import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
  {
    name: "Dashboard",
    path: "/store-manager/dashboard",
    icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
  },
  {
    name: "Product Management",
    path: "/store-manager/products",
    icon: <InventoryOutlinedIcon sx={{ fontSize: 20 }} />
  },
  {
    name: "Order Management",
    path: "/store-manager/orders",
    icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
  },
  {
    name: "Promotions",
    path: "/store-manager/promotions",
    icon: <CampaignOutlinedIcon sx={{ fontSize: 20 }} />
  },
  {
    name: "Analytics",
    path: "/store-manager/analytics",
    icon: <ShowChartOutlinedIcon sx={{ fontSize: 20 }} />
  },
  {
    name: "Store Settings",
    path: "/store-manager/settings",
    icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
  }
];

const StoreSidebar = () => {
  const navigate = useNavigate();
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("currentStore");
    localStorage.removeItem("currentProducts");
    localStorage.removeItem("orderRevenue");
    navigate("/login");
  };

  const shopName = currentStore.name || "My Store";
  const shopInitial = shopName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/store-manager/dashboard')}
          className="p-5 flex items-center gap-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
        >
          {currentStore.imageUrl ? (
            <img
              src={currentStore.imageUrl}
              alt={shopName}
              className="w-10 h-10 rounded-xl object-cover border border-indigo-100 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              {shopInitial}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight leading-tight truncate">
              {shopName}
            </h1>
            <p className="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
              {currentStore.category || "Store Manager"}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 mt-1">
          {menuItems.map((item) => ( 
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Store Info & Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {currentStore.id && (
          <button
            type="button"
            onClick={() => navigate(`/store/${currentStore.id}`)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <span>View Public Store</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default StoreSidebar;
