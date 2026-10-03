import React from "react";

const KpiCard = ({
  title,
  value,
  meta,
  icon,
  accent,
  statusDot = null,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-2xs relative flex flex-col justify-between overflow-hidden">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-gray-600 flex items-center">{icon}</div>}
      </div>

      {/* Value */}
      <div className="my-2.5">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h2>
      </div>

      {/* Bottom status / trend */}
      <div>
        {statusDot ? (
          <div className="flex items-center text-xs font-medium text-gray-600">
            <span className={`w-2 h-2 rounded-full ${statusDot} mr-2 inline-block`}></span>
            {meta || "Pending review"}
          </div>
        ) : meta ? (
          <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
            <span>{meta}</span>
          </div>
        ) : null}
      </div>

      {/* Bottom Accent Bar */}
      {accent && (
        <div className={`absolute bottom-0 left-0 h-[3px] ${accent}`} />
      )}
    </div>
  );
};

export default KpiCard;
