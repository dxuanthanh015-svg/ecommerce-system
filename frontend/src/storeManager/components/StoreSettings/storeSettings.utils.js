export const inputClassName =
  "w-full rounded-xl border border-[#d8dbe8] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export const labelClassName =
  "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500";

export const cardClassName =
  "rounded-3xl border border-[#e5e8f2] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-7";

export const maskSensitiveValue = (value = "") =>
  "•".repeat(Math.max(String(value).length, 8));
