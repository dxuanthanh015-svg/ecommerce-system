export const storeSettingsBannerUrl =
  "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-may-tinh-dep-a-19-1.jpg";

export const defaultStoreSettings = {
  brandIdentity: {
    storeName: "Aura Minimalist Goods",
    contactEmail: "hello@auragoods.com",
    bio: "Curated essential goods for the modern, mindful home. We believe in quality over quantity, sustainable sourcing, and timeless design aesthetics.",
    logoImage: "/nexCart.svg",
    bannerImage: storeSettingsBannerUrl,
  },
  payoutDetails: {
    bankName: "",
    accountHolder: "",
    routingNumber: "123456789",
    accountNumber: "9876543210",
  },
  fulfillmentCenter: {
    streetAddress: "100 Innovation Drive, Suite 400",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
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
});

export const cloneStoreSettings = (storeSettings) =>
  createStoreSettingsState(storeSettings);

export const buildStoreSettingsPayload = (storeSettings) => ({
  brandIdentity: { ...storeSettings.brandIdentity },
  payoutDetails: { ...storeSettings.payoutDetails },
  fulfillmentCenter: { ...storeSettings.fulfillmentCenter },
});
