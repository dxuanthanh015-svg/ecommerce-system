import React, { useEffect, useMemo, useState } from "react";

const COLORS = {
  netRevenue: "#4f46e5",
  platformFees: "#f59e0b",
};

const SVG_WIDTH = 900;
const SVG_HEIGHT = 360;
const PADDING = { top: 34, right: 28, bottom: 48, left: 112 };
const INNER_W = SVG_WIDTH - PADDING.left - PADDING.right;
const INNER_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;
const numberFormatter = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

const formatVnd = (value) => `${numberFormatter.format(Number(value) || 0)} VND`;

const getNiceMax = (value, tickCount = 5) => {
  if (!(value > 0)) return 1;
  const roughStep = value / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  const niceStep = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceStep * magnitude * tickCount;
};

const RevenueChart = ({
  title,
  series = [],
  activeRange,
  rangeOptions = [],
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState(activeRange);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => setSelectedRange(activeRange), [activeRange]);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
    onRangeChange?.(range);
  };

  const chartData = useMemo(() => {
    const normalized = series.map((point) => ({
      ...point,
      netRevenue: Math.max(0, Number(point.netRevenue) || 0),
      platformFees: Math.max(0, Number(point.platformFees) || 0),
    }));
    if (!normalized.length) return { bars: [], ticks: [], maxValue: 0 };

    const maxValue = getNiceMax(Math.max(...normalized.map((point) => point.netRevenue + point.platformFees)));
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
      const value = (maxValue / tickCount) * index;
      return { value, y: PADDING.top + INNER_H - (value / maxValue) * INNER_H };
    });
    const barCount = normalized.length;
    const gap = barCount > 9 ? 18 : 28;
    const barWidth = Math.max(16, Math.min(54, (INNER_W - gap * (barCount - 1)) / barCount));
    const barsWidth = barCount * barWidth + (barCount - 1) * gap;
    const startX = PADDING.left + (INNER_W - barsWidth) / 2;
    const chartBottom = PADDING.top + INNER_H;
    const bars = normalized.map((point, index) => {
      const total = point.netRevenue + point.platformFees;
      const totalHeight = (total / maxValue) * INNER_H;
      const feesHeight = (point.platformFees / maxValue) * INNER_H;
      const netHeight = (point.netRevenue / maxValue) * INNER_H;
      const x = startX + index * (barWidth + gap);
      const topY = chartBottom - totalHeight;
      return {
        ...point,
        index,
        x,
        centerX: x + barWidth / 2,
        topY,
        width: barWidth,
        total,
        totalHeight,
        feesHeight,
        netHeight,
        feesY: topY,
        netY: topY + feesHeight,
      };
    });

    return { bars, ticks, maxValue };
  }, [series]);

  const hoveredBar = hoveredIndex == null ? null : chartData.bars[hoveredIndex];
  const tooltipX = hoveredBar
    ? Math.max(8, Math.min(SVG_WIDTH - 224, hoveredBar.centerX - 108))
    : 0;
  const tooltipY = hoveredBar ? Math.max(8, hoveredBar.topY - 104) : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">Doanh thu thuần và phí nền tảng theo kỳ</p>
        </div>
        {rangeOptions.length > 0 && <div className="relative self-start">
          <button
            type="button"
            onClick={() => setShowDropdown((value) => !value)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            {selectedRange}
          </button>
          {showDropdown && <div className="absolute right-0 top-full z-20 mt-2 min-w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {rangeOptions.map((range) => <button
              key={range}
              type="button"
              onClick={() => handleRangeSelect(range)}
              className={`block w-full px-4 py-2.5 text-left text-sm ${range === selectedRange ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
            >{range}</button>)}
          </div>}
        </div>}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        {[["netRevenue", "Doanh thu thuần"], ["platformFees", "Phí nền tảng"]].map(([key, label]) => <div key={key} className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-3 ml-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[key] }} />{label}
        </div>)}
      </div>

      {chartData.bars.length ? <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-auto min-w-[680px] w-full overflow-visible"
          role="img"
          aria-label={title}
        >
          {chartData.ticks.map((tick, index) => <g key={index}>
            <line
              x1={PADDING.left}
              y1={tick.y}
              x2={SVG_WIDTH - PADDING.right}
              y2={tick.y}
              stroke={index === 0 ? "#cbd5e1" : "#e9eef5"}
              strokeWidth={index === 0 ? 1.5 : 1}
            />
            <text
              x={PADDING.left - 12}
              y={tick.y + 4}
              textAnchor="end"
              fill="#64748b"
              style={{ fontSize: 12, fontWeight: 500, fontFamily: "inherit", fontVariantNumeric: "tabular-nums" }}
            >{numberFormatter.format(tick.value)}</text>
          </g>)}

          {chartData.bars.map((bar, index) => <g
            key={`${bar.month}-${index}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            tabIndex={0}
            role="graphics-symbol"
            aria-label={`${bar.month}: doanh thu thuần ${formatVnd(bar.netRevenue)}, phí nền tảng ${formatVnd(bar.platformFees)}`}
            className="cursor-pointer outline-none"
          >
            {hoveredIndex === index && <rect
              x={bar.x - 8}
              y={PADDING.top - 8}
              width={bar.width + 16}
              height={INNER_H + 16}
              rx={10}
              fill="#f8fafc"
            />}
            {bar.total > 0 && <>
              <rect
                x={bar.x}
                y={bar.topY}
                width={bar.width}
                height={bar.totalHeight}
                rx={Math.min(8, bar.width / 2)}
                fill={COLORS.platformFees}
                opacity={hoveredIndex == null || hoveredIndex === index ? 1 : 0.55}
              />
              <rect
                x={bar.x}
                y={bar.netY}
                width={bar.width}
                height={Math.max(0, bar.netHeight)}
                rx={Math.min(7, bar.width / 2)}
                fill={COLORS.netRevenue}
                opacity={hoveredIndex == null || hoveredIndex === index ? 1 : 0.55}
              />
              {/* Keep the join between the stacked values square. */}
              <rect x={bar.x} y={bar.netY} width={bar.width} height={Math.min(8, bar.netHeight)} fill={COLORS.netRevenue} />
            </>}
            <rect x={bar.x - 6} y={PADDING.top} width={bar.width + 12} height={INNER_H} fill="transparent" />
            <text
              x={bar.centerX}
              y={SVG_HEIGHT - 12}
              textAnchor="middle"
              fill={hoveredIndex === index ? "#334155" : "#94a3b8"}
              style={{ fontSize: 13, fontWeight: hoveredIndex === index ? 700 : 500, fontFamily: "inherit" }}
            >{bar.month}</text>
          </g>)}

          {hoveredBar && <g pointerEvents="none" className="drop-shadow-lg">
            <rect x={tooltipX} y={tooltipY} width={216} height={92} rx={10} fill="#0f172a" />
            <text x={tooltipX + 14} y={tooltipY + 20} fill="#fff" style={{ fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>{hoveredBar.month}</text>
            <circle cx={tooltipX + 17} cy={tooltipY + 39} r={4} fill={COLORS.netRevenue} />
            <text x={tooltipX + 28} y={tooltipY + 43} fill="#e2e8f0" style={{ fontSize: 10, fontFamily: "inherit" }}>Doanh thu thuần</text>
            <text x={tooltipX + 202} y={tooltipY + 43} textAnchor="end" fill="#fff" style={{ fontSize: 10, fontWeight: 600, fontFamily: "inherit" }}>{formatVnd(hoveredBar.netRevenue)}</text>
            <circle cx={tooltipX + 17} cy={tooltipY + 59} r={4} fill={COLORS.platformFees} />
            <text x={tooltipX + 28} y={tooltipY + 63} fill="#e2e8f0" style={{ fontSize: 10, fontFamily: "inherit" }}>Phí nền tảng</text>
            <text x={tooltipX + 202} y={tooltipY + 63} textAnchor="end" fill="#fff" style={{ fontSize: 10, fontWeight: 600, fontFamily: "inherit" }}>{formatVnd(hoveredBar.platformFees)}</text>
            <line x1={tooltipX + 14} y1={tooltipY + 72} x2={tooltipX + 202} y2={tooltipY + 72} stroke="#334155" />
            <text x={tooltipX + 14} y={tooltipY + 86} fill="#cbd5e1" style={{ fontSize: 10, fontFamily: "inherit" }}>Tổng</text>
            <text x={tooltipX + 202} y={tooltipY + 86} textAnchor="end" fill="#fff" style={{ fontSize: 10, fontWeight: 700, fontFamily: "inherit" }}>{formatVnd(hoveredBar.total)}</text>
          </g>}
        </svg>
      </div> : <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">Chưa có dữ liệu doanh thu trong kỳ này.</div>}
      <p className="mt-2 text-right text-xs text-slate-400">Đơn vị: VND</p>
    </section>
  );
};

export default RevenueChart;
