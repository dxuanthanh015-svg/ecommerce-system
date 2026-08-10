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

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/store-manager/dashboard')}
          className="p-6 flex items-center gap-3 cursor-pointer border-b border-gray-50"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
            N
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-900 tracking-tight leading-none">
              NexCart
            </h1>
            <p className="text-[11px] font-semibold text-gray-400 mt-1">
              Store Manager
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 mt-2">
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

      {/* Footer Store Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <NavLink
              key={"Sign Out"}
              to={"/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                }`
              }
            >
              <LogoutIcon sx={{ fontSize: 20 }}/>
              <span>Sign Out</span>
            </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default StoreSidebar;
