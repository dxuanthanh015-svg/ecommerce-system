import React from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

export default function StoreSettingsHeader({
  onDiscard,
  onSave,
  hasUnsavedChanges,
  isSaving,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Store Settings &amp; Profile
          </h1>
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500 sm:text-base">
          Manage your brand identity, operations, customer policies, and financial payout accounts in one place.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <button
          type="button"
          onClick={onDiscard}
          disabled={!hasUnsavedChanges || isSaving}
          className={`min-w-36 inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
            hasUnsavedChanges && !isSaving
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
              : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60"
          }`}
        >
          <RestartAltOutlinedIcon sx={{ fontSize: 18 }} />
          Discard Changes
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`min-w-44 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition ${
            isSaving
              ? "opacity-75 cursor-wait bg-indigo-500"
              : "hover:bg-indigo-700 hover:shadow-indigo-300 cursor-pointer"
          }`}
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <SaveOutlinedIcon sx={{ fontSize: 18 }} />
          )}
          <span>{isSaving ? "Saving Configuration..." : "Save Configuration"}</span>
        </button>
      </div>
    </div>
  );
}
