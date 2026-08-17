import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Seller Management", path: "/admin/sellers", icon: <InventoryOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "User Management", path: "/admin/users", icon: <AccountCircleIcon sx={{ fontSize: 20 }} /> },
  { name: "Global Categories", path: "/admin/categories", icon: <CampaignOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Platform Financials", path: "/admin/financials", icon: <ShowChartOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "System Settings", path: "/admin/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> }
];

const StoreSidebar = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isSettingPage = location.pathname === "/admin/settings";

  return (
    <aside className="w-64 bg-[#0f1724] text-white min-h-screen flex flex-col justify-between shrink-0 font-sans">
      <div>
        {/* Brand Header */}
        <div onClick={() => navigate('/admin/dashboard')} className="p-6 flex items-center gap-3 cursor-pointer border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">N</div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight leading-none">NexCart Admin</h1>
            <p className="text-[11px] text-white/60 mt-1">Enterprise Suite</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 mt-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${isActive
                  ? "bg-white/8 text-white border-l-4 border-indigo-500 pl-3"
                  : "text-white/70 hover:bg-white/5"
                }`
              }>
              <div className="text-white/90">{item.icon}</div>
              <span className="font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Store Info */}
      {isSettingPage &&
        (<div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <NavLink
              key={"Sign Out"}
              to={"/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-2xs"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                }`
              }
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              <span>Sign Out</span>
            </NavLink>
          </div>
        </div>)
      }

    </aside>
  );
};

export default StoreSidebar;
