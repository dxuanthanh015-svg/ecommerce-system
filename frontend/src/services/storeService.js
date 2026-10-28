import apiClient from './apiClient'

// ==========================================
// STORE SERVICE - Gọi Spring Boot API
// TODO: Backend cần implement các endpoint dưới đây
// ==========================================

export const storeService = {

  // GET /stores -> Lấy toàn bộ danh sách cửa hàng (cho trang khám phá / admin)
  fetchAllStores: async () => {
    try {
      const res = await apiClient.get('/stores')
      return res.data.result || []
    } catch (error) {
      console.warn('[storeService] fetchAllStores error:', error.message)
      return []
    }
  },

  // GET /stores/{storeId} -> Lấy thông tin 1 cửa hàng theo ID
  fetchStoreById: async (storeId) => {
    if (!storeId) return null
    try {
      const res = await apiClient.get(`/stores/profile/${storeId}`)
      return res.data.result || null
    } catch (error) {
      console.warn('[storeService] fetchStoreById error:', error.message)
      return null
    }
  },

  // GET /products/store/{storeId} -> Lọc sản phẩm public bằng nghiệp vụ backend
  fetchStoreProducts: async (storeId, tab = 'all', search = '') => {
    const res = await apiClient.get(`/products/store/${storeId}`, {
      params: { tab, ...(search.trim() ? { search: search.trim() } : {}) },
    })
    return res.data.result || []
  },

  // GET /stores/my-store -> Lấy thông tin cửa hàng của Store Manager đang đăng nhập (via JWT)
  getCurrentStore: async () => {
    try {
      const res = await apiClient.get('/stores/my-store')
      if (!res.data.result) throw new Error('API không trả về cửa hàng hiện tại')
      return res.data.result
    } catch (error) {
      console.warn('[storeService] getCurrentStore error:', error.message)
      throw error
    }
  },

  // POST /stores -> Tạo cửa hàng mới (Admin)
  createStore: async (storeData) => {
    try {
      const res = await apiClient.post('/stores', storeData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] createStore error:', error.message)
      throw error
    }
  },

  // PUT /stores/my-store -> Store Manager cập nhật thông tin cửa hàng của mình
  updateCurrentStore: async (updateData) => {
    try {
      const res = await apiClient.put('/stores/my-store', updateData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateCurrentStore error:', error.message)
      throw error
    }
  },

  // PUT /stores/{storeId} -> Admin cập nhật thông tin bất kỳ cửa hàng nào
  updateStoreById: async (storeId, updateData) => {
    try {
      const res = await apiClient.put(`/stores/${storeId}`, updateData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateStoreById error:', error.message)
      throw error
    }
  },

  // GET /stores/profile/{storeId} -> Lấy thông tin hồ sơ công khai của cửa hàng
  fetchStoreProfile: async (storeId) => {
    try {
      const res = await apiClient.get(`/stores/profile/${storeId}`)
      return res.data.result || null
    } catch (error) {
      console.warn('[storeService] fetchStoreProfile error:', error.message)
      return null
    }
  },

  // PUT /stores/my-store/settings -> Cập nhật toàn bộ cài đặt cửa hàng (từ StoreSettings UI)
  updateStoreSettings: async (settingsPayload) => {
    try {
      const res = await apiClient.put('/stores/my-store/settings', settingsPayload)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateStoreSettings error:', error.message)
      throw error
    }
  },

  // GET /stores/applications -> Lấy danh sách đơn đăng ký mở cửa hàng (Admin)
  getStoreApplications: async () => {
    try {
      const res = await apiClient.get('/stores/applications')
      return res.data.result || []
    } catch (error) {
      console.warn('[storeService] getStoreApplications error:', error.message)
      return []
    }
  },

  // GET /stores/applications/my -> Lấy đơn đăng ký của user hiện tại
  getStoreApplication: async () => {
    try {
      const res = await apiClient.get('/stores/applications/my')
      return res.data.result || null
    } catch (error) {
      if (error.response?.status === 404) return null
      console.warn('[storeService] getStoreApplication error:', error.message)
      throw error
    }
  },

  // POST /stores/applications -> Nộp đơn đăng ký mở cửa hàng
  saveStoreApplication: async (applicationData) => {
    try {
      const res = await apiClient.post('/stores/applications', applicationData)
      return res.data.result
    } catch (error) {
      const message = error.response?.data?.message || error.message
      console.warn('[storeService] saveStoreApplication error:', message)
      throw new Error(message)
    }
  },

  // DELETE /stores/applications/my -> Hủy đơn đăng ký
  removeStoreApplication: async () => {
    try {
      await apiClient.delete('/stores/applications/my')
      return true
    } catch (error) {
      console.warn('[storeService] removeStoreApplication error:', error.message)
      return false
    }
  },

  // GET /stores/my-store/analytics?range= -> Lấy dữ liệu analytics của cửa hàng
  fetchStoreAnalytics: async (range = 'Last 6 Months') => {
    try {
      const res = await apiClient.get('/stores/my-store/analytics', { params: { range } })
      return res.data.result || null
    } catch (error) {
      console.warn('[storeService] fetchStoreAnalytics error:', error.message)
      return null
    }
  },
}

export default storeService
