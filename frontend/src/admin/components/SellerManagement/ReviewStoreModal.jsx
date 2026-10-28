import React from "react";

const ReviewStoreModal = ({ store, onClose, onApprove, onReject, isApproving, isRejecting }) => {
  if (!store) return null;
  const application = store.raw || {};
  const details = [
    ["Email kinh doanh", application.businessEmail],
    ["Số điện thoại", application.phone],
    ["Loại hình kinh doanh", application.businessType],
    ["Mã số thuế", application.taxCode],
    ["Mô tả gian hàng", application.shopDescription],
    ["Địa chỉ lấy hàng", [application.address, application.city].filter(Boolean).join(", ")],
    ["Số CCCD / hộ chiếu", application.idCardNumber],
    ["Tên file giấy tờ", application.documentFileName],
    ["Ngân hàng", application.bankName],
    ["Chủ tài khoản ngân hàng", application.accountHolder],
    ["Số tài khoản", application.accountNumber],
    ["Email tài khoản", application.userEmail],
  ].filter(([, value]) => value);

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

        <div className="max-h-[55vh] overflow-y-auto py-4 pr-1 text-xs sm:text-sm">
          <div className="grid grid-cols-[minmax(130px,1fr)_2fr] gap-3 py-2 border-b border-gray-50">
            <span className="text-gray-500">Chủ gian hàng:</span>
            <span className="font-semibold text-gray-800">{application.userName || store.owner || "—"}</span>
          </div>
          <div className="grid grid-cols-[minmax(130px,1fr)_2fr] gap-3 py-2 border-b border-gray-50">
            <span className="text-gray-500">Ngành hàng:</span>
            <span className="font-semibold text-gray-800">{application.primaryCategory || store.description || "—"}</span>
          </div>
          <div className="grid grid-cols-[minmax(130px,1fr)_2fr] gap-3 py-2 border-b border-gray-50">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="font-semibold text-amber-600">{application.status || store.status}</span>
          </div>
          {details.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[minmax(130px,1fr)_2fr] gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-500">{label}:</span>
              <span className="break-words font-medium text-gray-800">{value}</span>
            </div>
          ))}
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
