import React, { useState } from "react";
import { toast } from "react-hot-toast";

const NewStoreModal = ({ isOpen, onClose, onCreateStore }) => {
  const [form, setForm] = useState({
    name: "",
    category: "Fashion & Apparel",
    owner: "",
    email: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên gian hàng");
      return;
    }
    if (onCreateStore) {
      onCreateStore(form);
    } else {
      toast.success(`Đã tạo gian hàng "${form.name}" thành công!`);
    }
    onClose();
    setForm({
      name: "",
      category: "Fashion & Apparel",
      owner: "",
      email: "",
      phone: "",
      address: "",
    });
  };

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
          <h3 className="text-base font-bold text-gray-900">Thêm mới Store</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên gian hàng *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Aura Minimalist Goods"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Ngành hàng
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option>Fashion & Apparel</option>
              <option>Electronics</option>
              <option>Home & Garden</option>
              <option>Footwear & Shoes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên chủ gian hàng
            </label>
            <input
              type="text"
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white font-semibold text-xs shadow-xs cursor-pointer"
            >
              Tạo gian hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStoreModal;
