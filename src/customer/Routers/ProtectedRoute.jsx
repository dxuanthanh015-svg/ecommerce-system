import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useAuthQuery";

const ProtectedRoute = () => {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return null; // Đang kiểm tra phiên đăng nhập từ Cache / Server
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
