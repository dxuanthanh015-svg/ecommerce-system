import React from "react";
import { useNavigate } from "react-router-dom";

const defaultLowStockItems = [
  { id: 1, name: "Matte Ceramic Mug", sku: "HM-092", count: 4 },
  { id: 2, name: "Wire Desk Organizer", sku: "OF-114", count: 2 },
  { id: 3, name: "Minimalist Desk Lamp", sku: "DL-201", count: 3 },
];

const LowStockAlertsCard = ({ items = defaultLowStockItems }) => {
  const navigate = useNavigate();

  const handleGenerateRestock = () => {
    alert("Đã tạo yêu cầu nhập bổ sung kho thành công!");
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Low Stock Alerts
            </h3>
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-[11px] font-black flex items-center justify-center">
              {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/store-manager/products")}
            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Low Stock Items List */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.id || item.sku}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100/80 hover:bg-gray-100/60 transition-colors"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 leading-snug">
                  {item.name || item.title}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  SKU: {item.sku || `SKU-${item.id}`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-black text-rose-600 block">
                  {item.count || item.stock || 2}
                </span>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                  left
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Button */}
      <button
        type="button"
        onClick={handleGenerateRestock}
        className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-2xs"
      >
        Generate Restock Order
      </button>
    </div>
  );
};

export default LowStockAlertsCard;
