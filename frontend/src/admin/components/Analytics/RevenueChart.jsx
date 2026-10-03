import React, { useState, useMemo } from "react";

const COLORS = {
  netRevenue: "#34d399",
  platformFees: "#fda4af",
};

const PADDING = { top: 16, right: 20, bottom: 40, left: 20 };
const SVG_WIDTH = 700;
const SVG_HEIGHT = 280;
const INNER_W = SVG_WIDTH - PADDING.left - PADDING.right;
const INNER_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;

const RevenueChart = ({
  title,
  series = [],
  activeRange,
  rangeOptions = [],
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState(activeRange);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
    onRangeChange?.(range);
  };

  const chartData = useMemo(() => {
    if (!series.length) return { bars: [], gridLines: [] };

    const maxTotal = Math.max(...series.map((d) => d.netRevenue + d.platformFees));
    const barCount = series.length;
    const gap = 28;
    const barWidth = Math.min(56, (INNER_W - gap * (barCount + 1)) / barCount);
    const totalBarsWidth = barCount * barWidth + (barCount - 1) * gap;
    const startX = PADDING.left + (INNER_W - totalBarsWidth) / 2;
    const chartBottom = PADDING.top + INNER_H;

    const bars = series.map((d, i) => {
      const total = d.netRevenue + d.platformFees;
      const totalH = (total / maxTotal) * INNER_H;
      const revH = (d.netRevenue / maxTotal) * INNER_H;
      const feeH = (d.platformFees / maxTotal) * INNER_H;
      const x = startX + i * (barWidth + gap);
      const topY = chartBottom - totalH;

      return {
        month: d.month,
        x,
        topY,
        width: barWidth,
        totalH,
        feeRect: { y: topY, h: feeH },
        revRect: { y: topY + feeH, h: revH },
      };
    });

    // 4 horizontal grid lines
    const gridLines = [0.25, 0.5, 0.75, 1].map((frac) => ({
      y: chartBottom - INNER_H * frac,
    }));

    return { bars, gridLines };
  }, [series]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {selectedRange}
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
              {rangeOptions.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleRangeSelect(range)}
                  className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                    range === selectedRange
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: COLORS.netRevenue }}
          />
          <span className="text-xs text-gray-500 font-medium">Net Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: COLORS.platformFees }}
          />
          <span className="text-xs text-gray-500 font-medium">Platform Fees</span>
        </div>
      </div>

      {/* SVG Chart */}
      {series.length > 0 ? (
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {chartData.bars.map((bar, i) => (
              <clipPath key={i} id={`analytics-bar-clip-${i}`}>
                <rect
                  x={bar.x}
                  y={bar.topY}
                  width={bar.width}
                  height={bar.totalH}
                  rx={7}
                />
              </clipPath>
            ))}
          </defs>

          {/* Grid lines */}
          {chartData.gridLines.map((line, i) => (
            <line
              key={i}
              x1={PADDING.left}
              y1={line.y}
              x2={SVG_WIDTH - PADDING.right}
              y2={line.y}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
          ))}

          {/* Baseline */}
          <line
            x1={PADDING.left}
            y1={PADDING.top + INNER_H}
            x2={SVG_WIDTH - PADDING.right}
            y2={PADDING.top + INNER_H}
            stroke="#e2e8f0"
            strokeWidth={1}
          />

          {/* Bars */}
          {chartData.bars.map((bar, i) => (
            <g key={i}>
              <g clipPath={`url(#analytics-bar-clip-${i})`}>
                {/* Platform Fees — top segment */}
                <rect
                  x={bar.x}
                  y={bar.feeRect.y}
                  width={bar.width}
                  height={bar.feeRect.h}
                  fill={COLORS.platformFees}
                />
                {/* Net Revenue — bottom segment */}
                <rect
                  x={bar.x}
                  y={bar.revRect.y}
                  width={bar.width}
                  height={bar.revRect.h}
                  fill={COLORS.netRevenue}
                />
              </g>

              {/* Month label */}
              <text
                x={bar.x + bar.width / 2}
                y={SVG_HEIGHT - 8}
                textAnchor="middle"
                fill="#94a3b8"
                style={{ fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}
              >
                {bar.month}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No chart data available.
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
