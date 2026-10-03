import React, { useState, useMemo } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const COLORS = {
  netRevenue: "#52c8a2",
  platformFees: "#d67a84",
};

const PADDING = { top: 20, right: 24, bottom: 44, left: 24 };
const SVG_WIDTH = 800;
const SVG_HEIGHT = 290;
const INNER_W = SVG_WIDTH - PADDING.left - PADDING.right;
const INNER_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;



const RevenueChart = ({
  title = "Revenue vs Fees Breakdown",
  activeRange = "Last 6 Months",
  rangeOptions = ["Last 6 Months", "Last 12 Months", "Year to Date"],
  onRangeChange,
  series: seriesProp = [], // Nhận series từ component cha
}) => {
  const [selectedRange, setSelectedRange] = useState(activeRange);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
    onRangeChange?.(range);
  };

  const series = useMemo(() => {
    console.log('[RevenueChart] Processing series prop:', seriesProp);
    
    // Nếu không có series prop, trả về mảng rỗng
    if (!seriesProp || seriesProp.length === 0) {
      console.log('[RevenueChart] No series data available');
      return [];
    }

    // Format từ analytics.utils.js: [{ name: 'Gross Revenue', data: [...] }, { name: 'Net Revenue', data: [...] }]
    const grossSeries = seriesProp.find(s => s.name === 'Gross Revenue')?.data || [];
    const netSeries = seriesProp.find(s => s.name === 'Net Revenue')?.data || [];
    
    console.log('[RevenueChart] Gross series:', grossSeries);
    console.log('[RevenueChart] Net series:', netSeries);

    // Tạo labels tháng dựa trên activeRange (đồng bộ với analytics.utils.js)
    const now = new Date();
    let labels = [];
    
    if (activeRange === "Year to Date") {
      // Từ tháng 1 đến tháng hiện tại
      for (let i = 0; i < now.getMonth() + 1; i++) {
        const d = new Date(now.getFullYear(), i, 1);
        labels.push(d.toLocaleString("en-US", { month: "short" }));
      }
    } else if (activeRange === "Last 6 Months") {
      // 6 tháng gần nhất
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleString("en-US", { month: "short" }));
      }
    } else if (activeRange === "Last 12 Months") {
      // 12 tháng gần nhất
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleString("en-US", { month: "short" }));
      }
    } else {
      // Mặc định: dùng số lượng data point từ series
      labels = grossSeries.map((_, i) => `Month ${i + 1}`);
    }

    // Map data sang format cho chart
    return grossSeries.map((gross, index) => {
      const net = netSeries[index] || 0;
      const platformFees = gross - net;
      const label = labels[index] || `Month ${index + 1}`;
      
      return {
        month: label,
        netRevenue: net,
        platformFees: platformFees,
        grossRevenue: gross,
      };
    });
  }, [seriesProp, activeRange])

  const chartData = useMemo(() => {
    const maxTotal = Math.max(
      ...series.map((d) => (Number(d.netRevenue) || 0) + (Number(d.platformFees) || 0)),
      1
    );

    const barCount = series.length;
    const gap = 32;
    const barWidth = Math.min(64, (INNER_W - gap * (barCount + 1)) / barCount);
    const totalBarsWidth = barCount * barWidth + (barCount - 1) * gap;
    const startX = PADDING.left + (INNER_W - totalBarsWidth) / 2;
    const chartBottom = PADDING.top + INNER_H;

    const bars = series.map((d, i) => {
      const net = Number(d.netRevenue) || 0;
      const fee = Number(d.platformFees) || 0;
      const total = net + fee;
      const totalH = (total / maxTotal) * INNER_H;
      const revH = (net / maxTotal) * INNER_H;
      const feeH = (fee / maxTotal) * INNER_H;
      const x = startX + i * (barWidth + gap);
      const topY = chartBottom - totalH;

      return {
        month: d.month,
        net,
        fee,
        total,
        x,
        topY,
        width: barWidth,
        totalH,
        feeRect: { y: topY, h: feeH },
        revRect: { y: topY + feeH, h: revH },
      };
    });

    const gridLines = [0.25, 0.5, 0.75, 1].map((frac) => ({
      y: chartBottom - INNER_H * frac,
    }));

    return { bars, gridLines };
  }, [series]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-5 sm:p-6 relative">
      {/* Header & Range Selector */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{selectedRange}</span>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: "#64748b" }} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 min-w-[150px] py-1">
              {rangeOptions.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleRangeSelect(range)}
                  className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${range === selectedRange
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
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
      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-xs inline-block"
            style={{ backgroundColor: COLORS.netRevenue }}
          />
          <span className="text-xs text-slate-600 font-medium">Net Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-xs inline-block"
            style={{ backgroundColor: COLORS.platformFees }}
          />
          <span className="text-xs text-slate-600 font-medium">Platform Fees</span>
        </div>
      </div>

      {/* Stacked Bar Chart SVG */}
      <div className="w-full overflow-hidden bg-slate-50/40 rounded-xl p-3 border border-slate-100/50">
        {series.length > 0 ? (
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {chartData.bars.map((bar, i) => (
                <clipPath key={i} id={`bar-rounded-clip-${i}`}>
                  <rect
                    x={bar.x}
                    y={bar.topY}
                    width={bar.width}
                    height={bar.totalH}
                    rx={6}
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
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ))}

            {/* Baseline */}
            <line
              x1={PADDING.left}
              y1={PADDING.top + INNER_H}
              x2={SVG_WIDTH - PADDING.right}
              y2={PADDING.top + INNER_H}
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />

            {/* Stacked Bars */}
            {chartData.bars.map((bar, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                className="cursor-pointer transition-opacity hover:opacity-90"
              >
                <g>
                  <rect
                    x={bar.x}
                    y={bar.feeRect.y}
                    width={bar.width}
                    height={bar.feeRect.h}
                    fill={COLORS.platformFees}
                  />
                  <rect
                    x={bar.x}
                    y={bar.revRect.y}
                    width={bar.width}
                    height={bar.revRect.h}
                    fill={COLORS.netRevenue}
                  />
                </g>

                <text
                  x={bar.x + bar.width / 2}
                  y={SVG_HEIGHT - 12}
                  textAnchor="middle"
                  fill="#64748b"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {bar.month}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            No chart data available.
          </div>
        )}
      </div>

      {/* Tooltip display on hover */}
      {hoveredBar && (
        <div className="absolute top-16 right-6 bg-slate-900 text-white text-xs rounded-sm py-2 px-3 shadow-xl pointer-events-none z-30">
          <p className="font-bold text-slate-200 mb-1">{hoveredBar.month}</p>
          <p className="text-emerald-400">
            Net: ${hoveredBar.net.toLocaleString()}
          </p>
          <p className="text-rose-300">
            Fees: ${hoveredBar.fee.toLocaleString()}
          </p>
          <p className="border-t border-slate-700 mt-1 pt-1 font-bold">
            Gross: ${hoveredBar.total.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
