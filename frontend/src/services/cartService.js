const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

// ==========================================
// RESOURCE: /carts (Giỏ hàng của user đã đăng nhập)
// RESOURCE: /cart_guest (Giỏ hàng của khách vãng lai chưa đăng nhập)
// ==========================================
const userCartIdMap = {}

export const cartService = {
  // ---------- /carts (User đã đăng nhập) ----------


  fetchCart: async (userEmail = null) => {
    try {
      const res = await fetch(`${BASE_URL}/carts?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch cart')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      // Mỗi user có 1 bản ghi cart, lọc theo email
      if (userEmail) {
        const userCart = list.find(
          (c) => c.userEmail?.toLowerCase() === userEmail.toLowerCase()
        )
        if (userCart) {
          userCartIdMap[userEmail.toLowerCase()] = userCart._id || userCart.id
        }
        return userCart?.items || []
      }
      return list[0]?.items || []
    } catch (error) {
      console.warn('[cartService] fetchCart error:', error.message)
      return []
    }
  },


  saveCart: async (items, userEmail) => {
    if (!userEmail) return
    const id = userCartIdMap[userEmail.toLowerCase()]
    const payload = {
      userEmail,
      items,
      updatedAt: new Date().toISOString(),
    }
    if (id) {
      await fetch(`${BASE_URL}/carts/${id}?apiKey=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      const res = await fetch(`${BASE_URL}/carts?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        const newId = json.data?.id || json.data?._id
        if (newId)
          userCartIdMap[userEmail.toLowerCase()] = newId
      }
    }

    window.dispatchEvent(new Event('cartUpdated'))
  },

  addToCart: async (newItem, userEmail, cachedItems = null) => {
    const currentItems = cachedItems || await cartService.fetchCart(userEmail)
    const existingIdx = currentItems.findIndex(
      (item) =>
        String(item.id) === String(newItem.id) &&
        item.size === newItem.size &&
        item.color === newItem.color
    )

    let updatedItems
    if (existingIdx > -1) {
      updatedItems = currentItems.map((item, idx) =>
        idx === existingIdx
          ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
          : item
      )
    } else {
      updatedItems = [newItem, ...currentItems]
    }
    await cartService.saveCart(updatedItems, userEmail)
    return updatedItems
  },

  updateCartItem: async (itemId, size, color, newQty, userEmail, cachedItems = null) => {
    const currentItems = cachedItems || await cartService.fetchCart(userEmail)
    const updatedItems = currentItems.map((item) =>
      String(item.id) === String(itemId) && item.size === size && item.color === color
        ? { ...item, quantity: newQty }
        : item
    ).filter((item) => item.quantity > 0)
    await cartService.saveCart(updatedItems, userEmail)
    return updatedItems
  },

  removeFromCart: async (itemId, size, color, userEmail, cachedItems = null) => {
    const currentItems = cachedItems || await cartService.fetchCart(userEmail)
    const updatedItems = currentItems.filter(
      (item) =>
        !(String(item.id) === String(itemId) && item.size === size && item.color === color)
    )
    await cartService.saveCart(updatedItems, userEmail)
    return updatedItems
  },

  clearCart: async (userEmail) => {
    await cartService.saveCart([], userEmail)
    return []
  },

  // ---------- /cart_guest (Khách vãng lai chưa đăng nhập) ----------
  fetchGuestCart: async () => {
    try {
      const res = await fetch(`${BASE_URL}/cart_guest?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch cart_guest')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list[0]?.items || []
    } catch (error) {
      console.warn('[cartService] fetchGuestCart error:', error.message)
      return []
    }
  },

  saveGuestCart: async (items) => {
    try {
      const res = await fetch(`${BASE_URL}/cart_guest?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch cart_guest')
      const json = await res.json()
      const list = json.data?.data || []

      const payload = { items, updatedAt: new Date().toISOString() }

      if (list.length > 0) {
        const mongoId = list[0]._id || list[0].id
        await fetch(`${BASE_URL}/cart_guest/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...list[0], ...payload }),
        })
      } else {
        await fetch(`${BASE_URL}/cart_guest?apiKey=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] saveGuestCart error:', error.message)
    }
  },

  clearGuestCart: async () => {
    try {
      const res = await fetch(`${BASE_URL}/cart_guest?apiKey=${API_KEY}`)
      if (!res.ok) return
      const json = await res.json()
      const list = json.data?.data || []
      for (const item of list) {
        const mongoId = item._id || item.id
        await fetch(`${BASE_URL}/cart_guest/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      }
    } catch (error) {
      console.warn('[cartService] clearGuestCart error:', error.message)
    }
  },

  // ---------- Gộp giỏ hàng khách vãng lai vào tài khoản sau khi đăng nhập ----------
  migrateGuestCart: async (userEmail) => {
    if (!userEmail) return
    try {
      const guestItems = await cartService.fetchGuestCart()
      if (guestItems.length === 0) return

      const userItems = await cartService.fetchCart(userEmail)
      const merged = [...userItems]

      guestItems.forEach((guestItem) => {
        const existingIdx = merged.findIndex(
          (item) =>
            String(item.id) === String(guestItem.id) &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        )
        if (existingIdx > -1) {
          merged[existingIdx].quantity =
            (merged[existingIdx].quantity || 1) + (guestItem.quantity || 1)
        } else {
          merged.push(guestItem)
        }
      })

      await cartService.saveCart(merged, userEmail)
      await cartService.clearGuestCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] migrateGuestCart error:', error.message)
    }
  },
}

export default cartService
