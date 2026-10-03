export const storeSettingsBannerUrl =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop";

export const defaultStoreSettings = {
  brandIdentity: {
    storeName: "Aura Minimalist Goods",
    contactEmail: "hello@auragoods.com",
    phone: "+1 (555) 234-5678",
    category: "Home & Living",
    bio: "Curated essential goods for the modern, mindful home. We believe in quality over quantity, sustainable sourcing, and timeless design aesthetics.",
    logoImage: "/nexCart.svg",
    bannerImage: storeSettingsBannerUrl,
  },
  payoutDetails: {
    bankName: "Chase Bank",
    accountHolder: "Aura Goods LLC",
    routingNumber: "123456789",
    accountNumber: "9876543210",
    payoutSchedule: "weekly", // weekly, biweekly, monthly
  },
  fulfillmentCenter: {
    streetAddress: "100 Innovation Drive, Suite 400",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States",
    processingTime: "1-2 business days",
    freeShippingThreshold: 50,
  },
  customerPolicies: {
    returnWindowDays: 30,
    freeReturns: true,
    restockingFee: 0,
    returnPolicyText: "Items can be returned within 30 days of receipt in original condition and packaging. Return shipping is free for all domestic orders.",
    shippingPolicyText: "Standard orders are processed within 1-2 business days. Express shipping is available at checkout with 2-day delivery guaranteed.",
    warrantyMonths: 12,
    privacyPolicyText: "We value customer privacy and do not sell or share personal information with third parties without explicit consent.",
  },
  storeOperations: {
    vacationMode: false,
    vacationMessage: "Our store is currently on vacation mode and will resume taking orders soon.",
    emailNotifications: true,
    lowStockThreshold: 5,
  },
};

const mergeSection = (defaults, incomingSection = {}) => ({
  ...defaults,
  ...incomingSection,
});

export const createStoreSettingsState = (apiStoreSettings = {}) => ({
  brandIdentity: mergeSection(
    defaultStoreSettings.brandIdentity,
    apiStoreSettings.brandIdentity
  ),
  payoutDetails: mergeSection(
    defaultStoreSettings.payoutDetails,
    apiStoreSettings.payoutDetails
  ),
  fulfillmentCenter: mergeSection(
    defaultStoreSettings.fulfillmentCenter,
    apiStoreSettings.fulfillmentCenter
  ),
  customerPolicies: mergeSection(
    defaultStoreSettings.customerPolicies,
    apiStoreSettings.customerPolicies
  ),
  storeOperations: mergeSection(
    defaultStoreSettings.storeOperations,
    apiStoreSettings.storeOperations
  ),
});

export const cloneStoreSettings = (storeSettings) =>
  createStoreSettingsState(storeSettings);

export const buildStoreSettingsPayload = (storeSettings) => ({
  brandIdentity: { ...storeSettings.brandIdentity },
  payoutDetails: { ...storeSettings.payoutDetails },
  fulfillmentCenter: { ...storeSettings.fulfillmentCenter },
  customerPolicies: { ...storeSettings.customerPolicies },
  storeOperations: { ...storeSettings.storeOperations },
});
