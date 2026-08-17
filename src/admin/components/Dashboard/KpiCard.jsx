import React from "react";

const KpiCard = ({ title, value, meta, icon, accent }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        {icon && <div className="p-2.5 rounded-xl bg-gray-50 text-gray-700">{icon}</div>}
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</h2>
        {meta && <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-2">{meta}</div>}
      </div>
      {accent && <div className={`h-1 rounded-b ${accent}`} />}
    </div>
  );
};

export default KpiCard;
