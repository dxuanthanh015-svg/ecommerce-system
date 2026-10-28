import apiClient from './apiClient'

// ==========================================
// WISHLIST SERVICE - Gọi Spring Boot API
// TODO: Backend cần implement các endpoint dưới đây
// ==========================================

export const wishlistService = {

  // GET /wishlist -> Lấy danh sách yêu thích của user (via JWT)
  fetchWishlist: async () => {
    try {
      const res = await apiClient.get('/wishlist')
      const data = res.data?.result
      return Array.isArray(data) ? data : (data?.items || [])
    } catch (error) {
      console.warn('[wishlistService] fetchWishlist error:', error.message)
      return []
    }
  },

  // POST /wishlist/items -> Thêm sản phẩm vào wishlist
  // payload: { productId, title, price, imageUrl, ... }
  addToWishlist: async (product) => {
    try {
      const res = await apiClient.post('/wishlist/items', { productId: product.id || product.productId, ...product })
      const data = res.data?.result
      return Array.isArray(data) ? data : (data?.items || [])
    } catch (error) {
      console.warn('[wishlistService] addToWishlist error:', error.message)
      throw error
    }
  },

  // DELETE /wishlist/items/{productId} -> Xóa sản phẩm khỏi wishlist
  removeFromWishlist: async (productId) => {
    try {
      const res = await apiClient.delete(`/wishlist/items/${productId}`)
      const data = res.data?.result
      return Array.isArray(data) ? data : (data?.items || [])
    } catch (error) {
      console.warn('[wishlistService] removeFromWishlist error:', error.message)
      throw error
    }
  },

  // DELETE /wishlist -> Xóa toàn bộ wishlist
  clearWishlist: async () => {
    try {
      await apiClient.delete('/wishlist')
      return []
    } catch (error) {
      console.warn('[wishlistService] clearWishlist error:', error.message)
      throw error
    }
  },

  // Kiểm tra sản phẩm đã có trong wishlist chưa (client-side, từ cached data)
  isInWishlist: (items = [], productId) => {
    return items.some((item) => String(item.id || item.productId) === String(productId))
  },
}

export default wishlistService
