import React from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StoreSettingsCard from "./StoreSettingsCard";
import StoreSettingsField from "./StoreSettingsField";

export default function FulfillmentCenterSection({ values, onChange }) {
  return (
    <StoreSettingsCard
      icon={<LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />}
      title="Fulfillment & Shipping"
      description="Primary warehouse origin address"
    >
      <div className="space-y-4">
        <StoreSettingsField
          id="streetAddress"
          label="Street Address"
          name="streetAddress"
          placeholder="e.g. 100 Innovation Drive, Suite 400"
          value={values.streetAddress || ""}
          onChange={onChange}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StoreSettingsField
            id="city"
            label="City"
            name="city"
            placeholder="e.g. San Francisco"
            value={values.city || ""}
            onChange={onChange}
          />

          <StoreSettingsField
            id="state"
            label="State / Province"
            name="state"
            placeholder="e.g. CA / Hanoi"
            value={values.state || ""}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StoreSettingsField
            id="zipCode"
            label="ZIP / Postal Code"
            name="zipCode"
            placeholder="e.g. 94103"
            value={values.zipCode || ""}
            onChange={onChange}
          />

          <StoreSettingsField
            id="country"
            label="Country / Region"
            name="country"
            placeholder="e.g. Vietnam, United States"
            value={values.country || "Vietnam"}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Order Processing Time
            </label>
            <select
              name="processingTime"
              value={values.processingTime || "1-2 business days"}
              onChange={onChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Same day">Same day dispatch</option>
              <option value="1-2 business days">1 - 2 business days</option>
              <option value="2-3 business days">2 - 3 business days</option>
              <option value="3-5 business days">3 - 5 business days</option>
            </select>
          </div>

          <StoreSettingsField
            id="freeShippingThreshold"
            label="Free Shipping Over ($)"
            name="freeShippingThreshold"
            type="number"
            placeholder="e.g. 50"
            value={values.freeShippingThreshold || ""}
            onChange={onChange}
          />
        </div>
      </div>
    </StoreSettingsCard>
  );
}
