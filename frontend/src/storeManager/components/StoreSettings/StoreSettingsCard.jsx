import React from "react";
import { cardClassName } from "./storeSettings.utils";

export default function StoreSettingsCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className={cardClassName}>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}
