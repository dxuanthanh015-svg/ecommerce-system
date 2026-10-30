import apiClient from './apiClient'

// ==========================================
// NOTIFICATION SERVICE - Gọi Spring Boot API
// Notifications are created by backend business events; the client only reads and acknowledges them.
// ==========================================

export const notificationService = {

  // GET /notifications -> Lấy danh sách thông báo của user hiện tại (via JWT)
  fetchNotification: async (audience = 'customer') => {
    try {
      const res = await apiClient.get('/notifications', { params: { audience } })
      return res.data.result || []
    } catch (error) {
      console.warn('[notificationService] fetchNotification error:', error.response?.data || error.message)
      throw error
    }
  },

  // PUT /notifications/{id} -> Cập nhật thông báo (ví dụ: đánh dấu đã đọc)
  putNotification: async (id, data) => {
    try {
      const res = await apiClient.put(`/notifications/${id}`, data)
      return res.data.result
    } catch (error) {
      console.warn('[notificationService] putNotification error:', error.message)
      return null
    }
  },

  // PATCH /notifications/{id}/read -> Đánh dấu 1 thông báo đã đọc
  markAsRead: async (id) => {
    try {
      const res = await apiClient.patch(`/notifications/${id}/read`)
      return res.data.result
    } catch (error) {
      console.warn('[notificationService] markAsRead error:', error.message)
      return null
    }
  },

  // PATCH /notifications/read-all -> Đánh dấu toàn bộ thông báo đã đọc
  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications/read-all')
      return true
    } catch (error) {
      console.warn('[notificationService] markAllAsRead error:', error.message)
      return false
    }
  },

  // DELETE /notifications/{id} -> Xóa 1 thông báo
  deleteNotification: async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`)
      return true
    } catch (error) {
      console.warn('[notificationService] deleteNotification error:', error.message)
      return null
    }
  },
}

export default notificationService
