import React from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const RankedProductList = ({ title, metricType = "currency", items = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">{title}</h2>

      <div className="space-y-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50/70 transition-colors"
            >
              {/* Rank */}
              <span className="text-sm font-bold text-gray-300 w-5 text-center shrink-0">
                {index + 1}
              </span>

              {/* Product Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">{item.subLabel}</p>
              </div>

              {/* Metric Value */}
              <div className="shrink-0 text-right">
                {metricType === "currency" ? (
                  <span className="text-sm font-bold text-gray-800">
                    {formatCurrency(item.metricValue)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-bold text-gray-500">
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 16 }}
                      className="text-gray-400"
                    />
                    {formatNumber(item.metricValue)}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">
            No data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RankedProductList;
