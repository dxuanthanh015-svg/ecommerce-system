import React, { useState } from "react";

const RevenueChart = ({ revenueChartData = {}, data = [] }) => {
  const [activeRange, setActiveRange] = useState("1W");

  // Lấy dữ liệu thực tế theo filter
  const getActiveData = () => {
    if (revenueChartData && typeof revenueChartData === "object" && !Array.isArray(revenueChartData)) {
      if (activeRange === "1W") return revenueChartData.last7days || [];
      if (activeRange === "1M") return revenueChartData.thismonth || revenueChartData.last30days || [];
      if (activeRange === "1Y") return revenueChartData.thisyear || [];
    }
    if (Array.isArray(data) && data.length > 0) return data;
    return [];
  };

  const chartBars = getActiveData();

  // Tính chiều cao tương đối dựa trên giá trị lớn nhất
  const maxValue = chartBars.length > 0 ? Math.max(...chartBars.map((b) => b.value || 0), 1) : 100;

  // Format y-axis labels dựa trên maxValue
  const getYAxisLabels = (max) => {
    if (max >= 1000000) {
      const step = max / 5;
      return [max, max - step, max - step * 2, max - step * 3, max - step * 4, 0].map(
        (v) => (v === 0 ? "0" : `$${(v / 1000000).toFixed(1)}M`)
      );
    }
    if (max >= 1000) {
      const step = max / 5;
      return [max, max - step, max - step * 2, max - step * 3, max - step * 4, 0].map(
        (v) => (v === 0 ? "0" : `$${(v / 1000).toFixed(1)}k`)
      );
    }
    const step = Math.max(Math.ceil(max / 5), 1);
    return [step * 5, step * 4, step * 3, step * 2, step, 0].map(
      (v) => (v === 0 ? "0" : `$${v}`)
    );
  };

  const yLabels = getYAxisLabels(maxValue);

  // Monochrome gradient chuyển dần từ xám nhạt sang đen
  const getBarColor = (idx, total) => {
    if (total <= 1) return "#000000";
    const ratio = idx / (total - 1);
    if (ratio < 0.2) return "#d1d5db";
    if (ratio < 0.4) return "#cbd5e1";
    if (ratio < 0.6) return "#94a3b8";
    if (ratio < 0.8) return "#64748b";
    if (ratio < 0.95) return "#334155";
    return "#000000";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-2xs h-[330px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">Global Revenue Trend</h3>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1 text-xs font-semibold">
          {[
            { key: "1W", label: "1W" },
            { key: "1M", label: "1M" },
            { key: "1Y", label: "1Y" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveRange(item.key)}
              className={`px-2.5 py-1 rounded transition-colors ${activeRange === item.key
                ? "bg-gray-100 text-gray-900 font-bold"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      {chartBars.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-400 gap-1.5">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Chưa có dữ liệu biểu đồ</span>
        </div>
      ) : (
        <div className="relative mt-3 flex-1 flex flex-col justify-between">
          {/* Main Chart Area: Y-Axis + Bars & Grid */}
          <div className="relative flex-1 flex min-h-[195px]">
            {/* Y-axis Labels */}
            <div className="flex flex-col justify-between text-[11px] font-medium text-gray-400 pr-3 select-none text-right min-w-[42px] py-0.5">
              {yLabels.map((lbl, idx) => (
                <span key={idx} className="leading-none">{lbl}</span>
              ))}
            </div>

            {/* Grid & Bars Container */}
            <div className="relative flex-1 flex flex-col justify-between border-b border-gray-300">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-gray-100 w-full" />
                <div className="border-b border-gray-100 w-full" />
                <div className="border-b border-gray-100 w-full" />
                <div className="border-b border-gray-100 w-full" />
                <div className="border-b border-gray-100 w-full" />
              </div>

              {/*Bars*/}
              <div className="relative z-10 w-full h-full flex items-end justify-around px-2 gap-1 sm:gap-2">
                {chartBars.map((bar, idx) => {
                  const heightPercent = bar.value > 0
                    ? Math.max(Math.round((bar.value / maxValue) * 90), 4)
                    : 0;
                  return (
                    <div
                      key={idx}
                      className="h-full flex-1 flex items-end justify-center max-w-[52px] group relative"
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {bar.label}: ${bar.value?.toLocaleString() || 0}
                      </div>

                      {/* Cột Bar */}
                      <div
                        className="w-full transition-all duration-300 rounded-t-[2px]"
                        style={{
                          height: `${heightPercent > 0 ? heightPercent : 1}%`,
                          backgroundColor: bar.value > 0 ? getBarColor(idx, chartBars.length) : "#e2e8f0",
                          minHeight: bar.value > 0 ? "4px" : "2px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-axis Category Labels (dưới cái gạch) */}
          <div className="flex pt-2 pb-0.5">
            {/* Spacer khớp chiều rộng của trục Y */}
            <div className="min-w-[42px] pr-3 select-none" />

            {/* Danh mục dưới từng cột */}
            <div className="flex-1 flex items-center justify-around px-2 gap-1 sm:gap-2">
              {chartBars.map((bar, idx) => (
                <div key={idx} className="flex-1 max-w-[52px] text-center">
                  <span className="text-[11px] text-gray-400 font-medium block truncate">
                    {bar.label || ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
