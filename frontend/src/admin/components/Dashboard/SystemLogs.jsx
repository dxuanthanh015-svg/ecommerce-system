import React, { useState } from "react";
import { useApproveStoreApplication, useRejectStoreApplication } from "../../../hooks/useAdminQuery";

const SystemLogs = ({ logs = [] }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const approveApplication = useApproveStoreApplication();
  const rejectApplication = useRejectStoreApplication();
  const isProcessing = approveApplication.isPending || rejectApplication.isPending;

  // Chỉ lấy logs thực tế từ dữ liệu hệ thống
  const displayLogs = logs.map((l) => ({
    ...l,
    iconType: "application",
    isApplication: true,
  }));

  const handleOpenModal = (app) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    if (isProcessing) return;
    setSelectedApp(null);
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    approveApplication.mutate(selectedApp, {
      onSuccess: () => handleCloseModal(),
    });
  };

  const handleReject = () => {
    if (!selectedApp) return;
    const appId = selectedApp._id || selectedApp.id || selectedApp.storeId;
    rejectApplication.mutate(appId, {
      onSuccess: () => handleCloseModal(),
    });
  };

  const renderIcon = (type) => {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 font-bold text-xs">
        📝
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-2xs h-[330px] flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
        <h4 className="text-base font-bold text-gray-900 tracking-tight">System Logs</h4>
        <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
          {logs.length} pending
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {displayLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 text-gray-400 text-xs text-center px-4">
            <span className="text-xl mb-1">📭</span>
            Chưa có thông báo hoặc đơn chờ duyệt nào
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayLogs.map((l, i) => (
              <div
                key={l.id || i}
                onClick={() => l.application && handleOpenModal(l.application)}
                className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-amber-50/40 cursor-pointer group"
              >
                {renderIcon(l.iconType)}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800 leading-snug truncate group-hover:text-indigo-600">
                    {l.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400">
                      {l.submittedAt || l.time}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-semibold">
                      {l.status || "Pending"}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                  Duyệt →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT ĐƠN ĐĂNG KÝ */}
      {selectedApp && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  Chờ xét duyệt
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1.5">
                  {selectedApp.shopName || selectedApp.storeName || "Chi tiết đơn đăng ký"}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="py-4 space-y-2.5 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
                <span className="text-gray-500">Chủ gian hàng:</span>
                <span className="col-span-2 font-semibold text-gray-800">
                  {selectedApp.applicantName || selectedApp.accountHolder || "Chưa cập nhật"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
                <span className="text-gray-500">Email:</span>
                <span className="col-span-2 font-semibold text-gray-800 break-all">
                  {selectedApp.businessEmail || selectedApp.applicantEmail || "Chưa cập nhật"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
                <span className="text-gray-500">Số điện thoại:</span>
                <span className="col-span-2 font-semibold text-gray-800">{selectedApp.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
                <span className="text-gray-500">Địa chỉ:</span>
                <span className="col-span-2 text-gray-700">{selectedApp.pickupAddress || selectedApp.address || "Chưa cập nhật"}</span>
              </div>
              {selectedApp.bankName && (
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
                  <span className="text-gray-500">Ngân hàng:</span>
                  <span className="col-span-2 text-gray-700">
                    <span className="font-semibold">{selectedApp.bankName}</span> - STK: {selectedApp.accountNumber} ({selectedApp.accountHolder})
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCloseModal}
                className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReject}
                className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs disabled:opacity-50"
              >
                {rejectApplication.isPending ? "Đang xử lý..." : "Từ chối"}
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-xs shadow-xs disabled:opacity-50"
              >
                {approveApplication.isPending ? "Đang duyệt..." : "Duyệt gian hàng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;