import React, { useState, useMemo } from "react";
import { Select } from "antd";
import { formatVnd } from "../../../utils/currency";

const RevenueChartCard = ({ customData, isLoading = false, isError = false, error, onRetry }) => {
  const [timeRange, setTimeRange] = useState("last7days");
  const activeChartData = useMemo(
    () => (Array.isArray(customData?.[timeRange]) ? customData[timeRange] : []),
    [timeRange, customData],
  );

  const maxValue = useMemo(() => {
    const max = Math.max(...activeChartData.map((d) => d.value), 100);
    return max;
  }, [activeChartData]);

  return (
    <div className="bg-white rounded-md p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      {/* Header & Filter Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight ">
            Revenue Overview
          </h1>
          <h2 className="text-md text-gray-700 font-bold mt-0.5">
            {timeRange === "thisyear"
              ? "Yearly sales performance breakdown"
              : timeRange === "thismonth" || timeRange === "last30days"
                ? "Monthly sales performance breakdown"
                : "Weekly sales performance breakdown"}
          </h2>
        </div>

        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f4f6fc] border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          options={[
            { value: 'last7days', label: 'Last 7 Days' },
            { value: 'last30days', label: 'Last 30 Days' },
            { value: 'thismonth', label: 'This Month' },
            { value: 'thisyear', label: 'This Year' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="min-h-[400px] rounded-md border border-gray-100 bg-[#f0f3fa]/70 flex items-center justify-center text-sm text-gray-500">
          Loading revenue data...
        </div>
      ) : isError ? (
        <div className="min-h-[400px] rounded-md border border-rose-100 bg-rose-50/50 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm font-semibold text-rose-700">
            {error?.response?.data?.message || "Không tải được dữ liệu doanh thu."}
          </p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100">
              Thử lại
            </button>
          )}
        </div>
      ) : activeChartData.length === 0 ? (
        <div className="min-h-[400px] rounded-md border border-gray-100 bg-[#f0f3fa]/70 flex items-center justify-center text-sm text-gray-500">
          Chưa có dữ liệu doanh thu trong khoảng thời gian này.
        </div>
      ) : (
      <div className="bg-[#f0f3fa]/70 rounded-md p-6 min-h-[400px] flex items-end justify-between gap-3 sm:gap-6 border border-gray-100">
        {activeChartData.map((item, idx) => {
          const heightPercent = Math.max(10, Math.round((item.value / maxValue) * 100));
          const isHighest = heightPercent > 70;
          const isHigh = heightPercent > 50 && heightPercent <= 70;
          const isMedium = heightPercent > 30 && heightPercent <= 50;
          const isLow = heightPercent <= 30;
          return (
            <div
              key={idx}
              tabIndex={0}
              aria-label={`${item.label}: ${formatVnd(item.value)}`}
              className="relative z-0 flex-1 flex flex-col items-center gap-2 group h-full justify-end outline-none hover:z-50 focus-visible:z-50"
            >
              {/* Tooltip value on hover */}
              <span className="pointer-events-none absolute left-1/2 top-0 z-[60] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="block text-slate-300">{item.label}</span>
                <span className="mt-0.5 block">{formatVnd(item.value)}</span>
              </span>

              {/* Column Bar */}
              <div className="w-full bg-[#e1def9] rounded-t-sm overflow-hidden flex items-end h-full">
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 group-hover:bg-indigo-600 ${isHighest ? "bg-indigo-500" : isHigh ? "bg-indigo-400" : isMedium ? "bg-indigo-300" : isLow ? "bg-indigo-200" : "bg-indigo-100"
                    }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default RevenueChartCard;
