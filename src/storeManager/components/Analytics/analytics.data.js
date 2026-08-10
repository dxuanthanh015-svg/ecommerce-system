import { DEFAULT_PRODUCTS } from "../ProductManagement/productManagement.data";

const productImageMap = {
  lamp:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=200&auto=format&fit=crop",
  notebook:
    "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=200&auto=format&fit=crop",
  mug:
    "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?q=80&w=200&auto=format&fit=crop",
  bottle:
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200&auto=format&fit=crop",
  organizer:
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=200&auto=format&fit=crop",
};

const findProductImage = (title, fallbackIndex = 0) => {
  const matchedProduct = DEFAULT_PRODUCTS.find((product) =>
    title.toLowerCase().includes(product.title.toLowerCase().split(" ")[0].toLowerCase()),
  );

  if (matchedProduct?.imageUrl) {
    return matchedProduct.imageUrl;
  }

  const imageKeys = Object.keys(productImageMap);
  return productImageMap[imageKeys[fallbackIndex % imageKeys.length]];
};

export const defaultAnalyticsData = {
  header: {
    title: "Analytics & Financials",
    description: "Track your revenue, fees, and payouts.",
    exportLabel: "Export Report",
  },
  summaryCards: [
    {
      id: "gross-revenue",
      label: "Gross Revenue",
      value: 26500,
      valueType: "currency",
      delta: "+15.2%",
      note: "vs last month",
      trend: "positive",
      iconKey: "revenue",
      accent: "indigo",
    },
    {
      id: "platform-fees",
      label: "Platform Fees",
      value: 1325,
      valueType: "currency",
      delta: "5%",
      note: "Commission",
      trend: "negative",
      iconKey: "fees",
      accent: "rose",
    },
    {
      id: "net-revenue",
      label: "Net Revenue",
      value: 25175,
      valueType: "currency",
      delta: "+14.8%",
      note: "vs last month",
      trend: "positive",
      iconKey: "net",
      accent: "emerald",
    },
  ],
  revenueBreakdown: {
    title: "Revenue vs Fees Breakdown",
    activeRange: "Last 6 Months",
    rangeOptions: ["Last 6 Months", "Last 12 Months", "Year to Date"],
    series: [
      { month: "Jan", netRevenue: 9800, platformFees: 1600 },
      { month: "Feb", netRevenue: 11500, platformFees: 1700 },
      { month: "Mar", netRevenue: 13800, platformFees: 2100 },
      { month: "Apr", netRevenue: 10600, platformFees: 1400 },
      { month: "May", netRevenue: 15100, platformFees: 2300 },
      { month: "Jun", netRevenue: 15050, platformFees: 2200 },
    ],
  },
  transferHistory: {
    title: "Transfer History",
    filterLabel: "Filter",
    items: [
      {
        id: "TRF-98234-AX",
        date: "Oct 15, 2023",
        grossAmount: 4500,
        feeAmount: 225,
        netTransferred: 4275,
        status: "Completed",
      },
      {
        id: "TRF-98233-AX",
        date: "Oct 08, 2023",
        grossAmount: 3850,
        feeAmount: 192.5,
        netTransferred: 3657.5,
        status: "Completed",
      },
      {
        id: "TRF-98232-AX",
        date: "Oct 01, 2023",
        grossAmount: 5120,
        feeAmount: 256,
        netTransferred: 4864,
        status: "Reconciled",
      },
    ],
  },
  rankedLists: [
    {
      id: "best-sellers",
      title: "Top 5 Best Sellers",
      metricType: "currency",
      items: [
        {
          id: "best-1",
          name: "Premium Leather Notebook",
          subLabel: "482 Sales",
          metricValue: 15424,
          imageUrl: findProductImage("Premium Leather Notebook", 1),
        },
        {
          id: "best-2",
          name: "Ceramic Pour-Over Dripper",
          subLabel: "215 Sales",
          metricValue: 10320,
          imageUrl: findProductImage("Ceramic Pour-Over Dripper", 2),
        },
        {
          id: "best-3",
          name: "Minimalist Brass Lamp",
          subLabel: "124 Sales",
          metricValue: 17980,
          imageUrl: findProductImage("Minimalist Brass Lamp", 3),
        },
        {
          id: "best-4",
          name: "Matte Ceramic Mug",
          subLabel: "89 Sales",
          metricValue: 2136,
          imageUrl: findProductImage("Matte Ceramic Mug", 4),
        },
        {
          id: "best-5",
          name: "Steel Water Bottle",
          subLabel: "72 Sales",
          metricValue: 2520,
          imageUrl: findProductImage("Steel Water Bottle", 0),
        },
      ],
    },
    {
      id: "most-viewed",
      title: "Most Viewed Products",
      metricType: "number",
      metricPrefix: "",
      items: [
        {
          id: "view-1",
          name: "Minimalist Brass Lamp",
          subLabel: "Conv. Rate: 4.2%",
          metricValue: 2945,
          imageUrl: findProductImage("Minimalist Brass Lamp", 3),
        },
        {
          id: "view-2",
          name: "Premium Leather Notebook",
          subLabel: "Conv. Rate: 18.1%",
          metricValue: 2658,
          imageUrl: findProductImage("Premium Leather Notebook", 1),
        },
        {
          id: "view-3",
          name: "Steel Water Bottle",
          subLabel: "Conv. Rate: 4.8%",
          metricValue: 1489,
          imageUrl: findProductImage("Steel Water Bottle", 0),
        },
        {
          id: "view-4",
          name: "Ceramic Pour-Over Dripper",
          subLabel: "Conv. Rate: 16.2%",
          metricValue: 1324,
          imageUrl: findProductImage("Ceramic Pour-Over Dripper", 2),
        },
        {
          id: "view-5",
          name: "Wire Desk Organizer",
          subLabel: "Conv. Rate: 3.1%",
          metricValue: 1105,
          imageUrl: findProductImage("Wire Desk Organizer", 4),
        },
      ],
    },
  ],
};

export const createAnalyticsState = (apiData = {}) => ({
  ...defaultAnalyticsData,
  ...apiData,
  header: {
    ...defaultAnalyticsData.header,
    ...(apiData.header || {}),
  },
  summaryCards: (apiData.summaryCards || defaultAnalyticsData.summaryCards).map((card) => ({
    ...card,
  })),
  revenueBreakdown: {
    ...defaultAnalyticsData.revenueBreakdown,
    ...(apiData.revenueBreakdown || {}),
    rangeOptions:
      apiData.revenueBreakdown?.rangeOptions ||
      defaultAnalyticsData.revenueBreakdown.rangeOptions,
    series: (
      apiData.revenueBreakdown?.series || defaultAnalyticsData.revenueBreakdown.series
    ).map((point) => ({ ...point })),
  },
  transferHistory: {
    ...defaultAnalyticsData.transferHistory,
    ...(apiData.transferHistory || {}),
    items: (
      apiData.transferHistory?.items || defaultAnalyticsData.transferHistory.items
    ).map((item) => ({ ...item })),
  },
  rankedLists: (apiData.rankedLists || defaultAnalyticsData.rankedLists).map((list) => ({
    ...list,
    items: list.items.map((item) => ({ ...item })),
  })),
});
