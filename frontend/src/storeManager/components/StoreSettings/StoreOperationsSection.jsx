import React from "react";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StoreSettingsCard from "./StoreSettingsCard";

export default function StoreOperationsSection({ values, onChange }) {
  const handleToggle = (name) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: !values[name],
        },
      });
    }
  };

  return (
    <StoreSettingsCard
      icon={<BeachAccessOutlinedIcon sx={{ fontSize: 22 }} />}
      title="Store Operations & Alerts"
      description="Store availability and automated notifications"
    >
      <div className="space-y-5">
        {/* Vacation Mode Toggle */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Vacation Mode
                </span>
                {values.vacationMode ? (
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                    Paused
                  </span>
                ) : (
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    Active
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Temporarily pause new order placements while keeping your storefront visible.
              </p>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={values.vacationMode}
              onClick={() => handleToggle("vacationMode")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                values.vacationMode ? "bg-amber-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  values.vacationMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {values.vacationMode && (
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Notice message for buyers
              </label>
              <input
                type="text"
                name="vacationMessage"
                value={values.vacationMessage || ""}
                onChange={onChange}
                placeholder="We will be back on..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-100"
              />
            </div>
          )}
        </div>

        {/* Email Notifications Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 19 }} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Order Notifications
              </p>
              <p className="text-xs text-slate-500">
                Receive instant emails for incoming orders
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={values.emailNotifications}
            onClick={() => handleToggle("emailNotifications")}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              values.emailNotifications ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                values.emailNotifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Low Stock Warning Threshold */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Inventory2OutlinedIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Low Stock Warning Threshold
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="lowStockThreshold"
              min="1"
              max="100"
              value={values.lowStockThreshold || 5}
              onChange={onChange}
              className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            />
            <span className="text-xs text-slate-500">
              Alert when product quantity drops below this amount
            </span>
          </div>
        </div>
      </div>
    </StoreSettingsCard>
  );
}
