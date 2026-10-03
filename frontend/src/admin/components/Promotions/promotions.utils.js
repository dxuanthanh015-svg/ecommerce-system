export const formatCompactValue = (value, valueType) => {
  if (valueType === "currencyCompact") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
};

export const getMetricAccentClasses = (accent = "indigo") => {
  switch (accent) {
    case "slate":
      return "bg-slate-100 text-slate-600";
    case "violet":
      return "bg-violet-100 text-violet-600";
    default:
      return "bg-indigo-100 text-indigo-600";
  }
};

export const getPromotionStatusClasses = (status = "") => {
  switch (status.toLowerCase()) {
    case "expired":
      return "bg-slate-100 text-slate-500";
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "draft":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-indigo-100 text-indigo-600";
  }
};

export const getPromotionTypeClasses = (type = "") => {
  switch (type.toLowerCase()) {
    case "amount":
      return "bg-violet-100 text-violet-700";
    case "shipping":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-indigo-100 text-indigo-700";
  }
};

export const formatPromotionType = (type = "") => {
  switch (type.toLowerCase()) {
    case "amount":
      return "Flat Amount";
    case "shipping":
      return "Free Shipping";
    default:
      return "Percentage";
  }
};

export const getPromotionUsageProgress = (usageCount = 0) =>
  Math.max(12, Math.min(100, Math.round((usageCount / 1000) * 100)));

export const filterPromotionsByTab = (promotions = [], activeTab = "All") => {
  if (activeTab === "All") {
    return promotions;
  }

  return promotions.filter((promotion) => promotion.status === activeTab);
};
