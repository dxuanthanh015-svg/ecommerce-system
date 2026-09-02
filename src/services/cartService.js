const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

// ==========================================
// RESOURCE: /carts (Giỏ hàng của user đã đăng nhập)
// RESOURCE: /cart_guest (Giỏ hàng của khách vãng lai chưa đăng nhập)
// ==========================================
const JSON_HEADERS = { 'Content-Type': 'application/json' }

const fetchList = async (resource) => {
  const res = await fetch(`${BASE_URL}/${resource}?apiKey=${API_KEY}`)
  if (!res.ok) throw new Error(`Failed to fetch ${resource}`)
  const json = await res.json()
  return Array.isArray(json.data?.data) ? json.data.data : json.data || []
}

const findUserCart = (list, userEmail) =>
  userEmail
    ? list.find((c) => c.userEmail?.toLowerCase() === userEmail.toLowerCase()) || null
    : list[0] || null

const isSameItem = (a, b) =>
  String(a.id) === String(b.id) && a.size === b.size && a.color === b.color

const mergeItem = (items, newItem) => {
  const idx = items.findIndex((item) => isSameItem(item, newItem))
  if (idx > -1) {
    return items.map((item, i) =>
      i === idx
        ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
        : item
    )
  }
  return [newItem, ...items]
}

export const cartService = {
  // ---------- /carts (User đã đăng nhập) ----------
  // Trả về bản ghi cart đầy đủ (có _id) hoặc null. Mỗi user có 1 bản ghi cart.
  fetchCartRecord: async (userEmail = null) => {
    try {
      return findUserCart(await fetchList('carts'), userEmail)
    } catch (error) {
      console.warn('[cartService] fetchCartRecord error:', error.message)
      return null
    }
  },

  fetchCart: async (userEmail = null) => {
    const record = await cartService.fetchCartRecord(userEmail)
    return record?.items || []
  },

  // `existing`: bản ghi cart đã fetch trước đó; truyền vào để không phải GET lại.
  saveCart: async (items, userEmail, existing) => {
    if (!userEmail) return
    try {
      if (existing === undefined) {
        existing = findUserCart(await fetchList('carts'), userEmail)
      }

      const payload = {
        userEmail,
        items,
        updatedAt: new Date().toISOString(),
      }

      if (existing) {
        const mongoId = existing._id || existing.id
        await fetch(`${BASE_URL}/carts/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: JSON_HEADERS,
          body: JSON.stringify({ ...existing, ...payload }),
        })
      } else {
        await fetch(`${BASE_URL}/carts?apiKey=${API_KEY}`, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(payload),
        })
      }
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] saveCart error:', error.message)
    }
  },

  addToCart: async (newItem, userEmail) => {
    const record = await cartService.fetchCartRecord(userEmail)
    const updatedItems = mergeItem(record?.items || [], newItem)
    await cartService.saveCart(updatedItems, userEmail, record)
    return updatedItems
  },

  updateCartItem: async (itemId, size, color, newQty, userEmail) => {
    const record = await cartService.fetchCartRecord(userEmail)
    const target = { id: itemId, size, color }
    const updatedItems = (record?.items || [])
      .map((item) => (isSameItem(item, target) ? { ...item, quantity: newQty } : item))
      .filter((item) => item.quantity > 0)
    await cartService.saveCart(updatedItems, userEmail, record)
    return updatedItems
  },

  removeFromCart: async (itemId, size, color, userEmail) => {
    const record = await cartService.fetchCartRecord(userEmail)
    const target = { id: itemId, size, color }
    const updatedItems = (record?.items || []).filter((item) => !isSameItem(item, target))
    await cartService.saveCart(updatedItems, userEmail, record)
    return updatedItems
  },

  clearCart: async (userEmail) => {
    if (!userEmail) return []
    const record = await cartService.fetchCartRecord(userEmail)
    await cartService.saveCart([], userEmail, record)
    return []
  },

  // ---------- /cart_guest (Khách vãng lai chưa đăng nhập) ----------
  fetchGuestCartRecord: async () => {
    try {
      const list = await fetchList('cart_guest')
      return list[0] || null
    } catch (error) {
      console.warn('[cartService] fetchGuestCartRecord error:', error.message)
      return null
    }
  },

  fetchGuestCart: async () => {
    const record = await cartService.fetchGuestCartRecord()
    return record?.items || []
  },

  saveGuestCart: async (items, existing) => {
    try {
      if (existing === undefined) {
        existing = (await fetchList('cart_guest'))[0] || null
      }

      const payload = { items, updatedAt: new Date().toISOString() }

      if (existing) {
        const mongoId = existing._id || existing.id
        await fetch(`${BASE_URL}/cart_guest/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: JSON_HEADERS,
          body: JSON.stringify({ ...existing, ...payload }),
        })
      } else {
        await fetch(`${BASE_URL}/cart_guest?apiKey=${API_KEY}`, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(payload),
        })
      }
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] saveGuestCart error:', error.message)
    }
  },

  addToGuestCart: async (newItem) => {
    const record = await cartService.fetchGuestCartRecord()
    const updatedItems = mergeItem(record?.items || [], newItem)
    await cartService.saveGuestCart(updatedItems, record)
    return updatedItems
  },

  clearGuestCart: async () => {
    try {
      const record = await cartService.fetchGuestCartRecord()
      if (!record) return []
      const mongoId = record._id || record.id
      await fetch(`${BASE_URL}/cart_guest/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      return []
    } catch (error) {
      console.warn('[cartService] clearGuestCart error:', error.message)
      return []
    }
  },

  // ---------- Gộp giỏ hàng khách vãng lai vào tài khoản sau khi đăng nhập ----------
  migrateGuestCart: async (userEmail) => {
    if (!userEmail) return
    try {
      const guestItems = await cartService.fetchGuestCart()
      if (guestItems.length === 0) return

      const record = await cartService.fetchCartRecord(userEmail)
      const merged = [...(record?.items || [])]

      guestItems.forEach((guestItem) => {
        const idx = merged.findIndex((item) => isSameItem(item, guestItem))
        if (idx > -1) {
          merged[idx] = {
            ...merged[idx],
            quantity: (merged[idx].quantity || 1) + (guestItem.quantity || 1),
          }
        } else {
          merged.push(guestItem)
        }
      })

      await cartService.saveCart(merged, userEmail, record)
      await cartService.clearGuestCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] migrateGuestCart error:', error.message)
    }
  },
}

export default cartService
