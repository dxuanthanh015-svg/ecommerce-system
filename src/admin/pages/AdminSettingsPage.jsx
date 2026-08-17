import React, { useMemo, useState } from "react";
import SettingsSidebar from "../components/SettingManagement/SettingsSidebar";
import SettingSectionCard from "../components/SettingManagement/SettingSectionCard";
import SettingTextField from "../components/SettingManagement/SettingTextField";
import SettingToggleRow from "../components/SettingManagement/SettingToggleRow";
import {
  SETTINGS_MENU,
  createSettingsState,
  buildSettingsPayload,
} from "../components/SettingManagement/settingManagement.data";

const AdminSettingsPage = () => {
  const initialSettings = useMemo(() => createSettingsState(), []);
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState("platformRules");

  const handleChange = (section) => (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSave = () => {
    const payload = buildSettingsPayload(settings);
    console.log("Save settings payload:", payload);
    // TODO: call API endpoint here
  };

  const handleDiscard = () => {
    setSettings(createSettingsState(initialSettings));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">System Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Manage core platform configurations and operational parameters.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Save Configuration
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <SettingsSidebar menu={SETTINGS_MENU} activeKey={activeSection} onSelect={setActiveSection} />

          <div className="space-y-6">
            {activeSection === "platformRules" && (
              <SettingSectionCard
                title="Platform Commission Rules"
                description="Configure default transaction fees and category-specific overrides."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SettingTextField
                    id="defaultCommissionRate"
                    label="Default Commission Rate (%)"
                    name="defaultCommissionRate"
                    value={settings.platformRules.defaultCommissionRate}
                    onChange={handleChange("platformRules")}
                  />
                </div>
                <div className="rounded-3xl border border-[#e5e8f2] bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Category-Specific Rate Overrides</h3>
                  <div className="space-y-3">
                    {settings.platformRules.categoryOverrides.map((override) => (
                      <div key={override.id} className="grid gap-4 md:grid-cols-[1.5fr_1fr_0.7fr]">
                        <SettingTextField
                          id={`category-${override.id}`}
                          label="Category"
                          name="category"
                          value={override.category}
                          onChange={() => {}}
                          readOnly
                        />
                        <SettingTextField
                          id={`rate-${override.id}`}
                          label="Commission Rate (%)"
                          name="rate"
                          value={override.rate}
                          onChange={handleChange("platformRules")}
                        />
                        <button
                          type="button"
                          className="mt-6 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </SettingSectionCard>
            )}

            {activeSection === "paymentGateways" && (
              <SettingSectionCard
                title="Payment Gateways"
                description="Manage your payment provider and transaction configuration."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SettingTextField
                    id="gatewayName"
                    label="Gateway Name"
                    name="gatewayName"
                    value={settings.paymentGateways.gatewayName}
                    onChange={handleChange("paymentGateways")}
                  />
                  <SettingTextField
                    id="accountIdentifier"
                    label="Account Identifier"
                    name="accountIdentifier"
                    value={settings.paymentGateways.accountIdentifier}
                    onChange={handleChange("paymentGateways")}
                  />
                  <SettingTextField
                    id="environment"
                    label="Environment"
                    name="environment"
                    value={settings.paymentGateways.environment}
                    onChange={handleChange("paymentGateways")}
                  />
                </div>
              </SettingSectionCard>
            )}

            {activeSection === "shippingLogistics" && (
              <SettingSectionCard
                title="Shipping & Logistics"
                description="Configure your shipping provider and fulfillment expectations."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SettingTextField
                    id="carrierName"
                    label="Carrier Name"
                    name="carrierName"
                    value={settings.shippingLogistics.carrierName}
                    onChange={handleChange("shippingLogistics")}
                  />
                  <SettingTextField
                    id="shippingRegion"
                    label="Shipping Region"
                    name="shippingRegion"
                    value={settings.shippingLogistics.shippingRegion}
                    onChange={handleChange("shippingLogistics")}
                  />
                  <SettingTextField
                    id="fulfillmentLeadTime"
                    label="Fulfillment Lead Time"
                    name="fulfillmentLeadTime"
                    value={settings.shippingLogistics.fulfillmentLeadTime}
                    onChange={handleChange("shippingLogistics")}
                  />
                </div>
              </SettingSectionCard>
            )}

            {activeSection === "maintenanceSecurity" && (
              <SettingSectionCard
                title="Maintenance & Security"
                description="Control maintenance mode, support settings, and authentication options."
              >
                <div className="space-y-4">
                  <SettingToggleRow
                    label="Maintenance Mode"
                    description="Temporarily disable storefront access for maintenance updates."
                    checked={settings.maintenanceSecurity.maintenanceMode}
                    onChange={handleChange("maintenanceSecurity")}
                  />
                  <SettingTextField
                    id="supportEmail"
                    label="Support Email"
                    name="supportEmail"
                    value={settings.maintenanceSecurity.supportEmail}
                    onChange={handleChange("maintenanceSecurity")}
                  />
                  <SettingToggleRow
                    label="Two-Factor Authentication"
                    description="Require additional verification for admin access."
                    checked={settings.maintenanceSecurity.twoFactorAuth}
                    onChange={handleChange("maintenanceSecurity")}
                  />
                </div>
              </SettingSectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
