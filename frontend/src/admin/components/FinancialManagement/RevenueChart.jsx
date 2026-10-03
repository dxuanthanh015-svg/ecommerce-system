import React from "react";

const RevenueChart = ({ data = [] }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Monthly Commission Revenue</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 rounded-lg border border-gray-200 px-3 py-1">
            <button className="font-semibold text-gray-900">6M</button>
            <button className="hover:text-gray-900">1Y</button>
            <button className="hover:text-gray-900">ALL</button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Monthly Commission Revenue</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 rounded-lg border border-gray-200 px-3 py-1">
          <button className="font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">6M</button>
          <button className="hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">1Y</button>
          <button className="hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">ALL</button>
        </div>
      </div>
      <div className="h-64 flex items-end gap-3 px-1">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col justify-end items-center gap-2 min-w-0 h-full">
            <div className="w-full flex flex-col justify-end h-full">
              <div
                className="w-full rounded-t bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 transition-all cursor-pointer"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '1rem' }}
              />
            </div>
            <span className="text-xs text-gray-500 truncate w-full text-center font-medium">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;
