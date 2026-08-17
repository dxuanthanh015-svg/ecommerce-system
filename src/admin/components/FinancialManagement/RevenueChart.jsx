import React from "react";

const RevenueChart = ({ data = [] }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Monthly Commission Revenue</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 rounded-lg border px-3 py-1">
          <button className="font-semibold">6M</button>
          <button>1Y</button>
          <button>ALL</button>
        </div>
      </div>
      <div className="h-64 flex items-end gap-3 px-1">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col justify-end items-center gap-2 min-w-0 h-full">
            <div className="w-full flex flex-col justify-end h-full">
              <div
                className="w-full rounded-t bg-gradient-to-t from-[#4338ca] to-[#818cf8]"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '1rem' }}
              />
            </div>
            <span className="text-xs text-gray-500 truncate w-full text-center">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
