const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY
import storeService from './storeService';


export const sortOrdersByNewest = (ordersList = []) => {
  if (!Array.isArray(ordersList)) return [];
  return [...ordersList].sort((a, b) => {
    const getTime = (o) => {
      if (!o) return 0;
      if (o.date) {
        const t = new Date(o.date).getTime();
        if (!isNaN(t)) return t;
      }
      if (o.createdAt) {
        const t = new Date(o.createdAt).getTime();
        if (!isNaN(t)) return t;
      }
      if (o.orderId && typeof o.orderId === 'string') {
        const match = o.orderId.match(/\d{10,}/);
        if (match) return Number(match[0]);
      }
      if (o.id && typeof o.id === 'string') {
        const match = o.id.match(/\d{10,}/);
        if (match) return Number(match[0]);
      }
      return 0;
    };
    return getTime(b) - getTime(a);
  });
};

export const getOrderDeliveryInfo = (order = {}) => {
  const addrObj =
    order.shippingAddress ||
    order.address ||
    order.deliveryAddress ||
    order.shipping ||
    {};

  // If address is passed as a plain string
  if (typeof addrObj === "string" && addrObj.trim()) {
    return {
      recipientName: order.customerName || order.customer || "Khách hàng",
      phone: order.phone || order.phoneNumber || "Chưa cung cấp SĐT",
      email: order.customerEmail || order.email || "Chưa cung cấp email",
      addressLine: addrObj,
      cityLine: "",
      fullAddress: addrObj,
    };
  }

  // Recipient Name
  const fullName =
    addrObj.fullName ||
    [addrObj.firstName, addrObj.lastName].filter(Boolean).join(" ") ||
    order.customerName ||
    order.customer ||
    "Khách hàng";

  // Phone
  const phone =
    addrObj.phone ||
    addrObj.phoneNumber ||
    order.phone ||
    order.phoneNumber ||
    "Chưa cung cấp SĐT";

  // Email
  const email =
    addrObj.email ||
    order.customerEmail ||
    order.email ||
    "Chưa cung cấp email";

  // Address Line (Street / House)
  const addressLine =
    addrObj.address ||
    addrObj.streetAddress ||
    addrObj.street ||
    addrObj.line1 ||
    (typeof order.address === "string" ? order.address : "") ||
    "Chưa có địa chỉ đường/số nhà";

  // City Line (District, Ward, City, State, Country)
  const cityParts = [
    addrObj.ward,
    addrObj.district,
    addrObj.city,
    addrObj.state,
    addrObj.zipCode,
    addrObj.country,
  ].filter(Boolean);

  const cityLine = cityParts.join(", ");
  const fullAddress = [addressLine, cityLine].filter(Boolean).join(", ");

  return {
    recipientName: fullName,
    phone,
    email,
    addressLine,
    cityLine,
    fullAddress,
  };
};

const findMongoId = (list, id) => {
  const matched = list.find(
    (o) =>
      String(o.orderId || o.id) === String(id) ||
      String(o._id) === String(id)
  )
  return matched ? (matched._id || matched.id) : id
}

export const orderService = {
  createOrder: async (orderPayload) => {
    try {
      const newOrder = {
        id: orderPayload.orderId || `ord_${Date.now()}`,
        orderId: orderPayload.orderId || `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        ...orderPayload,
      }
      const res = await fetch(`${BASE_URL}/orders?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const json = await res.json()
      return json.data || newOrder
    } catch (error) {
      console.warn('[orderService] createOrder error:', error.message)
      throw error
    }
  },

  fetchOrders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const json = await res.json()
      let list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list
    } catch (error) {
      console.warn('[orderService] fetchOrders error:', error.message)
      return []
    }
  },

  fetchOrderById: async (orderId) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const json = await res.json()
      return json.data || null
    } catch (error) {
      console.warn('[orderService] fetchOrderById error:', error.message)
      return null
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const order = await orderService.fetchOrderById(orderId)
      if (!order) throw new Error('Order not found')

      const updateRes = await fetch(`${BASE_URL}/orders/${order._id}?apiKey=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, status: newStatus }),
      })
      if (!updateRes.ok) throw new Error('Failed to update order status')
      return { orderId, status: newStatus }
    } catch (error) {
      console.warn('[orderService] updateOrderStatus error:', error.message)
      throw error
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const order = await orderService.fetchOrderById(orderId)
      if (!order) throw new Error('Order not found')

      const deleteRes = await fetch(`${BASE_URL}/orders/${order._id}?apiKey=${API_KEY}`, {
        method: 'DELETE',
      })
      if (!deleteRes.ok) throw new Error('Failed to delete order')
      return true
    } catch (error) {
      console.warn('[orderService] deleteOrder error:', error.message)
      throw error
    }
  },

  fetchUserOrders: async (userEmail) => {
    try {
      const res = await fetch(`${BASE_URL}/userOrders?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch userOrders')
      const json = await res.json()
      let list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      if (userEmail) {
        list = list.filter((o) => {
          const email = o.customerEmail || o.address?.email || o.shippingAddress?.email || o.email;
          return email && email.toLowerCase() === userEmail.toLowerCase();
        });
      }
      return sortOrdersByNewest(list);
    } catch (error) {
      console.warn('[orderService] fetchUserOrders error:', error.message)
      return []
    }
  },

  fetchUserOrderById: async (orderId, cachedOrders) => {
    try {
      const res = await fetch(`${BASE_URL}/userOrders?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch userOrders')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list.find(
        (o) => String(o.orderId || o.id) === String(orderId) || String(o._id) === String(orderId)
      ) || null
    } catch (error) {
      console.warn('[orderService] fetchUserOrderById error:', error.message)
      return null
    }
  },

  createUserOrder: async (orderPayload) => {
    try {
      const newOrder = {
        id: orderPayload.orderId || `ord_${Date.now()}`,
        orderId: orderPayload.orderId || `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        ...orderPayload,
      }
      const res = await fetch(`${BASE_URL}/userOrders?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
      if (!res.ok) throw new Error('Failed to create userOrder')
      const json = await res.json()
      return json.data || newOrder
    } catch (error) {
      console.warn('[orderService] createUserOrder error:', error.message)
      throw error
    }
  },

  updateUserOrderStatus: async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/userOrders?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch userOrders')
      const json = await res.json()
      const list = json.data?.data || []
      const mongoId = findMongoId(list, orderId)
      const current = list.find((o) => String(o.orderId || o.id) === String(orderId)) || {}

      const updateRes = await fetch(`${BASE_URL}/userOrders/${mongoId}?apiKey=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, status: newStatus }),
      })
      if (!updateRes.ok) throw new Error('Failed to update userOrder status')
      return { orderId, status: newStatus }
    } catch (error) {
      console.warn('[orderService] updateUserOrderStatus error:', error.message)
      return { orderId, status: newStatus }
    }
  },

  fetchOrderRevenue: async () => {
    try {
      const res = await fetch(`${BASE_URL}/orderRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch orderRevenue')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list[0] || null
    } catch (error) {
      console.warn('[orderService] fetchOrderRevenue error:', error.message)
      return null
    }
  },

  fetchOrderRevenueByStoreId: async (storeId) => {
    try {
      // Dùng đúng endpoint /allStoreRevenue và filter logic đồng bộ với các chỗ khác
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStoreRevenue')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      const storeRecord = list.find((item) => String(item.storeId) === String(storeId))

      // Filter orders theo logic đồng bộ
      const allOrders = storeRecord?.orders || []
      const filteredOrders = allOrders.filter((o) => {
        const orderStoreId = o.storeId || o.id_store || o.items?.[0]?.id_store || o.items?.[0]?.storeId;
        return orderStoreId && String(orderStoreId).trim() === String(storeId).trim();
      })

      return filteredOrders
    } catch (error) {
      console.warn('[orderService] fetchOrderRevenueByStoreId error:', error.message)
      return []
    }
  },

  setOrderRevenue: async (revenueData) => {
    try {
      await orderService.clearOrderRevenue()

      const res = await fetch(`${BASE_URL}/orderRevenue?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revenueData),
      })
      if (!res.ok) throw new Error('Failed to set orderRevenue')
      const json = await res.json()
      return json.data || revenueData
    } catch (error) {
      console.warn('[orderService] setOrderRevenue error:', error.message)
      return revenueData
    }
  },

  updateOrderRevenue: async (updateData) => {
    try {
      const res = await fetch(`${BASE_URL}/orderRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch orderRevenue')
      const json = await res.json()
      const list = json.data?.data || []
      if (list.length > 0) {
        const current = list[0]
        const mongoId = current._id || current.id
        const merged = { ...current, ...updateData }
        const updateRes = await fetch(`${BASE_URL}/orderRevenue/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(merged),
        })
        if (!updateRes.ok) throw new Error('Failed to update orderRevenue')
        const updateJson = await updateRes.json()
        return updateJson.data || merged
      }
      // Nếu chưa có thì tạo mới
      return orderService.setOrderRevenue(updateData)
    } catch (error) {
      console.warn('[orderService] updateOrderRevenue error:', error.message)
      return updateData
    }
  },

  clearOrderRevenue: async () => {
    try {
      const res = await fetch(`${BASE_URL}/orderRevenue?apiKey=${API_KEY}`)
      if (!res.ok) return false
      const json = await res.json()
      const list = json.data?.data || []
      for (const item of list) {
        const mongoId = item._id || item.id
        await fetch(`${BASE_URL}/orderRevenue/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      }
      return true
    } catch (error) {
      console.warn('[orderService] clearOrderRevenue error:', error.message)
      return false
    }
  },

  // ==========================================
  // 3. RESOURCE: /allStoreRevenue (Doanh thu tổng hợp của TẤT CẢ các store)
  // ==========================================
  fetchAllStoreRevenue: async () => {
    try {
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStoreRevenue')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      // Chuyển mảng thành object có key là storeId (giữ đúng cấu trúc cũ)
      return list.reduce((acc, item) => {
        if (item.storeId) acc[item.storeId] = item
        return acc
      }, {})
    } catch (error) {
      console.warn('[orderService] fetchAllStoreRevenue error:', error.message)
      return {}
    }
  },

  fetchStoreRevenueById: async (storeId) => {
    try {
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStoreRevenue')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      const storeRecord = list.find((item) => String(item.storeId) === String(storeId)) || null;
      if (storeRecord && Array.isArray(storeRecord.orders)) {
        return {
          ...storeRecord,
          orders: sortOrdersByNewest(storeRecord.orders),
        };
      }
      return storeRecord;
    } catch (error) {
      console.warn('[orderService] fetchStoreRevenueById error:', error.message)
      return null
    }
  },

  initStoreRevenue: async (store) => {
    if (!store?.id) return null
    try {
      // Kiểm tra xem đã có record cho store này chưa
      const existing = await orderService.fetchStoreRevenueById(store.id)
      if (existing) return existing

      const initialRevenue = {
        storeId: store.id,
        storeName: store.name || 'Store', // Đổi 'My Store' thành 'Store' để đồng bộ
        totalRevenue: 0,
        todayRevenue: 0,
        orders: [],
      }

      // Thêm vào /allStoreRevenue
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialRevenue),
      })
      if (!res.ok) throw new Error('Failed to init store revenue in allStoreRevenue')

      // Đồng bộ sang /orderRevenue (phiên hiện tại)
      await orderService.setOrderRevenue(initialRevenue)
      return initialRevenue
    } catch (error) {
      console.warn('[orderService] initStoreRevenue error:', error.message)
      return null
    }
  },

  updateStoreRevenue: async (storeId, newOrderData) => {
    try {
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStoreRevenue')
      const json = await res.json()
      const list = json.data?.data || []
      const storeRecord = list.find((item) => String(item.storeId) === String(storeId))

      let storeName = storeRecord?.storeName || newOrderData.storeName
      if (!storeName && !storeRecord) {
        try {
          const { storeService } = await import('./storeService')
          const currentStore = await storeService.getCurrentStore()
          storeName = currentStore?.name || 'Store'
        } catch {
          storeName = 'Store'
        }
      }

      const updatedOrders = [newOrderData, ...(storeRecord?.orders || [])]
      const todayStr = new Date().toDateString()
      const todayRevenue = updatedOrders
        .filter((o) => o.date && new Date(o.date).toDateString() === todayStr)
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0)
      const totalRevenue = updatedOrders.reduce(
        (sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0
      )

      const updatedRecord = {
        ...(storeRecord || {
          storeId,
          storeName: storeName || 'Store'
        }),
        orders: updatedOrders,
        todayRevenue,
        totalRevenue,
      }

      if (storeRecord) {
        const mongoId = storeRecord._id || storeRecord.id
        await fetch(`${BASE_URL}/allStoreRevenue/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRecord),
        })
      } else {
        await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRecord),
        })
      }

      return updatedRecord
    } catch (error) {
      console.warn('[orderService] updateStoreRevenue error:', error.message)
      return null
    }
  },

  // ==========================================
  // Re-calculate và sync revenue từ orders hiện tại
  // ==========================================
  recalculateStoreRevenue: async (storeId) => {
    try {
      const revenueData = await orderService.fetchStoreRevenueById(storeId)
      if (!revenueData) return null

      // Nếu không có storeName, lấy từ currentStore
      if (!revenueData.storeName || revenueData.storeName === 'Store') {
        const { storeService } = await import('./storeService')
        const currentStore = await storeService.getCurrentStore()
        if (currentStore?.name) {
          revenueData.storeName = currentStore.name
        }
      }

      const orders = revenueData.orders || []
      const todayStr = new Date().toDateString()

      const todayRevenue = orders
        .filter((o) => o.date && new Date(o.date).toDateString() === todayStr)
        .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0)

      const totalRevenue = orders.reduce(
        (sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0
      )

      const updatedRecord = {
        ...revenueData,
        todayRevenue,
        totalRevenue,
      }

      // Cập nhật lại vào API
      const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStoreRevenue')
      const json = await res.json()
      const list = json.data?.data || []
      const storeRecord = list.find((item) => String(item.storeId) === String(storeId))

      if (storeRecord) {
        const mongoId = storeRecord._id || storeRecord.id
        await fetch(`${BASE_URL}/allStoreRevenue/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRecord),
        })
      }

      // Đồng bộ sang /orderRevenue
      await orderService.updateOrderRevenue(updatedRecord)

      return updatedRecord
    } catch (error) {
      console.warn('[orderService] recalculateStoreRevenue error:', error.message)
      return null
    }
  },

  updateOrderStatusInAllRevenue: async (orderId, newStatus, storeId = null) => {
    try {
      const updateStoreTask = (async () => {
        const res = await fetch(`${BASE_URL}/allStoreRevenue?apiKey=${API_KEY}`);
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json.data?.data) ? json.data.data : json.data || [];

        const updatePromises = [];
        for (const storeRecord of list) {
          if (storeId && String(storeRecord.storeId) !== String(storeId)) continue;

          const hasOrder = storeRecord.orders?.some(
            (o) => String(o.orderId) === String(orderId)
          );
          if (!hasOrder) continue;

          const updatedOrders = storeRecord.orders.map((o) =>
            String(o.orderId) === String(orderId) ? { ...o, status: newStatus, orderStatus: newStatus } : o
          );
          const mongoId = storeRecord._id || storeRecord.id;
          updatePromises.push(
            fetch(`${BASE_URL}/allStoreRevenue/${mongoId}?apiKey=${API_KEY}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...storeRecord, orders: updatedOrders }),
            })
          );
        }
        await Promise.all(updatePromises);
      })();

      const updateUserTask = orderService.updateUserOrderStatus(orderId, newStatus);

      await Promise.allSettled([updateStoreTask, updateUserTask]);
      return { orderId, status: newStatus };
    } catch (error) {
      console.warn('[orderService] updateOrderStatusInAllRevenue error:', error.message);
      return { orderId, status: newStatus };
    }
  },

  // ==========================================
  // Tiện ích: Xử lý thanh toán đơn hàng (ghi vào cả 3 resource cùng lúc)
  // ==========================================
  processOrder: async (orderPayload, currentUser = {}) => {
    const orderId = orderPayload.orderId || `ORD-${Date.now()}`
    const nowISO = new Date().toISOString()
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const addressData = orderPayload.shippingAddress || orderPayload.address || {};
    const delivery = getOrderDeliveryInfo({ ...orderPayload, shippingAddress: addressData });

    // 1. Lưu đơn hàng vào /userOrders cho khách hàng
    const userOrder = {
      ...orderPayload,
      orderId,
      customerEmail: currentUser.email || orderPayload.customerEmail || delivery.email,
      customerName: currentUser.firstName
        ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
        : delivery.recipientName || orderPayload.customerName || 'Customer',
      phone: delivery.phone,
      shippingAddress: addressData,
      address: addressData,
      date: nowISO,
      formattedDate,
      status: 'Pending',
    }

    await orderService.createUserOrder(userOrder)
    await orderService.createOrder(userOrder)


    // 2. Ghi doanh thu vào /allStoreRevenue theo từng store
    const items = orderPayload.items || []
    const storeGroups = {}
    items.forEach((item) => {
      const sid = item.id_store || item.storeId || 'store-001'
      if (!storeGroups[sid]) storeGroups[sid] = []
      storeGroups[sid].push(item)
    })

    const revenuePromises = Object.entries(storeGroups).map(([storeId, storeItems]) => {
      const subtotal = storeItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0
      )
      const tax = subtotal * 0.08
      const total = subtotal + tax

      const storeOrder = {
        orderId,
        storeId,
        customer: userOrder.customerName,
        customerName: userOrder.customerName,
        customerEmail: userOrder.customerEmail,
        phone: delivery.phone,
        date: nowISO,
        formattedDate,
        total,
        totalAmount: total,
        subtotal,
        tax,
        discountAmount: Number(orderPayload.discountAmount) || 0,
        voucherCode: orderPayload.voucherCode || null,
        status: 'Pending',
        paymentMethod: orderPayload.paymentMethod || 'VietQR',
        items: storeItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          size: item.size || 'M',
          color: item.color || 'Default',
          imageUrl: item.imageUrl,
          subtotal: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        })),
        shippingAddress: addressData,
        address: addressData,
      }
      return orderService.updateStoreRevenue(storeId, storeOrder)
    })

    await Promise.all(revenuePromises)

    // Update total sales for each store
    const allStores = await storeService.fetchAllStores()
    for (const [storeId, storeItems] of Object.entries(storeGroups)) {
      try {
        const storeData = Array.isArray(allStores)
          ? allStores.find(s => String(s.id) === String(storeId))
          : Object.values(allStores || {}).find(s => String(s.id) === String(storeId))

        if (storeData) {
          const currentTotalSales = Number(storeData.totalSales) || 0
          const newOrderTotal = storeItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0
          )
          const updatedTotalSales = currentTotalSales + newOrderTotal

          await storeService.updateInAllStores(storeId, {
            totalSales: updatedTotalSales
          })
          console.log(`Updated totalSales for store ${storeId}: ${currentTotalSales} → ${updatedTotalSales}`)
        }
      } catch (e) {
        console.warn(`Failed to update totalSales for store ${storeId}:`, e.message)
      }
    }

    return userOrder
  },
}

export default orderService
