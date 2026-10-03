import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const reviewService = {
  // ==========================================
  // 1. RESOURCE: /reviews (Toàn bộ đánh giá thực tế trên sàn)
  // ==========================================
  fetchReviewsByProductId: async (productId) => {
    if (!productId) return []
    try {
      const res = await fetch(`${BASE_URL}/reviews?apiKey=${API_KEY}`)
      if (!res.ok) return []
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      
      // Lọc chính xác các đánh giá thuộc về sản phẩm này
      const matched = list.filter((r) => String(r.productId) === String(productId))
      return matched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    } catch (error) {
      console.warn('[reviewService] fetchReviews error:', error.message)
      return []
    }
  },

  createReview: async (reviewData) => {
    try {
      const user = await authService.getCurrentUser()
      const payload = {
        id: `rev-${Date.now()}`,
        productId: String(reviewData.productId),
        storeId: reviewData.storeId || "store-001",
        userName: reviewData.userName || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Khách hàng"),
        userEmail: user?.email || "",
        avatarUrl: reviewData.avatarUrl || user?.avatarUrl || "",
        rating: Number(reviewData.rating) || 5,
        date: "Vừa xong",
        title: reviewData.title || "Đánh giá chất lượng",
        comment: reviewData.comment || "",
        verified: true,
        likes: 0,
        createdAt: new Date().toISOString(),
      }

      const res = await fetch(`${BASE_URL}/reviews?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save review')
      const json = await res.json()
      return json.data || payload
    } catch (error) {
      console.error('[reviewService] createReview error:', error.message)
      throw error
    }
  },
}

export default reviewService
