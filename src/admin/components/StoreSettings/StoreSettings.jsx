import React, { useMemo, useState } from "react";
import BrandIdentitySection from "./BrandIdentitySection";
import CustomerPoliciesSection from "./CustomerPoliciesSection";
import FulfillmentCenterSection from "./FulfillmentCenterSection";
import PayoutDetailsSection from "./PayoutDetailsSection";
import StoreSettingsHeader from "./StoreSettingsHeader";
import {
  buildStoreSettingsPayload,
  cloneStoreSettings,
  createStoreSettingsState,
} from "./storeSettings.data";

export default function StoreSettings() {
  const initialSettings = useMemo(() => createStoreSettingsState(), []);
  const [storeSettings, setStoreSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);

  const handleSectionChange = (sectionKey) => (event) => {
    const { name, value } = event.target;

    setStoreSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [name]: value,
      },
    }));
  };

  const handleDiscard = () => {
    setStoreSettings(cloneStoreSettings(savedSettings));
  };

  const handleSave = () => {
    const payload = buildStoreSettingsPayload(storeSettings);

    console.log("Saved Configuration:", payload);
    setSavedSettings(cloneStoreSettings(storeSettings));
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <StoreSettingsHeader onDiscard={handleDiscard} onSave={handleSave} />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          <BrandIdentitySection
            values={storeSettings.brandIdentity}
            onChange={handleSectionChange("brandIdentity")}
          />
          <CustomerPoliciesSection />
        </div>

        <div className="space-y-5">
          <PayoutDetailsSection
            values={storeSettings.payoutDetails}
            onChange={handleSectionChange("payoutDetails")}
          />
          <FulfillmentCenterSection
            values={storeSettings.fulfillmentCenter}
            onChange={handleSectionChange("fulfillmentCenter")}
          />
        </div>
      </div>
    </div>
  );
}
