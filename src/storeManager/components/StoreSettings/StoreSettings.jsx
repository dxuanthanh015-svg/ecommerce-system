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
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};

  const initialSettings = useMemo(() => {
    return createStoreSettingsState({
      brandIdentity: {
        storeName: currentStore.name || "My Store",
        contactEmail: currentStore.email || "store@nexcart.com",
        bio: currentStore.description || "Official NexCart Partner Store.",
        logoImage: currentStore.imageUrl || "/nexCart.svg",
      },
      payoutDetails: {
        bankName: currentStore.bankInfo?.bankName || "",
        accountHolder: currentStore.bankInfo?.accountName || currentStore.owner || "",
        accountNumber: currentStore.bankInfo?.accountNumber || "",
      },
      fulfillmentCenter: {
        streetAddress: currentStore.address || "Manhattan, New York",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
    });
  }, [currentStore.id]);

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

    // Synchronize back to currentStore
    const updatedStore = {
      ...currentStore,
      name: payload.brandIdentity.storeName,
      email: payload.brandIdentity.contactEmail,
      imageUrl: payload.brandIdentity.logoImage,
      description: payload.brandIdentity.bio,
      address: payload.fulfillmentCenter.streetAddress,
      bankInfo: {
        ...currentStore.bankInfo,
        bankName: payload.payoutDetails.bankName,
        accountHolder: payload.payoutDetails.accountHolder,
        accountNumber: payload.payoutDetails.accountNumber,
      }
    };

    localStorage.setItem("currentStore", JSON.stringify(updatedStore));

    // Update in allStores & stores
    const allStores = JSON.parse(localStorage.getItem("allStores")) || [];
    const updatedAllStores = allStores.map((s) =>
      String(s.id) === String(updatedStore.id) ? updatedStore : s
    );
    localStorage.setItem("allStores", JSON.stringify(updatedAllStores));
    localStorage.setItem("stores", JSON.stringify(updatedAllStores));

    setSavedSettings(cloneStoreSettings(storeSettings));
    alert("Cài đặt thông tin gian hàng đã được cập nhật thành công!");
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
