import apiClient from './apiClient'

export const storeService = {
  fetchAllStores: async () => {
    try {
      const res = await apiClient.get('/stores')
      return res.data.result || []
    } catch (error) {
      console.warn('[storeService] fetchAllStores error:', error.message)
      return []
    }
  },

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

  fetchStoreProducts: async (storeId, tab = 'all', search = '') => {
    const res = await apiClient.get(`/products/store/${storeId}`, {
      params: { tab, ...(search.trim() ? { search: search.trim() } : {}) },
    })
    return res.data.result || []
  },

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

  createStore: async (storeData) => {
    try {
      const res = await apiClient.post('/stores', storeData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] createStore error:', error.message)
      throw error
    }
  },

  updateCurrentStore: async (updateData) => {
    try {
      const res = await apiClient.put('/stores/my-store', updateData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateCurrentStore error:', error.message)
      throw error
    }
  },

  updateStoreById: async (storeId, updateData) => {
    try {
      const res = await apiClient.put(`/stores/${storeId}`, updateData)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateStoreById error:', error.message)
      throw error
    }
  },

  fetchStoreProfile: async (storeId) => {
    try {
      const res = await apiClient.get(`/stores/profile/${storeId}`)
      return res.data.result || null
    } catch (error) {
      console.warn('[storeService] fetchStoreProfile error:', error.message)
      return null
    }
  },

  updateStoreSettings: async (settingsPayload) => {
    try {
      const res = await apiClient.put('/stores/my-store/settings', settingsPayload)
      return res.data.result
    } catch (error) {
      console.warn('[storeService] updateStoreSettings error:', error.message)
      throw error
    }
  },

  getStoreApplications: async () => {
    try {
      const res = await apiClient.get('/stores/applications')
      return res.data.result || []
    } catch (error) {
      console.warn('[storeService] getStoreApplications error:', error.message)
      return []
    }
  },

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

  removeStoreApplication: async () => {
    try {
      await apiClient.delete('/stores/applications/my')
      return true
    } catch (error) {
      console.warn('[storeService] removeStoreApplication error:', error.message)
      return false
    }
  },

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
