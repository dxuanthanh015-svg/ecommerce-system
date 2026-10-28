import React, { useState } from "react";
import { useCurrentUser } from "../../hooks/useAuthQuery";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";

const AdminSettingsPage = () => {
  const { data: admin } = useCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSaving(true);
    try {
      await adminService.updateAdminPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Đã đổi mật khẩu admin. Mật khẩu mới dùng được ngay ở trang đăng nhập.");
    } catch (error) {
      toast.error(error.message || "Không thể đổi mật khẩu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Quản lý thông tin đăng nhập của tài khoản quản trị cố định.</p>
      </header>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-gray-100 pb-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tài khoản</div>
          <div className="mt-1 font-semibold text-gray-900">{admin?.email || "Admin"}</div>
          <p className="mt-2 text-xs text-gray-500">Email tài khoản được cố định trong cấu hình backend; bạn có thể đổi mật khẩu tại đây.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Mật khẩu hiện tại</span>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Mật khẩu mới</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="mt-1 block text-xs text-gray-500">Ít nhất 8 ký tự.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Nhập lại mật khẩu mới</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Đang lưu..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminSettingsPage;
