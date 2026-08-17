import React from "react";

const SettingSectionCard = ({ title, description, children }) => {
  return (
    <section className="rounded-3xl border border-[#e5e8f2] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

export default SettingSectionCard;
