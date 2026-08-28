const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

// ==========================================
// RESOURCE: /wishlist (Danh sách sản phẩm yêu thích)
// ==========================================
export const wishlistService = {
  fetchWishlist: async (userEmail = null) => {
    try {
      const res = await fetch(`${BASE_URL}/wishlist?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch wishlist')
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      if (userEmail) {
        const userWishlist = list.find(
          (w) => w.userEmail?.toLowerCase() === userEmail.toLowerCase()
        )
        return userWishlist?.items || []
      }
      return list[0]?.items || []
    } catch (error) {
      console.warn('[wishlistService] fetchWishlist error:', error.message)
      return []
    }
  },

  saveWishlist: async (items, userEmail) => {
    if (!userEmail) return
    try {
      const res = await fetch(`${BASE_URL}/wishlist?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch wishlist')
      const json = await res.json()
      const list = json.data?.data || []
      const existing = list.find(
        (w) => w.userEmail?.toLowerCase() === userEmail.toLowerCase()
      )

      const payload = { userEmail, items, updatedAt: new Date().toISOString() }

      if (existing) {
        const mongoId = existing._id || existing.id
        await fetch(`${BASE_URL}/wishlist/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...existing, ...payload }),
        })
      } else {
        await fetch(`${BASE_URL}/wishlist?apiKey=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      window.dispatchEvent(new Event('wishlistUpdated'))
    } catch (error) {
      console.warn('[wishlistService] saveWishlist error:', error.message)
    }
  },

  addToWishlist: async (product, userEmail) => {
    const currentItems = await wishlistService.fetchWishlist(userEmail)
    const isAlreadySaved = currentItems.some(
      (item) => String(item.id) === String(product.id)
    )
    if (isAlreadySaved) return currentItems
    const updatedItems = [product, ...currentItems]
    await wishlistService.saveWishlist(updatedItems, userEmail)
    return updatedItems
  },

  removeFromWishlist: async (productId, userEmail) => {
    const currentItems = await wishlistService.fetchWishlist(userEmail)
    const updatedItems = currentItems.filter(
      (item) => String(item.id) !== String(productId)
    )
    await wishlistService.saveWishlist(updatedItems, userEmail)
    return updatedItems
  },

  clearWishlist: async (userEmail) => {
    await wishlistService.saveWishlist([], userEmail)
    return []
  },

  isInWishlist: async (productId, userEmail) => {
    const currentItems = await wishlistService.fetchWishlist(userEmail)
    return currentItems.some((item) => String(item.id) === String(productId))
  },
}

export default wishlistService
