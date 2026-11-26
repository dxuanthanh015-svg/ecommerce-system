import apiClient from "./apiClient";

const toOrderRequest = (order = {}) => {
  const address = order.address || order.shippingAddress || {};
  return {
    storeId: order.storeId || order.items?.[0]?.storeId || order.items?.[0]?.id_store,
    voucherCode: order.voucherCode || null,
    paymentMethod: "VNPAY",
    address: {
      recipientName: address.recipientName || address.fullName ||
        [address.firstName, address.lastName].filter(Boolean).join(" "),
      phone: address.phone || address.phoneNumber,
      streetAddress: address.streetAddress || address.address || address.specificAddress || address.addressLine,
      city: address.city,
      district: address.district,
    },
    items: (order.items || []).map((item) => ({
      productId: item.productId || item.product?.id || item.id,
      title: item.title || item.name,
      imageUrl: item.imageUrl || item.image,
      size: item.size,
      color: item.color,
      quantity: Number(item.quantity) || 1,
    })),
  };
};

export const vnpayService = {
  createPayment: async (order) => {
    const response = await apiClient.post("/payments/vnpay/create", toOrderRequest(order));
    return response.data.result;
  },

  getStatus: async (transactionCode) => {
    const response = await apiClient.get(`/payments/vnpay/status/${encodeURIComponent(transactionCode)}`);
    return response.data.result;
  },
};
