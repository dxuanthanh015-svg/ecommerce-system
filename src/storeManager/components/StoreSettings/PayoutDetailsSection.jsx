import React, { useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import StoreSettingsCard from "./StoreSettingsCard";
import StoreSettingsField from "./StoreSettingsField";

export default function PayoutDetailsSection({ values, onChange }) {
  const [showSensitive, setShowSensitive] = useState(false);

  return (
    <StoreSettingsCard
      icon={<AccountBalanceOutlinedIcon sx={{ fontSize: 22 }} />}
      title="Payout Details"
      description="Secure bank settlement information"
    >
      <div className="space-y-4">
        <StoreSettingsField
          id="bankName"
          label="Bank Name"
          name="bankName"
          placeholder="e.g. Chase, Vietcombank, Techcombank"
          value={values.bankName || ""}
          onChange={onChange}
        />

        <StoreSettingsField
          id="accountHolder"
          label="Account Holder Name"
          name="accountHolder"
          placeholder="Legal Name on Account"
          value={values.accountHolder || ""}
          onChange={onChange}
        />

        {/* Account Number with Show/Hide toggle */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="accountNumber"
              className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Account Number
            </label>
            <button
              type="button"
              onClick={() => setShowSensitive((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition"
            >
              {showSensitive ? (
                <>
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>
          <input
            id="accountNumber"
            name="accountNumber"
            type={showSensitive ? "text" : "password"}
            value={values.accountNumber || ""}
            onChange={onChange}
            placeholder="Account Number"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 font-mono tracking-wider focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Routing / Swift Code */}
        <div>
          <label
            htmlFor="routingNumber"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
          >
            Routing / SWIFT Code
          </label>
          <input
            id="routingNumber"
            name="routingNumber"
            type={showSensitive ? "text" : "password"}
            value={values.routingNumber || ""}
            onChange={onChange}
            placeholder="e.g. 123456789"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 font-mono tracking-wider focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Payout Schedule */}
        <div>
          <label
            htmlFor="payoutSchedule"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Payout Frequency
          </label>
          <div className="relative">
            <select
              id="payoutSchedule"
              name="payoutSchedule"
              value={values.payoutSchedule || "weekly"}
              onChange={onChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="weekly">Weekly (Every Monday)</option>
              <option value="biweekly">Bi-weekly (Every 14 Days)</option>
              <option value="monthly">Monthly (1st of each Month)</option>
            </select>
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <LockOutlinedIcon sx={{ fontSize: 14, color: "#10b981" }} />
          Encrypted &amp; direct deposit secured via NexCart Pay
        </p>
      </div>
    </StoreSettingsCard>
  );
}
