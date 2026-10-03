import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import StoreSidebar from "./StoreSidebar";
import StoreHeader from "./StoreHeader";
import { useCurrentUser } from "../../../hooks/useAuthQuery";

const StoreManagerLayout = () => {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return null; // Đang kiểm tra phiên đăng nhập từ Cache / Server
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
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
