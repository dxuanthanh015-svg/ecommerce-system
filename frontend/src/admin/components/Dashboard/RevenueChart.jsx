import React, { useMemo, useState } from "react";
import { formatVnd } from "../../../utils/currency";

const RevenueChart = ({ revenueChartData = {} }) => {
  const [range, setRange] = useState("thisyear");
  const data = useMemo(() => revenueChartData?.[range] || [], [revenueChartData, range]);
  const maxValue = Math.max(...data.map((point) => Number(point.value || 0)), 1);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="font-semibold text-gray-900">Revenue Overview</h2><p className="mt-1 text-xs text-gray-500">Paid orders, excluding cancelled orders</p></div>
        <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          <option value="thisyear">This year</option><option value="last7days">Last 7 days</option>
        </select>
      </div>
      {data.length ? <div className="mt-6 flex h-64 items-end gap-2 overflow-x-auto">
        {data.map((point, index) => {
          const value = Number(point.value || 0);
          return <div key={`${point.label}-${index}`} className="group relative z-0 flex h-full min-w-10 flex-1 flex-col items-center justify-end gap-2 hover:z-50 focus-within:z-50">
            <span className="max-w-full truncate text-[10px] text-gray-500">{formatVnd(value)}</span>
            <div
              tabIndex={0}
              aria-label={`${point.label}: ${formatVnd(value)}`}
              className="relative w-full cursor-pointer rounded-t bg-indigo-500 outline-none transition-colors hover:bg-indigo-700 focus-visible:bg-indigo-700"
              style={{ height: `${Math.max(3, value / maxValue * 72)}%` }}
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-within:block">
                <div className="text-slate-300">{point.label}</div>
                <div className="mt-0.5">{formatVnd(value)}</div>
              </div>
            </div>
            <span className="text-xs text-gray-500">{point.label}</span>
          </div>;
        })}
      </div> : <p className="py-16 text-center text-sm text-gray-500">No revenue data yet.</p>}
    </section>
  );
};

export default RevenueChart;
