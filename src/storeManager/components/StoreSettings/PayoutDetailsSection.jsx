import React from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import StoreSettingsCard from "./StoreSettingsCard";
import StoreSettingsField from "./StoreSettingsField";
import { maskSensitiveValue } from "./storeSettings.utils";

export default function PayoutDetailsSection({ values, onChange }) {
  return (
    <StoreSettingsCard
      icon={<AccountBalanceOutlinedIcon sx={{ fontSize: 22 }} />}
      title="Payout Details"
      description="Secure bank information"
    >
      <div className="space-y-4">
        <StoreSettingsField
          id="bankName"
          label="Bank Name"
          name="bankName"
          placeholder="e.g. Chase, Bank of America"
          value={values.bankName}
          onChange={onChange}
        />

        <StoreSettingsField
          id="accountHolder"
          label="Account Holder Name"
          name="accountHolder"
          placeholder="Legal Name on Account"
          value={values.accountHolder}
          onChange={onChange}
        />

        <StoreSettingsField
          id="routingNumber"
          label="Routing Number"
          name="routingNumber"
          value={maskSensitiveValue(values.routingNumber)}
          onChange={onChange}
          readOnly
          className="tracking-[0.3em] text-slate-800"
        />

        <div>
          <StoreSettingsField
            id="accountNumber"
            label="Account Number"
            name="accountNumber"
            value={maskSensitiveValue(values.accountNumber)}
            onChange={onChange}
            readOnly
            className="tracking-[0.3em] text-slate-800"
          />
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <LockOutlinedIcon sx={{ fontSize: 14 }} />
            Encrypted &amp; secured via NexCart Pay
          </p>
        </div>
      </div>
    </StoreSettingsCard>
  );
}
