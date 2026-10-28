import React, { useMemo, useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BrandIdentitySection from "./BrandIdentitySection";
import CustomerPoliciesSection from "./CustomerPoliciesSection";
import FulfillmentCenterSection from "./FulfillmentCenterSection";
import PayoutDetailsSection from "./PayoutDetailsSection";
import StoreOperationsSection from "./StoreOperationsSection";
import StoreSettingsHeader from "./StoreSettingsHeader";
import {
  buildStoreSettingsPayload,
  cloneStoreSettings,
  createStoreSettingsState,
} from "./storeSettings.data";

import { useCurrentStore, useUpdateStoreSettings } from "../../../hooks/useStoreQuery";

export default function StoreSettings() {
  const { data: currentStore } = useCurrentStore();
  const { mutateAsync: updateSettingsMutate, isPending: isSavingMutation } = useUpdateStoreSettings();

  useEffect(() => {
    if (currentStore) {
      const initState = createSettingsFromStore(currentStore);
      setStoreSettings(initState);
      setSavedSettings(initState);
    }
  }, [currentStore]);

  const createSettingsFromStore = (store = {}) => {
    const savedSettings = store.settings || {};
    return createStoreSettingsState({
      brandIdentity: {
        ...savedSettings.brandIdentity,
        storeName: store.name || "Aura Minimalist Goods",
        contactEmail: store.email || "hello@auragoods.com",
        phone: store.phone || "+1 (555) 234-5678",
        category: savedSettings.brandIdentity?.category || "Home & Living",
        bio: store.description || "Curated essential goods for the modern, mindful home.",
        logoImage: store.logoUrl || savedSettings.brandIdentity?.logoImage || "/nexCart.svg",
        bannerImage: store.bannerUrl || savedSettings.brandIdentity?.bannerImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
      },
      payoutDetails: {
        ...savedSettings.payoutDetails,
        bankName: store.bankName || savedSettings.payoutDetails?.bankName || "",
        accountHolder: store.accountName || savedSettings.payoutDetails?.accountHolder || "",
        routingNumber: savedSettings.payoutDetails?.routingNumber || "",
        accountNumber: store.accountNumber || savedSettings.payoutDetails?.accountNumber || "",
        payoutSchedule: savedSettings.payoutDetails?.payoutSchedule || "weekly",
      },
      fulfillmentCenter: {
        ...savedSettings.fulfillmentCenter,
        streetAddress: store.address || savedSettings.fulfillmentCenter?.streetAddress || "",
        city: savedSettings.fulfillmentCenter?.city || "",
        state: savedSettings.fulfillmentCenter?.state || "",
        zipCode: savedSettings.fulfillmentCenter?.zipCode || "",
        country: savedSettings.fulfillmentCenter?.country || "",
        processingTime: savedSettings.fulfillmentCenter?.processingTime || "1-2 business days",
        freeShippingThreshold: savedSettings.fulfillmentCenter?.freeShippingThreshold ?? 0,
      },
      customerPolicies: savedSettings.customerPolicies || {
        returnWindowDays: 30,
        freeReturns: true,
        restockingFee: 0,
        returnPolicyText: "Items can be returned within 30 days of receipt in original condition and packaging.",
        shippingPolicyText: "Standard orders are processed within 1-2 business days. Express shipping is available at checkout.",
        warrantyMonths: 12,
        privacyPolicyText: "We value customer privacy and do not sell or share personal information with third parties.",
      },
      storeOperations: savedSettings.storeOperations || {
        vacationMode: store.status === "paused" || false,
        vacationMessage: "Our store is currently on vacation mode and will resume taking orders soon.",
        emailNotifications: true,
        lowStockThreshold: 5,
      },
    });
  };

  const initialSettings = useMemo(() => createSettingsFromStore(currentStore || {}), [currentStore]);
  const [storeSettings, setStoreSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Compare settings to detect changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(storeSettings) !== JSON.stringify(savedSettings);
  }, [storeSettings, savedSettings]);

  // Section level field changes
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

  // Direct section replacement (e.g. for customer policies modal)
  const handlePoliciesChange = (newPolicies) => {
    setStoreSettings((prev) => ({
      ...prev,
      customerPolicies: {
        ...prev.customerPolicies,
        ...newPolicies,
      },
    }));
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDiscard = () => {
    setStoreSettings(cloneStoreSettings(savedSettings));
    showToast("Đã hoàn tác các thay đổi chưa lưu.", "info");
  };

  const handleSave = async () => {
    if (isSaving || isSavingMutation) return;
    setIsSaving(true);
    try {
      const payload = buildStoreSettingsPayload(storeSettings);
      await updateSettingsMutate({ settings: payload });
      setSavedSettings(cloneStoreSettings(storeSettings));
      showToast("Cài đặt cửa hàng đã được lưu và cập nhật thành công!", "success");
    } catch (err) {
      console.error("Error saving store settings:", err);
      showToast(
        err.response?.data?.message || err.response?.data?.result?.message || err.message || "Có lỗi xảy ra khi lưu cài đặt!",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl transition-all duration-300 animate-in slide-in-from-top-4">
          {toastMessage.type === "success" ? (
            <CheckCircleIcon sx={{ fontSize: 20, color: "#34d399" }} />
          ) : (
            <InfoOutlinedIcon sx={{ fontSize: 20, color: "#60a5fa" }} />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* 1. Header */}
      <StoreSettingsHeader
        onDiscard={handleDiscard}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      {/* 2. Content Layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)]">
        {/* Left Column: Brand Identity, Customer Policies, Operations */}
        <div className="space-y-6">
          <BrandIdentitySection
            values={storeSettings.brandIdentity}
            onChange={handleSectionChange("brandIdentity")}
          />

          <CustomerPoliciesSection
            values={storeSettings.customerPolicies}
            onChange={handlePoliciesChange}
          />

          <StoreOperationsSection
            values={storeSettings.storeOperations}
            onChange={handleSectionChange("storeOperations")}
          />
        </div>

        {/* Right Column: Payout Details & Fulfillment */}
        <div className="space-y-6">
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
