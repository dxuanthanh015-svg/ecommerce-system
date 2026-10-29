import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useAuthQuery";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = () => {
  const { data: currentUser, isLoading, isError, refetch } = useCurrentUser();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return null; // Đang kiểm tra phiên đăng nhập từ Cache / Server
  }

  // A server/Redis failure is not proof that the user's session expired.
  if (isError && isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[40vh] max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-gray-700">Không kiểm tra được phiên đăng nhập do máy chủ đang lỗi.</p>
        <button type="button" onClick={() => refetch()} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
          Thử kết nối lại
        </button>
      </main>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
