import React from "react";

const ReviewStoreModal = ({ store, onClose, onApprove, onReject, isApproving, isRejecting }) => {
  if (!store) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 relative"
      >
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
              Duyệt hồ sơ gian hàng
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1.5">
              {store.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2.5 text-xs sm:text-sm">
          <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
            <span className="text-gray-500">Chủ gian hàng:</span>
            <span className="col-span-2 font-semibold text-gray-800">
              {store.owner}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
            <span className="text-gray-500">Ngành hàng:</span>
            <span className="col-span-2 font-semibold text-gray-800">
              {store.description}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-50">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="col-span-2 font-semibold text-amber-600">
              {store.status}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={isRejecting}
            className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs disabled:opacity-50 cursor-pointer"
          >
            {isRejecting ? "Đang xử lý..." : "Từ chối"}
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isApproving ? "Đang duyệt..." : "Duyệt gian hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStoreModal;
