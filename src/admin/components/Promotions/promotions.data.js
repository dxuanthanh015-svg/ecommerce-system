export const defaultPromotionsPageData = {
  header: {
    title: "Vouchers & Promotions",
    description:
      "Manage active discounts, create new campaigns, and track usage across your storefront.",
    createLabel: "Create New Voucher",
  },
  metrics: [
    {
      id: "active-vouchers",
      label: "Active Vouchers",
      value: 12,
      iconKey: "voucher",
      accent: "indigo",
    },
    {
      id: "total-usage",
      label: "Total Usage",
      value: 1402,
      iconKey: "usage",
      accent: "slate",
    },
    {
      id: "revenue-impact",
      label: "Revenue Impact",
      value: 8400,
      valueType: "currencyCompact",
      iconKey: "impact",
      accent: "violet",
    },
  ],
  quickCreate: {
    title: "Quick Create",
    draftButtonLabel: "Save as Draft",
    publishButtonLabel: "Publish Voucher",
    form: {
      code: "SUMMER24",
      discountType: "Percentage",
      value: "20",
      startDate: "",
      endDate: "",
      limitPerCustomer: false,
    },
    discountTypes: ["Percentage", "Flat Amount", "Free Shipping"],
  },
  recentPromotions: {
    title: "Recent Promotions",
    tabs: ["All", "Active", "Draft", "Expired"],
    viewAllLabel: "View All Promotions",
    items: [
      {
        id: "welcome20",
        code: "WELCOME20",
        description: "20% off all new customer orders",
        usageCount: 342,
        scheduleLabel: "Ends Dec 31",
        status: "Active",
        type: "percentage",
      },
      {
        id: "freeship50",
        code: "FREESHIP50",
        description: "Free shipping over $50",
        usageCount: 89,
        scheduleLabel: "Ongoing",
        status: "Active",
        type: "shipping",
      },
      {
        id: "bfcm10",
        code: "BFCM10",
        description: "$10 off specific categories",
        usageCount: 950,
        scheduleLabel: "Ended Nov 28",
        status: "Expired",
        type: "amount",
      },
    ],
  },
};

export const createPromotionsPageState = (apiData = {}) => ({
  ...defaultPromotionsPageData,
  ...apiData,
  header: {
    ...defaultPromotionsPageData.header,
    ...(apiData.header || {}),
  },
  metrics: (apiData.metrics || defaultPromotionsPageData.metrics).map((metric) => ({
    ...metric,
  })),
  quickCreate: {
    ...defaultPromotionsPageData.quickCreate,
    ...(apiData.quickCreate || {}),
    form: {
      ...defaultPromotionsPageData.quickCreate.form,
      ...(apiData.quickCreate?.form || {}),
    },
    discountTypes:
      apiData.quickCreate?.discountTypes ||
      defaultPromotionsPageData.quickCreate.discountTypes,
  },
  recentPromotions: {
    ...defaultPromotionsPageData.recentPromotions,
    ...(apiData.recentPromotions || {}),
    tabs:
      apiData.recentPromotions?.tabs ||
      defaultPromotionsPageData.recentPromotions.tabs,
    items: (
      apiData.recentPromotions?.items ||
      defaultPromotionsPageData.recentPromotions.items
    ).map((item) => ({ ...item })),
  },
});

export const clonePromotionDraft = (draft) => ({ ...draft });

export const createPromotionFromDraft = (draft, status = "Draft") => {
  const resolvedCode = draft.code?.trim() || "NEWPROMO";
  const normalizedType = draft.discountType?.toLowerCase() || "percentage";
  let type = "percentage";

  if (normalizedType.includes("flat")) {
    type = "amount";
  } else if (normalizedType.includes("shipping")) {
    type = "shipping";
  }

  const hasSchedule = draft.startDate || draft.endDate;
  const scheduleLabel = hasSchedule
    ? `${draft.startDate || "Starts now"} - ${draft.endDate || "No end date"}`
    : "Starts immediately";

  let description = `${draft.value || "0"}% off your campaign`;

  if (type === "amount") {
    description = `$${draft.value || "0"} off selected orders`;
  } else if (type === "shipping") {
    description = "Free shipping offer for selected shoppers";
  }

  return {
    id: `${resolvedCode.toLowerCase()}-${status.toLowerCase()}`,
    code: resolvedCode,
    description,
    usageCount: 0,
    scheduleLabel,
    status,
    type,
  };
};
