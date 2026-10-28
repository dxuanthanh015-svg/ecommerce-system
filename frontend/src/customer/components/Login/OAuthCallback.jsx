// src/pages/OAuthCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoginWithGoogleMutation } from "../../../hooks/useAuthQuery";
import toast from "react-hot-toast";
import { hasRole, ROLE } from "../../../constants/roles";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCalled = useRef(false);

  const { mutate, isPending } = useLoginWithGoogleMutation();

  useEffect(() => {
    // Chặn StrictMode gọi 2 lần - isCalled chặn code bị submit 2 lần
    if (isCalled.current) return;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Đăng nhập Google bị hủy hoặc gặp lỗi!");
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      toast.error("Không nhận được mã xác thực từ Google!");
      navigate("/login", { replace: true });
      return;
    }

    isCalled.current = true;

    mutate(code, {
      onSuccess: (user) => {
        toast.success("Đăng nhập Google thành công!");
        const roles = user?.roles || user?.role;
        navigate(hasRole(roles, ROLE.ADMIN) ? "/admin/dashboard" : "/", { replace: true });
      },
      onError: (err) => {
        console.error("[OAuthCallback] Lỗi xác thực Google:", err?.message);
        toast.error(err?.message || "Xác thực tài khoản thất bại!");
        navigate("/login", { replace: true });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chạy đúng 1 lần khi mount - KHÔNG thêm deps để tránh StrictMode bug

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-600 font-medium">
        {isPending ? "Đang xác thực với hệ thống..." : "Đang xử lý..."}
      </p>
    </div>
  );
};

export default OAuthCallback;