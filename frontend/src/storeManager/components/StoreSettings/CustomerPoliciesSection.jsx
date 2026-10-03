import React, { useState } from "react";
import DomainVerificationOutlinedIcon from "@mui/icons-material/DomainVerificationOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CustomerPoliciesModal from "./CustomerPoliciesModal";
import { cardClassName } from "./storeSettings.utils";

export default function CustomerPoliciesSection({ values, onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSavePolicies = (newPolicies) => {
    if (onChange) {
      onChange(newPolicies);
    }
  };

  return (
    <>
      <section className={cardClassName}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-slate-900">
              Customer Policies
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your return, shipping, and warranty policies to maintain
              transparency with your shoppers.
            </p>

            {/* Quick summary badges */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                <AssignmentReturnOutlinedIcon sx={{ fontSize: 15 }} />
                {values?.returnWindowDays || 30}-day return window
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <LocalShippingOutlinedIcon sx={{ fontSize: 15 }} />
                {values?.freeReturns ? "Free return shipping" : "Standard returns"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <ShieldOutlinedIcon sx={{ fontSize: 15 }} />
                {values?.warrantyMonths || 12}-month warranty
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d5d9e8] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
          >
            <DomainVerificationOutlinedIcon sx={{ fontSize: 18, color: "#6366f1" }} />
            Manage Policies
          </button>
        </div>
      </section>

      <CustomerPoliciesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPolicies={values}
        onSave={handleSavePolicies}
      />
    </>
  );
}
