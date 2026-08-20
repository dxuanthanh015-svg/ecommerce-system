import { product_mock_data } from "../../Data/product_mock_data";

/**
 * Initialize orderRevenue for a newly created store
 */
export const initStoreOrderRevenue = (store) => {
  if (!store || !store.id) return;
  const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
  
  const initialRevenue = {
    storeId: store.id,
    storeName: store.name || "My Store",
    totalRevenue: 0,
    todayRevenue: 0,
    orders: [],
  };

  allStoreRevenue[store.id] = initialRevenue;
  localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));
  localStorage.setItem("orderRevenue", JSON.stringify(initialRevenue));
  return initialRevenue;
};

/**
 * Get store order & revenue data, automatically recalculating today's revenue
 */
export const getStoreOrderRevenue = (storeId) => {
  if (!storeId) return null;
  const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};

  let storeData = allStoreRevenue[storeId];
  if (!storeData) {
    storeData = {
      storeId: storeId,
      storeName: currentStore.name || "My Store",
      totalRevenue: 0,
      todayRevenue: 0,
      orders: [],
    };
    allStoreRevenue[storeId] = storeData;
    localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));
  }

  // Recalculate today's revenue based on orders placed today
  const todayStr = new Date().toDateString();
  const todayOrders = storeData.orders.filter((order) => {
    if (!order.date) return false;
    const orderDateStr = new Date(order.date).toDateString();
    return orderDateStr === todayStr;
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
  const totalRevenue = storeData.orders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);

  storeData.todayRevenue = todayRevenue;
  storeData.totalRevenue = totalRevenue;

  allStoreRevenue[storeId] = storeData;
  localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));

  return storeData;
};

/**
 * Process order payment:
 * 1. Deduct in-stock quantity of each purchased product in localStorage["products"] and currentProducts
 * 2. Group items by store and update orderRevenue for each respective store
 */
export const processOrderPayment = (pendingOrder, currentUser = {}) => {
  if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) return;

  const purchasedItems = pendingOrder.items;

  // 1. DEDUCT IN-STOCK QUANTITY OF PRODUCTS
  const savedProducts = JSON.parse(localStorage.getItem("products"));
  const allProducts = (savedProducts && savedProducts.length > 0) ? savedProducts : product_mock_data;

  const updatedProducts = allProducts.map((prod) => {
    const matchedPurchased = purchasedItems.filter((p) => String(p.id) === String(prod.id));
    if (matchedPurchased.length === 0) return prod;

    const totalBoughtQty = matchedPurchased.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const newTotalQuantity = Math.max(0, (Number(prod.quantity) || 0) - totalBoughtQty);

    // Update size quantities if available
    let updatedSizes = prod.size;
    if (Array.isArray(prod.size)) {
      updatedSizes = prod.size.map((s) => {
        const sizeBought = matchedPurchased
          .filter((item) => (item.size || "M").toLowerCase() === (s.name || "").toLowerCase())
          .reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

        if (sizeBought > 0) {
          const currentSizeQty = s.quantity !== undefined ? Number(s.quantity) : 10;
          return {
            ...s,
            quantity: Math.max(0, currentSizeQty - sizeBought),
          };
        }
        return s;
      });
    }

    return {
      ...prod,
      quantity: newTotalQuantity,
      size: updatedSizes,
      stockLeft: prod.stockLeft !== undefined ? Math.max(0, prod.stockLeft - totalBoughtQty) : newTotalQuantity,
    };
  });

  localStorage.setItem("products", JSON.stringify(updatedProducts));

  // Sync to currentProducts if present
  const currentProducts = JSON.parse(localStorage.getItem("currentProducts"));
  if (currentProducts && currentProducts.length > 0) {
    const updatedCurrent = currentProducts.map((cp) => {
      const foundInUpdated = updatedProducts.find((p) => String(p.id) === String(cp.id));
      return foundInUpdated || cp;
    });
    localStorage.setItem("currentProducts", JSON.stringify(updatedCurrent));
  }

  // 2. GROUP PURCHASED ITEMS BY STORE AND RECORD STORE ORDER REVENUE
  const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
  const activeCurrentStore = JSON.parse(localStorage.getItem("currentStore")) || {};

  // Group items by storeId
  const storeGroups = {};
  purchasedItems.forEach((item) => {
    const storeId = item.id_store || item.storeId || "store-001";
    if (!storeGroups[storeId]) {
      storeGroups[storeId] = [];
    }
    storeGroups[storeId].push(item);
  });

  const nowISO = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  Object.entries(storeGroups).forEach(([storeId, items]) => {
    const storeSubtotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const storeTax = storeSubtotal * 0.08;
    const storeTotal = storeSubtotal + storeTax;

    const storeOrder = {
      orderId: pendingOrder.orderId,
      storeId: storeId,
      customer: pendingOrder.address?.fullName || `${currentUser.firstName || "Customer"} ${currentUser.lastName || ""}`.trim() || "Customer",
      customerEmail: currentUser.email || pendingOrder.address?.email || "customer@example.com",
      phone: pendingOrder.address?.phone || "",
      date: nowISO,
      formattedDate: formattedDate,
      total: storeTotal,
      totalAmount: storeTotal,
      subtotal: storeSubtotal,
      tax: storeTax,
      status: "Pending",
      paymentMethod: pendingOrder.paymentMethod || "VietQR",
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        size: item.size || "M",
        color: item.color || "Default",
        imageUrl: item.imageUrl,
        subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
      })),
      shippingAddress: pendingOrder.address || {},
    };

    if (!allStoreRevenue[storeId]) {
      allStoreRevenue[storeId] = {
        storeId: storeId,
        storeName: "Store",
        totalRevenue: 0,
        todayRevenue: 0,
        orders: [],
      };
    }

    allStoreRevenue[storeId].orders = [storeOrder, ...(allStoreRevenue[storeId].orders || [])];

    // Recalculate totals
    const todayStr = new Date().toDateString();
    allStoreRevenue[storeId].todayRevenue = allStoreRevenue[storeId].orders
      .filter((o) => o.date && new Date(o.date).toDateString() === todayStr)
      .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);

    allStoreRevenue[storeId].totalRevenue = allStoreRevenue[storeId].orders.reduce(
      (sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0),
      0
    );

    // If currently logged in manager manages this store, sync to orderRevenue key
    if (activeCurrentStore?.id && String(activeCurrentStore.id) === String(storeId)) {
      localStorage.setItem("orderRevenue", JSON.stringify(allStoreRevenue[storeId]));
    }
  });

  localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));
};

/**
 * Update store order status (e.g., from Pending to Processing or Shipped)
 */
export const updateStoreOrderStatus = (storeId, orderId, newStatus) => {
  const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
  if (allStoreRevenue[storeId]) {
    allStoreRevenue[storeId].orders = allStoreRevenue[storeId].orders.map((o) =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));

    const activeCurrentStore = JSON.parse(localStorage.getItem("currentStore")) || {};
    if (String(activeCurrentStore?.id) === String(storeId)) {
      localStorage.setItem("orderRevenue", JSON.stringify(allStoreRevenue[storeId]));
    }
  }

  // Also sync in userOrders if customer views it
  const userOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
  const updatedUserOrders = userOrders.map((o) =>
    o.orderId === orderId ? { ...o, status: newStatus } : o
  );
  localStorage.setItem("userOrders", JSON.stringify(updatedUserOrders));
};
