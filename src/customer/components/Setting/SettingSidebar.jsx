import React from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SettingSidebar = ({ activeTab, setActiveTab, userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login");
  };

  return (
    <div className="w-full lg:w-72 bg-[#f0f4fc]/80 rounded-3xl p-5 border border-indigo-50/80 shrink-0 flex flex-col justify-between self-start">
      <div className="space-y-6">
        {/* User Info Badge */}
        <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-indigo-50 shrink-0 border border-indigo-100">
            <img
              src={userData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-extrabold text-gray-900 truncate">
              {userData.firstName || "Premium"} {userData.lastName || "Member"}
            </h3>
            <p className="text-[11px] text-gray-500 truncate">
              {userData.email || "nexcart.user@example.com"}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {/* Profile */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              }`}
          >
            <PersonOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Profile</span>
          </button>

          {/* Orders */}
          <button
            type="button"
            onClick={() => navigate("/account/order")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === "orders"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              }`}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
            <span>Orders</span>
          </button>

          {/* Addresses */}
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === "addresses"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              }`}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Addresses</span>
          </button>

          {/* Security */}
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              }`}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Security</span>
          </button>
        </nav>
      </div>

      {/* Bottom Logout Divider & Action */}
      <div className="pt-6 mt-6 border-t border-indigo-100/60">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingSidebar;
