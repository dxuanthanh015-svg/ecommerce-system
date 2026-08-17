import React from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StoreSettingsCard from "./StoreSettingsCard";
import StoreSettingsField from "./StoreSettingsField";

export default function FulfillmentCenterSection({ values, onChange }) {
  return (
    <StoreSettingsCard
      icon={<LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />}
      title="Fulfillment Center"
      description="Primary origin address"
    >
      <div className="space-y-4">
        <StoreSettingsField
          id="streetAddress"
          label="Street Address"
          name="streetAddress"
          value={values.streetAddress}
          onChange={onChange}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StoreSettingsField
            id="city"
            label="City"
            name="city"
            value={values.city}
            onChange={onChange}
          />

          <StoreSettingsField
            id="state"
            label="State/Province"
            name="state"
            value={values.state}
            onChange={onChange}
          />
        </div>

        <StoreSettingsField
          id="zipCode"
          label="ZIP / Postal Code"
          name="zipCode"
          value={values.zipCode}
          onChange={onChange}
        />
      </div>
    </StoreSettingsCard>
  );
}
