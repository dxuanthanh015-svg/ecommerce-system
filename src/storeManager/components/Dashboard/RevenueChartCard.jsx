import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const defaultRevenueData = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 55 },
  { day: "Wed", value: 40 },
  { day: "Thu", value: 65 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 80 },
  { day: "Sun", value: 95 },
];

const RevenueChartCard = ({ chartData = defaultRevenueData }) => {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const maxValue = Math.max(...chartData.map((d) => d.value), 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      {/* Header & Filter Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Revenue Overview
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Weekly sales performance breakdown
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f4f6fc] border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span>{timeRange}</span>
          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Bar Chart Graphics Container */}
      <div className="bg-[#f0f3fa]/70 rounded-2xl p-6 min-h-[220px] flex items-end justify-between gap-3 sm:gap-6 border border-gray-100">
        {chartData.map((item, idx) => {
          const heightPercent = Math.max(15, Math.round((item.value / maxValue) * 100));
          const isHighest = heightPercent > 70;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              {/* Tooltip value on hover */}
              <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                ${item.value * 25}
              </span>

              {/* Column Bar */}
              <div className="w-full bg-indigo-100/80 rounded-t-xl overflow-hidden flex items-end h-[160px]">
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 group-hover:bg-indigo-600 ${
                    isHighest ? "bg-indigo-500" : "bg-indigo-300"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChartCard;
