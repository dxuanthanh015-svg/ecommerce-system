import React from "react";

export default function StoreSettingsHeader({ onDiscard, onSave }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-[48px]">
          Store Settings &amp; Profile
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
          Manage your brand identity, operational details, and financial
          information to ensure a seamless premium experience for your
          customers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <button
          type="button"
          onClick={onDiscard}
          className="min-w-40 rounded-xl border border-[#cfd4e6] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Discard Changes
        </button>
        <button
          type="button"
          onClick={onSave}
          className="min-w-44 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
