import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import CloseIcon from "@mui/icons-material/Close";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Seller Management", path: "/admin/sellers", icon: <StorefrontOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "User Management", path: "/admin/users", icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Orders", path: "/admin/orders", icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Promotions", path: "/admin/promotions", icon: <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Analytics", path: "/admin/analytics", icon: <QueryStatsOutlinedIcon sx={{ fontSize: 20 }} /> },
  { name: "Admin Account", path: "/admin/settings", icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
];

const StoreSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <button type="button" aria-label="Đóng menu" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex min-h-screen max-h-screen w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-white/5 bg-[#0c1322] font-sans text-white transition-transform duration-200 select-none lg:static lg:z-auto lg:min-h-screen lg:max-h-none lg:w-64 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div>
        {/* Brand Header */}
        <div
          onClick={() => { navigate("/admin/dashboard"); onClose(); }}
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
          <button type="button" onClick={(event) => { event.stopPropagation(); onClose(); }} aria-label="Đóng menu" className="ml-auto rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden">
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-3.5 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
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
    </>
  );
};

export default StoreSidebar;
