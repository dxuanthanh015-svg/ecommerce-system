import apiClient from './apiClient'

// ==========================================
// CART SERVICE - Gọi Spring Boot API
// TODO: Backend cần implement các endpoint dưới đây
// ==========================================

export const cartService = {

  // GET /cart -> Lấy giỏ hàng của user đang đăng nhập (via JWT)
  fetchCart: async () => {
    try {
      const res = await apiClient.get('/cart')
      return res.data.result?.items || []
    } catch (error) {
      console.warn('[cartService] fetchCart error:', error.message)
      throw error
    }
  },

  // POST /cart/items -> Thêm sản phẩm vào giỏ hàng
  // payload: { productId, variantId, size, color, quantity, price, title, imageUrl }
  addToCart: async (item) => {
    try {
      const res = await apiClient.post('/cart/items', item)
      return res.data.result?.items || []
    } catch (error) {
      console.warn('[cartService] addToCart error:', error.message)
      throw error
    }
  },

  // PUT /cart/items/{itemId} -> Cập nhật số lượng item trong giỏ
  // payload: { quantity }
  updateCartItem: async (itemId, quantity) => {
    try {
      const res = await apiClient.put(`/cart/items/${itemId}`, { quantity })
      return res.data.result?.items || []
    } catch (error) {
      console.warn('[cartService] updateCartItem error:', error.message)
      throw error
    }
  },

  // DELETE /cart/items/{itemId} -> Xóa 1 item khỏi giỏ hàng
  removeFromCart: async (itemId) => {
    try {
      const res = await apiClient.delete(`/cart/items/${itemId}`)
      return res.data.result?.items || []
    } catch (error) {
      console.warn('[cartService] removeFromCart error:', error.message)
      throw error
    }
  },

  // DELETE /cart -> Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      await apiClient.delete('/cart')
      return []
    } catch (error) {
      console.warn('[cartService] clearCart error:', error.message)
      throw error
    }
  },

  // Reconcile the authenticated cart using the item-level DELETE API.
  // The backend does not expose a save/replace-cart endpoint.
  replaceCartItems: async (items = []) => {
    try {
      const desiredIds = new Set(items.filter((item) => item?.id != null).map((item) => String(item.id)))
      const cartResponse = await apiClient.get('/cart')
      const currentItems = cartResponse.data.result?.items || []
      const removedItems = currentItems.filter((item) => !desiredIds.has(String(item.id)))

      await Promise.all(removedItems.map((item) => apiClient.delete(`/cart/items/${item.id}`)))
      const updatedResponse = await apiClient.get('/cart')
      return updatedResponse.data.result?.items || []
    } catch (error) {
      console.warn('[cartService] replaceCartItems error:', error.response?.data || error.message)
      throw error
    }
  },

  // ==========================================
  // GUEST CART - Lưu trên localStorage (không cần Backend)
  // ==========================================

  fetchGuestCart: () => {
    try {
      const raw = localStorage.getItem('guest_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  saveGuestCart: (items) => {
    try {
      localStorage.setItem('guest_cart', JSON.stringify(items))
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] saveGuestCart error:', error.message)
    }
  },

  addToGuestCart: (newItem) => {
    const current = cartService.fetchGuestCart()
    const idx = current.findIndex(
      (i) => String(i.productId) === String(newItem.productId) &&
             i.size === newItem.size && i.color === newItem.color
    )
    let updated
    if (idx > -1) {
      updated = current.map((i, index) =>
        index === idx ? { ...i, quantity: (i.quantity || 1) + (newItem.quantity || 1) } : i
      )
    } else {
      updated = [newItem, ...current]
    }
    cartService.saveGuestCart(updated)
    return updated
  },

  clearGuestCart: () => {
    localStorage.removeItem('guest_cart')
    window.dispatchEvent(new Event('cartUpdated'))
  },

  // POST /cart/migrate -> Gộp guest cart vào tài khoản sau khi đăng nhập
  // Backend nhận danh sách guest items và merge vào cart của user
  migrateGuestCart: async () => {
    try {
      const guestItems = cartService.fetchGuestCart()
      if (guestItems.length === 0) return

      await apiClient.post('/cart/migrate', { items: guestItems })
      cartService.clearGuestCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.warn('[cartService] migrateGuestCart error:', error.message)
    }
  },
}

export default cartService
