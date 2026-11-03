import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import StoreSidebar from "./StoreSidebar";
import StoreHeader from "./StoreHeader";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { hasRole, ROLE } from "../../../constants/roles";

const StoreManagerLayout = ({ requiredRole = ROLE.ADMIN }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: currentUser, isLoading, isFetching } = useCurrentUser();

  if (isLoading || isFetching) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!currentUser || !hasRole(currentUser.roles || currentUser.role, requiredRole)) {
    return <Navigate to="/login" replace />;
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
    </div>
  );
};

export default StoreManagerLayout;
