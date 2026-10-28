import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useNotification, useMarkAsRead } from "../../../hooks/useNotification";

const StoreHeader = () => {
  const navigate = useNavigate();
  const { data: notification = [] } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const markAsReadNoti = useMarkAsRead();


  const unreadNotifications = useMemo(() => {
    return (notification || []).filter((noti) => !noti.isRead);
  }, [notification]);

  const openNotification = (targetNotification) => {
    if (!targetNotification.isRead && targetNotification.id) {
      markAsReadNoti.mutate(targetNotification.id);
    }
    setIsNotificationOpen(false);
    if (targetNotification.type === "STORE_APPLICATION") navigate("/admin/sellers");
    else if (targetNotification.type === "ORDER_UPDATE") navigate("/admin/orders");
  }

  const handleOpenNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  }

  return (
    <header className="bg-white border-b border-gray-100 py-2.5 px-6 sm:px-8 sticky top-0 z-30 font-sans">
      <div className="max-w-full mx-auto flex items-center justify-end gap-4">


        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={handleOpenNotification}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer relative"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <NotificationsOutlinedIcon sx={{ fontSize: 20 }} className="text-gray-600" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {unreadNotifications.length > 99 ? "99+" : unreadNotifications.length}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-16 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Thông báo</p>
                  <p className="text-xs text-gray-500">Thông báo hệ thống</p>
                </div>
                {unreadNotifications.length > 0 && (
                  <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
                    {unreadNotifications.length} chưa xem
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notification.length > 0 ? (
                  notification.map((item) => {
                    const keyId = item.id;
                    return (
                      <button
                        key={keyId}
                        type="button"
                        onClick={() => openNotification(item)}
                        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 last:border-b-0 ${item.isRead ? "bg-white" : "bg-indigo-50/60"}`}
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <StorefrontOutlinedIcon sx={{ fontSize: 19 }} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-gray-900">
                              {item.title || "Thông báo"}
                            </span>
                            {!item.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                            {item.message}
                          </span>
                          <span className="mt-1 block text-[11px] text-gray-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-10 text-center text-sm text-gray-500">
                    Chưa có thông báo mới.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Profile Avatar */}
          <div className="cursor-pointer ml-1">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
