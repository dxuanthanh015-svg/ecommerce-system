import React, { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import StoreSidebar from "./StoreSidebar";
import StoreHeader from "./StoreHeader";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { hasRole, ROLE } from "../../../constants/roles";
import { useMessagingStore } from "../../../store/useMessagingStore";

const StoreManagerLayout = ({ requiredRole = ROLE.STORE_MANAGER }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const hasUnreadMessages = useMessagingStore((state) => (state.unreadByAudience.storeManager || 0) > 0);
  const { data: currentUser, isLoading, isFetching } = useCurrentUser();

  if (isLoading || isFetching) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(currentUser.roles || currentUser.role, requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans antialiased">
      <StoreSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <StoreHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      {!location.pathname.startsWith("/store-manager/messages") && (
        <button type="button" onClick={() => navigate("/store-manager/messages")} aria-label="Message" title="Message" className="fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-indigo-600 px-5 text-white shadow-xl transition hover:scale-105 hover:bg-indigo-700">
          <ForumOutlinedIcon sx={{ fontSize: 25 }} />
          <span className="text-sm font-semibold">Message</span>
          {hasUnreadMessages && <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />}
        </button>
      )}
    </div>
  );
};

export default StoreManagerLayout;
