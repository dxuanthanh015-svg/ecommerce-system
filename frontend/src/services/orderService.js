import apiClient from './apiClient'

// ==========================================
// HELPER FUNCTIONS (thuần client-side, không liên quan mock server)
// ==========================================

// Sắp xếp đơn hàng mới nhất lên đầu
export const sortOrdersByNewest = (ordersList = []) => {
  if (!Array.isArray(ordersList)) return []
  return [...ordersList].sort((a, b) => {
    const getTime = (o) => {
      if (o?.createdAt) return new Date(o.createdAt).getTime()
      if (o?.date) return new Date(o.date).getTime()
      return 0
    }
    return getTime(b) - getTime(a)
  })
}

const normalizeOrder = (order) => {
  if (!order) return order
  const rawStatus = String(order.orderStatus || order.status || 'PENDING').toUpperCase()
  const status = rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()
  return { ...order, status, orderStatus: status }
}

// Chuẩn hóa thông tin giao hàng từ nhiều cấu trúc address khác nhau
export const getOrderDeliveryInfo = (order = {}) => {
  const addrObj = order.shippingAddress || order.address || order.deliveryAddress || {}

  if (typeof addrObj === 'string' && addrObj.trim()) {
    return {
      recipientName: order.customerName || 'Khách hàng',
      phone: order.phone || 'Chưa cung cấp SĐT',
      email: order.customerEmail || order.email || '',
      addressLine: addrObj,
      cityLine: '',
      fullAddress: addrObj,
    }
  }

  const fullName =
    addrObj.fullName ||
    [addrObj.firstName, addrObj.lastName].filter(Boolean).join(' ') ||
    order.customerName ||
    'Khách hàng'

  const phone = addrObj.phone || addrObj.phoneNumber || order.phone || 'Chưa cung cấp SĐT'
  const email = addrObj.email || order.customerEmail || order.email || ''

  const addressLine =
    addrObj.address || addrObj.streetAddress || addrObj.street || addrObj.line1 || ''

  const cityParts = [addrObj.ward, addrObj.district, addrObj.city, addrObj.state, addrObj.zipCode, addrObj.country].filter(Boolean)
  const cityLine = cityParts.join(', ')
  const fullAddress = [addressLine, cityLine].filter(Boolean).join(', ')

  return { recipientName: fullName, phone, email, addressLine, cityLine, fullAddress }
}

// ==========================================
// ORDER SERVICE - Gọi Spring Boot API
// TODO: Backend cần implement các endpoint dưới đây
// ==========================================

export const orderService = {

  // POST /orders -> Tạo đơn hàng mới
  // Backend tự gán: orderId, createdAt, status='PENDING'
  // payload: { items, shippingAddress, paymentMethod, voucherCode, discountAmount }
  createOrder: async (orderPayload) => {
    try {
      const res = await apiClient.post('/orders', orderPayload)
      return res.data.result
    } catch (error) {
      console.warn('[orderService] createOrder error:', error.message)
      throw error
    }
  },

  // GET /orders -> Lấy toàn bộ đơn hàng (Admin)
  fetchOrders: async (filters = {}) => {
    try {
      const res = await apiClient.get('/orders', { params: filters })
      return res.data.result || []
    } catch (error) {
      console.warn('[orderService] fetchOrders error:', error.response?.data || error.message)
      throw error
    }
  },

  // GET /orders/{orderId} -> Lấy chi tiết 1 đơn hàng (Admin)
  fetchOrderById: async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`)
      return res.data.result || null
    } catch (error) {
      console.warn('[orderService] fetchOrderById error:', error.message)
      return null
    }
  },

  // PATCH /orders/{orderId}/status -> Cập nhật trạng thái đơn hàng (Admin/Store Manager)
  // payload: { status }
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus })
      return normalizeOrder(res.data.result)
    } catch (error) {
      console.warn('[orderService] updateOrderStatus error:', error.message)
      throw error
    }
  },

  confirmReceived: async (orderId) => {
    try {
      const res = await apiClient.patch(`/orders/my-orders/${orderId}/confirm-received`)
      return res.data.result
    } catch (error) {
      console.warn('[orderService] confirmReceived error:', error.response?.data || error.message)
      throw error
    }
  },

  // DELETE /orders/{orderId} -> Xóa đơn hàng (Admin)
  deleteOrder: async (orderId) => {
    try {
      await apiClient.delete(`/orders/${orderId}`)
      return true
    } catch (error) {
      console.warn('[orderService] deleteOrder error:', error.message)
      throw error
    }
  },

  // GET /orders/my-orders -> Lấy đơn hàng của user đang đăng nhập (via JWT)
  fetchUserOrders: async () => {
    try {
      const res = await apiClient.get('/orders/my-orders')
      return sortOrdersByNewest((res.data.result || []).map(normalizeOrder))
    } catch (error) {
      console.warn('[orderService] fetchUserOrders error:', error.message)
      return []
    }
  },

  // GET /orders/my-orders/{orderId} -> Lấy chi tiết 1 đơn hàng của user hiện tại
  fetchUserOrderById: async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/my-orders/${orderId}`)
      return normalizeOrder(res.data.result || null)
    } catch (error) {
      console.warn('[orderService] fetchUserOrderById error:', error.message)
      return null
    }
  },

  // GET /orders/store/my-store -> Lấy đơn hàng của store hiện tại (Store Manager, via JWT)
  fetchStoreOrders: async (filters = {}) => {
    try {
      const res = await apiClient.get('/orders/store/my-store', { params: filters })
      return sortOrdersByNewest((res.data.result || []).map(normalizeOrder))
    } catch (error) {
      console.warn('[orderService] fetchStoreOrders error:', error.message)
      throw error
    }
  },

  // GET /orders/store/{storeId} -> Lấy đơn hàng theo storeId (Admin)
  fetchOrdersByStoreId: async (storeId, filters = {}) => {
    try {
      const res = await apiClient.get(`/orders/store/${storeId}`, { params: filters })
      return sortOrdersByNewest(res.data.result || [])
    } catch (error) {
      console.warn('[orderService] fetchOrdersByStoreId error:', error.message)
      return []
    }
  },

  // GET /orders/store/my-store/revenue -> Lấy dữ liệu doanh thu cửa hàng hiện tại
  fetchStoreRevenue: async () => {
    try {
      const res = await apiClient.get('/orders/store/my-store/revenue')
      return res.data.result || null
    } catch (error) {
      console.warn('[orderService] fetchStoreRevenue error:', error.message)
      return null
    }
  },

  // GET /orders/store/{storeId}/revenue -> Lấy doanh thu theo storeId (Admin)
  fetchStoreRevenueById: async (storeId) => {
    try {
      const res = await apiClient.get(`/orders/store/${storeId}/revenue`)
      return res.data.result || null
    } catch (error) {
      console.warn('[orderService] fetchStoreRevenueById error:', error.message)
      return null
    }
  },

  // GET /orders/revenue/all-stores -> Lấy doanh thu tổng hợp tất cả các store (Admin)
  fetchAllStoreRevenue: async () => {
    try {
      const res = await apiClient.get('/orders/revenue/all-stores')
      return res.data.result || {}
    } catch (error) {
      console.warn('[orderService] fetchAllStoreRevenue error:', error.message)
      return {}
    }
  },

  // POST /orders/process -> Xử lý đặt hàng (tạo order + ghi revenue trong 1 transaction)
  // Backend đảm nhiệm: gán orderId, tính revenue theo từng store, cập nhật totalSales
  // payload: { items, shippingAddress, paymentMethod, voucherCode, discountAmount }
  processOrder: async (orderPayload) => {
    try {
      const sourceAddress = orderPayload?.address || orderPayload?.shippingAddress || {};
      const recipientName = sourceAddress.recipientName || sourceAddress.fullName ||
        [sourceAddress.firstName, sourceAddress.lastName].filter(Boolean).join(' ');
      const payload = {
        orderCode: orderPayload?.orderCode || orderPayload?.orderId,
        storeId: orderPayload?.storeId || orderPayload?.items?.[0]?.storeId || orderPayload?.items?.[0]?.id_store,
        voucherCode: orderPayload?.voucherCode || null,
        paymentMethod: 'QR_CODE',
        tax: orderPayload?.tax,
        shippingFee: orderPayload?.shippingFee,
        address: {
          recipientName,
          phone: sourceAddress.phone || sourceAddress.phoneNumber,
          streetAddress: sourceAddress.streetAddress || sourceAddress.address || sourceAddress.specificAddress || sourceAddress.addressLine,
          city: sourceAddress.city,
          district: sourceAddress.district,
        },
        items: (orderPayload?.items || []).map((item) => ({
          productId: item.productId || item.product?.id || item.id,
          title: item.title || item.name,
          imageUrl: item.imageUrl || item.image,
          size: item.size,
          color: item.color,
          quantity: Number(item.quantity) || 1,
        })),
      };
      const res = await apiClient.post('/orders/process', payload)
      return res.data.result
    } catch (error) {
      console.warn('[orderService] processOrder error:', error.response?.data || error.message)
      throw error
    }
  },

  // PATCH /orders/{orderId}/status -> Cập nhật status và đồng bộ revenue (Store Manager)
  updateOrderStatusInAllRevenue: async (orderId, newStatus) => {
    try {
      const res = await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus })
      return normalizeOrder(res.data.result)
    } catch (error) {
      console.warn('[orderService] updateOrderStatusInAllRevenue error:', error.response?.data || error.message)
      throw error
    }
  },

  confirmOrderReceived: async (orderId) => {
    try {
      const res = await apiClient.patch(`/orders/my-orders/${orderId}/confirm-received`)
      return normalizeOrder(res.data.result)
    } catch (error) {
      console.warn('[orderService] confirmOrderReceived error:', error.response?.data || error.message)
      throw error
    }
  },
}

export default orderService
