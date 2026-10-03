import React from "react";

const EditStoreModal = ({ store, onClose }) => {
  if (!store) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Chi tiết: {store.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Chủ cửa hàng:</span>
            <span className="font-semibold text-gray-800">{store.owner}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Ngành hàng:</span>
            <span className="font-semibold text-gray-800">{store.description}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Doanh thu GMV:</span>
            <span className="font-semibold text-gray-800">{store.gmv}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Ngày tham gia:</span>
            <span className="font-semibold text-gray-800">{store.joined}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="font-bold text-gray-900">{store.status}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoreModal;
