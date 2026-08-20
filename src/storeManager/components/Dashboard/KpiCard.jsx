import React from "react";

const KpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClass = "bg-purple-100 text-purple-600",
  trendText,
  trendColorClass = "text-emerald-600",
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Title & Icon */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block">
            {title}
          </span>
          {Icon && (
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
              <Icon sx={{ fontSize: 20 }} />
            </div>
          )}
        </div>

        {/* Big Metric Value */}
        <div className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          {value}
        </div>
      </div>

      {/* Footer Trend / Subtitle */}
      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold">
        {trendText && (
          <span className={`flex items-center gap-1 font-bold ${trendColorClass}`}>
            {trendText}
          </span>
        )}
        {subtitle && (
          <span className="text-gray-500 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
