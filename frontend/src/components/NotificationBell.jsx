import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import toast from "react-hot-toast";
import { useNotification, useMarkAsRead } from "../hooks/useNotification";
import { useAuthStore } from "../store/useAuthStore";

const NotificationBell = ({ audience = "customer" }) => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: notifications = [], isSuccess } = useNotification(audience);
  const markAsRead = useMarkAsRead();
  const [open, setOpen] = useState(false);
  const seenNotifications = useRef({ userId: null, ids: new Set() });
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const openNotification = useCallback((item) => {
    if (!item.isRead && item.id) markAsRead.mutate(item.id);
    setOpen(false);
    if (item.type === "ORDER_UPDATE") {
      if (audience === "customer") navigate(`/account/order/${item.referenceId}`);
      else if (audience === "storeManager") navigate("/store-manager/orders");
      else navigate("/admin/orders");
    } else if (item.type === "STORE_ORDER_NEW" || item.type === "STORE_ORDER_UPDATE") {
      navigate("/store-manager/orders");
    } else if (item.type === "STORE_APPLICATION" && audience === "admin") {
      navigate("/admin/sellers");
    } else if (item.type === "STORE_APPLICATION_APPROVED" && audience === "customer") {
      navigate("/store-manager/dashboard");
    }
  }, [audience, markAsRead, navigate]);

  useEffect(() => {
    if (!isSuccess || !userId) return;
    const currentIds = new Set(notifications.map((item) => item.id).filter(Boolean));
    if (seenNotifications.current.userId !== userId) {
      seenNotifications.current = { userId, ids: currentIds };
      return;
    }

    const newNotifications = notifications.filter(
      (item) => item.id && !seenNotifications.current.ids.has(item.id)
    );
    seenNotifications.current.ids = new Set([...seenNotifications.current.ids, ...currentIds]);

    newNotifications.slice(0, 3).reverse().forEach((item) => {
      toast.custom((toastItem) => (
        <button
          type="button"
          onClick={() => {
            toast.dismiss(toastItem.id);
            openNotification(item);
          }}
          className="w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-indigo-100 bg-white p-4 text-left shadow-xl transition hover:border-indigo-300"
        >
          <span className="block text-sm font-bold text-gray-900">{item.title || "Thông báo mới"}</span>
          <span className="mt-1 block text-xs leading-5 text-gray-600">{item.message}</span>
          <span className="mt-2 block text-[11px] font-semibold text-indigo-600">Bấm để xem chi tiết</span>
        </button>
      ), { duration: 5500, id: `notification-toast-${item.id}` });
    });
  }, [isSuccess, notifications, openNotification, userId]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-indigo-600"
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <NotificationsOutlinedIcon sx={{ fontSize: 22 }} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-semibold text-gray-900">Thông báo</span>
            {unreadCount > 0 && <span className="text-xs font-medium text-indigo-600">{unreadCount} chưa đọc</span>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length ? notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openNotification(item)}
                className={`block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50 ${item.isRead ? "bg-white" : "bg-indigo-50/60"}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900">{item.title || "Thông báo"}</span>
                  {!item.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                </span>
                <span className="mt-1 block text-xs leading-5 text-gray-600">{item.message}</span>
                <span className="mt-1 block text-[11px] text-gray-400">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                </span>
              </button>
            )) : <div className="px-4 py-10 text-center text-sm text-gray-500">Chưa có thông báo.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
