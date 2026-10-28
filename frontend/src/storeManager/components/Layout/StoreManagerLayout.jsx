import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import StoreSidebar from "./StoreSidebar";
import StoreHeader from "./StoreHeader";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { hasRole, ROLE } from "../../../constants/roles";

const StoreManagerLayout = ({ requiredRole = ROLE.STORE_MANAGER }) => {
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
      <StoreSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <StoreHeader />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StoreManagerLayout;
