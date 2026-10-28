import apiClient from './apiClient'


export const reviewService = {

  fetchReviewsByProductId: async (productId) => {
    if (!productId) return []
    try {
      const res = await apiClient.get('/reviews', { params: { productId } })
      return res.data.result || []
    } catch (error) {
      console.error('[reviewService] fetchReviewsByProductId error:', error.message)
      throw error
    }
  },

  createReview: async (reviewData) => {
    try {
      const res = await apiClient.post('/reviews', {
        productId: String(reviewData.productId),
        storeId: reviewData.storeId,
        rating: Number(reviewData.rating) || 5,
        title: reviewData.title || '',
        comment: reviewData.comment || '',
      })
      return res.data.result
    } catch (error) {
      console.error('[reviewService] createReview error:', error.response?.data || error.message)
      throw error
    }
  },
}

export default reviewService
