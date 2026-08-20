import React, { useState, useMemo } from "react";
import { Select } from "antd";

const MOCK_DATA_BY_RANGE = {
  last7days: [
    { label: "Mon", value: 35 },
    { label: "Tue", value: 55 },
    { label: "Wed", value: 40 },
    { label: "Thu", value: 65 },
    { label: "Fri", value: 45 },
    { label: "Sat", value: 80 },
    { label: "Sun", value: 95 },
  ],
  last30days: [
    { label: "Day 1-5", value: 120 },
    { label: "Day 6-10", value: 210 },
    { label: "Day 11-15", value: 180 },
    { label: "Day 16-20", value: 310 },
    { label: "Day 21-25", value: 250 },
    { label: "Day 26-30", value: 400 },
  ],
  thismonth: [
    { label: "Week 1", value: 450 },
    { label: "Week 2", value: 620 },
    { label: "Week 3", value: 390 },
    { label: "Week 4", value: 810 },
  ],
  thisyear: [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1900 },
    { label: "Mar", value: 1500 },
    { label: "Apr", value: 2200 },
    { label: "May", value: 2800 },
    { label: "Jun", value: 2600 },
    { label: "Jul", value: 3100 },
    { label: "Aug", value: 2900 },
    { label: "Sep", value: 3500 },
    { label: "Oct", value: 3800 },
    { label: "Nov", value: 4200 },
    { label: "Dec", value: 5000 },
  ],
};

const RevenueChartCard = ({ customData }) => {
  const [timeRange, setTimeRange] = useState("last7days");
  const activeChartData = useMemo(() => {
    if (customData && customData[timeRange]) {
      return customData[timeRange];
    }
    return MOCK_DATA_BY_RANGE[timeRange] || MOCK_DATA_BY_RANGE.last7days;
  }, [timeRange, customData]);

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
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              {/* Tooltip value on hover */}
              <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                ${item.value}
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
    </div>
  );
};

export default RevenueChartCard;
