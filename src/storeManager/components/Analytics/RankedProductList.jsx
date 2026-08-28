import React from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const RankedProductList = ({
  title,
  metricType = "currency",
  items = [],
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">{title}</h2>

      <div className="space-y-1.5">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 px-2.5 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              {/* Rank Number */}
              <span className="text-xs sm:text-sm font-bold text-slate-300 w-4 text-center shrink-0">
                {index + 1}
              </span>

              {/* Product Thumbnail */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-100"
              />

              {/* Title & SubLabel */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {item.subLabel}
                </p>
              </div>

              {/* Metric Value */}
              <div className="shrink-0 text-right">
                {metricType === "currency" ? (
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {formatCurrency(item.metricValue)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700">
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 16, color: "#94a3b8" }}
                    />
                    <span>{formatNumber(item.metricValue)}</span>
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 text-xs sm:text-sm py-8">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RankedProductList;
