import React from "react";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs h-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Global Revenue Trend</h3>
        <div className="text-xs text-gray-500">1W  ·  1M  ·  1Y</div>
      </div>

      <div className="mt-4 h-[220px] flex items-end gap-3">
        {data.length === 0 && (
          <div className="text-sm text-gray-400">No chart data</div>
        )}
        {data.map((bar, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <div
              className="w-full bg-gray-300 rounded-t-lg transition-all"
              style={{ height: `${bar.value}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
