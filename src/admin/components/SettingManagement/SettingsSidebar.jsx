import React from "react";

const SettingsSidebar = ({ menu = [], activeKey, onSelect }) => {
  return (
    <aside className="rounded-3xl border border-[#e5e8f2] bg-white p-4 shadow-sm">
      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
              item.key === activeKey
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
