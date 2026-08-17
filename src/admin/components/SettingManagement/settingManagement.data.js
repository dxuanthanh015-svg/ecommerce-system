export const SETTINGS_MENU = [
  { key: "platformRules", label: "Platform Rules" },
  { key: "paymentGateways", label: "Payment Gateways" },
  { key: "shippingLogistics", label: "Shipping & Logistics" },
  { key: "maintenanceSecurity", label: "Maintenance & Security" },
];

export const defaultSettingsState = {
  platformRules: {
    defaultCommissionRate: "5.00",
    categoryOverrides: [
      { id: "c1", category: "Electronics", rate: "3.50" },
      { id: "c2", category: "Fashion & Apparel", rate: "8.00" },
    ],
  },
  paymentGateways: {
    gatewayName: "Stripe",
    accountIdentifier: "acct_12345",
    environment: "Live",
  },
  shippingLogistics: {
    carrierName: "FedEx",
    shippingRegion: "US & Canada",
    fulfillmentLeadTime: "2-3 business days",
  },
  maintenanceSecurity: {
    maintenanceMode: false,
    supportEmail: "support@nexcart.com",
    twoFactorAuth: true,
  },
};

const mergeSection = (defaults, incoming = {}) => ({
  ...defaults,
  ...incoming,
});

export const createSettingsState = (apiSettings = {}) => ({
  platformRules: mergeSection(defaultSettingsState.platformRules, apiSettings.platformRules),
  paymentGateways: mergeSection(defaultSettingsState.paymentGateways, apiSettings.paymentGateways),
  shippingLogistics: mergeSection(defaultSettingsState.shippingLogistics, apiSettings.shippingLogistics),
  maintenanceSecurity: mergeSection(defaultSettingsState.maintenanceSecurity, apiSettings.maintenanceSecurity),
});

export const buildSettingsPayload = (settings) => ({
  platformRules: { ...settings.platformRules },
  paymentGateways: { ...settings.paymentGateways },
  shippingLogistics: { ...settings.shippingLogistics },
  maintenanceSecurity: { ...settings.maintenanceSecurity },
});
