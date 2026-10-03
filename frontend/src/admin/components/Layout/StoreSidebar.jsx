import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Seller Management", path: "/admin/sellers", icon: <StorefrontOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "User Management", path: "/admin/users", icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Global Categories", path: "/admin/categories", icon: <CategoryOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Platform Financials", path: "/admin/financials", icon: <PaymentsOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Store Settings", path: "/admin/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
];

const StoreSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#0c1322] text-white min-h-screen flex flex-col justify-between shrink-0 font-sans border-r border-white/5 select-none">
      <div>
        {/* Brand Header */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="p-5 flex items-center gap-3 cursor-pointer border-b border-white/5 hover:bg-white/2 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
            N
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              NexCart Admin
            </h1>
            <p className="text-[11px] text-white/50">Enterprise Suite</p>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-3.5 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/10 text-white shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

    </aside>
  );
};

export default StoreSidebar;
