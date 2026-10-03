import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";

export const initStoreOrderRevenue = async (store) => {
  if (!store || !store.id) return null;
  return orderService.initStoreRevenue(store);
};

export const getStoreOrderRevenue = async (storeId) => {
  if (!storeId) return null;
  return (await orderService.fetchStoreRevenueById(storeId)) || (await orderService.fetchOrderRevenue());
};

export const processOrderPayment = async (pendingOrder, currentUser = {}) => {
  if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) return;
  return orderService.processOrder(pendingOrder, currentUser);
};

export const restoreOrderInventory = async (items = []) => {
  if (!items || items.length === 0) return;
  for (const item of items) {
    try {
      const prod = await productService.fetchProductById(item.id);
      if (prod) {
        const newQty = (Number(prod.quantity) || 0) + (Number(item.quantity) || 1);
        await productService.updateProduct(item.id, { ...prod, quantity: newQty });
      }
    } catch (e) {
      console.warn("[restoreOrderInventory] error:", e.message);
    }
  }
};

export const updateStoreOrderStatus = async (storeId, orderId, newStatus) => {
  return orderService.updateOrderStatusInAllRevenue(orderId, newStatus, storeId);
};

export const cancelCustomerOrder = async (orderId) => {
  return orderService.updateOrderStatusInAllRevenue(orderId, "Cancelled");
};
