import apiClient from './apiClient'

export const adminService = {

  updateAdminPassword: async (currentPassword, newPassword) => {
    try {
      await apiClient.patch('/admin/account/password', { currentPassword, newPassword })
      return true
    } catch (error) {
      const message = error.response?.data?.message || error.message
      console.warn('[adminService] updateAdminPassword error:', message)
      throw new Error(message)
    }
  },

  // GET /admin/dashboard -> Lấy toàn bộ dữ liệu thô cho Admin Dashboard trong 1 request
  // Backend trả về: { revenue, orders, stores, users, applications }
  fetchDashboardData: async () => {
    try {
      const res = await apiClient.get('/admin/dashboard')
      return res.data.result || {}
    } catch (error) {
      console.warn('[adminService] fetchDashboardData error:', error.message)
      throw error
    }
  },

  // GET /admin/users?page=&size=&search=&role= -> Lấy danh sách tất cả users
  fetchAllUsers: async (filters = {}) => {
    try {
      const res = await apiClient.get('/admin/users', { params: filters })
      return res.data.result || []
    } catch (error) {
      console.warn('[adminService] fetchAllUsers error:', error.message)
      return []
    }
  },

  fetchUserSegments: async (filters = {}) => {
    const res = await apiClient.get('/admin/users/segments', { params: filters })
    const page = res.data.result || {}
    return {
      ...page,
      content: (page.content || []).map((user) => ({
        ...user,
        rfm: {
          R: user.recencyScore,
          F: user.frequencyScore,
          M: user.monetaryScore,
          segment: user.segment,
          lastOrderDate: user.lastOrderDate,
          orderCount: user.orderCount,
          totalSpend: user.totalSpend,
        },
      })),
    }
  },

  // GET /admin/users/{userId} -> Lấy chi tiết 1 user
  fetchUserById: async (userId) => {
    try {
      const res = await apiClient.get(`/admin/users/${userId}`)
      return res.data.result || null
    } catch (error) {
      console.warn('[adminService] fetchUserById error:', error.message)
      return null
    }
  },

  // PATCH /admin/users/{userId}/role -> Cập nhật role của user
  // payload: { roles: ['CUSTOMER', 'STORE_MANAGER'] }
  updateUserRole: async (userId, roles) => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, { roles })
      return res.data.result
    } catch (error) {
      console.warn('[adminService] updateUserRole error:', error.message)
      throw error
    }
  },

  // DELETE /admin/users/{userId} -> Xóa user (Admin)
  deleteUser: async (userId) => {
    try {
      await apiClient.delete(`/admin/users/${userId}`)
      return true
    } catch (error) {
      console.warn('[adminService] deleteUser error:', error.message)
      throw error
    }
  },


  // GET /admin/store-applications -> Lấy danh sách đơn đăng ký mở shop
  fetchStoreApplications: async () => {
    try {
      const res = await apiClient.get('/admin/store-applications')
      return res.data.result || []
    } catch (error) {
      console.warn('[adminService] fetchStoreApplications error:', error.message)
      return []
    }
  },

  // POST /admin/store-applications/{applicationId}/approve -> Duyệt đơn mở shop
  // Backend tự động: tạo Store, cập nhật Role user lên STORE_MANAGER, xóa đơn application
  approveStoreApplication: async (applicationId) => {
    try {
      const res = await apiClient.post(`/admin/store-applications/${applicationId}/approve`)
      return res.data.result
    } catch (error) {
      console.warn('[adminService] approveStoreApplication error:', error.message)
      throw error
    }
  },

  // DELETE /admin/store-applications/{applicationId} -> Từ chối đơn đăng ký mở shop
  rejectStoreApplication: async (applicationId) => {
    try {
      await apiClient.delete(`/admin/store-applications/${applicationId}`)
      return true
    } catch (error) {
      console.warn('[adminService] rejectStoreApplication error:', error.message)
      throw error
    }
  },


  // GET /admin/stores?page=&size=&status= -> Lấy danh sách tất cả stores
  fetchAllStores: async (filters = {}) => {
    try {
      const res = await apiClient.get('/admin/stores', { params: filters })
      return res.data.result || []
    } catch (error) {
      console.warn('[adminService] fetchAllStores error:', error.message)
      return []
    }
  },

  // PATCH /admin/stores/{storeId}/status -> Cập nhật trạng thái store (active/suspended)
  updateStoreStatus: async (storeId, status) => {
    try {
      const res = await apiClient.patch(`/admin/stores/${storeId}/status`, { status })
      return res.data.result
    } catch (error) {
      console.warn('[adminService] updateStoreStatus error:', error.message)
      throw error
    }
  },

  // DELETE /admin/stores/{storeId} -> Xóa store (Admin)
  deleteStore: async (storeId) => {
    try {
      await apiClient.delete(`/admin/stores/${storeId}`)
      return true
    } catch (error) {
      console.warn('[adminService] deleteStore error:', error.message)
      throw error
    }
  },


  fetchTopProductsAnalytics: async () => {
    try {
      const res = await apiClient.get('/admin/analytics/top-products')
      return res.data.result || null
    } catch (error) {
      console.warn('[adminService] fetchTopProductsAnalytics error:', error.message)
      throw error
    }
  },

  fetchAdminAnalytics: async (range) => {
    const res = await apiClient.get('/admin/analytics', { params: { range } })
    return res.data.result || {}
  },

  fetchSystemRevenue: async () => {
    const res = await apiClient.get('/admin/revenue')
    return res.data.result || null
  },

}

export default adminService
