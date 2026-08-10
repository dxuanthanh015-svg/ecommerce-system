import React from "react";
import DomainVerificationOutlinedIcon from "@mui/icons-material/DomainVerificationOutlined";
import { cardClassName } from "./storeSettings.utils";

export default function CustomerPoliciesSection() {
  return (
    <section className={cardClassName}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-slate-900">
            Customer Policies
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage your return, shipping, and privacy policies to maintain
            transparency with your shoppers.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#d5d9e8] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <DomainVerificationOutlinedIcon sx={{ fontSize: 18 }} />
          Manage Policies
        </button>
      </div>
    </section>
  );
}
