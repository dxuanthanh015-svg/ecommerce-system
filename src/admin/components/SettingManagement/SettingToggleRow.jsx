import React from "react";

const SettingToggleRow = ({ label, checked, onChange, description }) => {
  return (
    <div className="rounded-3xl border border-[#e5e8f2] bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-900">
          <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 rounded border-[#d8dbe8] text-indigo-600 focus:ring-indigo-500" />
        </label>
      </div>
    </div>
  );
};

export default SettingToggleRow;
