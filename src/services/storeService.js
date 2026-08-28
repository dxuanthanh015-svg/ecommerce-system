import { getStoreAnalyticsData, exportAnalyticsReportCSV } from '../storeManager/components/Analytics/analytics.utils'
import { defaultStoreSettings } from '../storeManager/components/StoreSettings/storeSettings.data'
import { store_manager_mock_data } from '../Data/store-manager_mock_data'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const storeService = {
  // ==========================================
  // 1. RESOURCE: /allStores (Toàn bộ danh sách store trên sàn)
  // ==========================================
  fetchAllStores: async () => {
    try {
      const res = await fetch(`${BASE_URL}/allStores?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch allStores')
      const json = await res.json()
      const apiStores = Array.isArray(json.data?.data) ? json.data.data : json.data || []

      // Gộp stores từ API Server và store_manager_mock_data gốc (không trùng id)
      const apiIds = new Set(apiStores.map((s) => String(s.id || s._id)))
      const mockRemaining = store_manager_mock_data.filter((s) => !apiIds.has(String(s.id)))
      return [...apiStores, ...mockRemaining]
    } catch (error) {
      console.warn('[storeService] fetchAllStores error:', error.message)
      return store_manager_mock_data
    }
  },

  fetchStoreById: async (storeId) => {
    if (!storeId) return null
    const allStores = await storeService.fetchAllStores()
    return allStores.find((s) => String(s.id) === String(storeId) || String(s._id) === String(storeId)) || null
  },

  createInAllStores: async (storeData) => {
    try {
      const res = await fetch(`${BASE_URL}/allStores?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      })
      if (!res.ok) throw new Error('Failed to create store in allStores')
      const json = await res.json()
      return json.data || storeData
    } catch (error) {
      console.warn('[storeService] createInAllStores error:', error.message)
      return storeData
    }
  },

  updateInAllStores: async (storeId, updateData) => {
    try {
      const allStores = await storeService.fetchAllStores()
      const target = allStores.find((s) => s.id === storeId || s._id === storeId)
      if (target) {
        const mongoId = target._id || target.id
        const res = await fetch(`${BASE_URL}/allStores/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...target, ...updateData }),
        })
        if (!res.ok) throw new Error('Failed to update in allStores')
        const json = await res.json()
        return json.data || { ...target, ...updateData }
      }
      return updateData
    } catch (error) {
      console.warn('[storeService] updateInAllStores error:', error.message)
      return updateData
    }
  },


  fetchStores: async () => {
    try {
      const res = await fetch(`${BASE_URL}/stores?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch stores')
      const json = await res.json()
      return Array.isArray(json.data?.data) ? json.data.data : json.data || []
    } catch (error) {
      console.warn('[storeService] fetchStores error:', error.message)
      return store_manager_mock_data
    }
  },

  createStore: async (storeData) => {
    try {
      const res = await fetch(`${BASE_URL}/stores?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      })
      if (!res.ok) throw new Error('Failed to create in stores')
      const json = await res.json()
      return json.data || storeData
    } catch (error) {
      console.warn('[storeService] createStore error:', error.message)
      return storeData
    }
  },

  fetchStoreProfile: async (storeId) => {
    try {
      const allStores = await storeService.fetchAllStores()
      const store = allStores.find((s) => String(s.id) === String(storeId) || String(s._id) === String(storeId))
      return store ? { ...defaultStoreSettings, ...store } : defaultStoreSettings
    } catch (error) {
      console.warn('[storeService] fetchStoreProfile error:', error.message)
      return defaultStoreSettings
    }
  },

  getCurrentStore: async () => {
    try {
      const res = await fetch(`${BASE_URL}/currentStore?apiKey=${API_KEY}`)
      if (!res.ok) return null
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list[0] || null
    } catch (error) {
      console.warn('[storeService] getCurrentStore error:', error.message)
      return null
    }
  },

  setCurrentStore: async (storeData) => {
    try {
      // Xóa store cũ trước nếu có để tránh trùng
      await storeService.removeCurrentStore()

      const res = await fetch(`${BASE_URL}/currentStore?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      })
      if (!res.ok) throw new Error('Failed to set currentStore')
      const json = await res.json()
      return json.data || storeData
    } catch (error) {
      console.warn('[storeService] setCurrentStore error:', error.message)
      return storeData
    }
  },

  updateCurrentStore: async (updateData) => {
    try {
      const current = await storeService.getCurrentStore()
      if (!current) throw new Error('No currentStore found')

      const mongoId = current._id || current.id
      const merged = { ...current, ...updateData }

      const res = await fetch(`${BASE_URL}/currentStore/${mongoId}?apiKey=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
      if (!res.ok) throw new Error('Failed to update currentStore')
      const json = await res.json()

      // Đồng bộ sang /allStores
      if (current.id) {
        await storeService.updateInAllStores(current.id, updateData)
      }

      return json.data || merged
    } catch (error) {
      console.warn('[storeService] updateCurrentStore error:', error.message)
      return updateData
    }
  },

  removeCurrentStore: async () => {
    try {
      const res = await fetch(`${BASE_URL}/currentStore?apiKey=${API_KEY}`)
      if (res.ok) {
        const json = await res.json()
        const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
        for (const store of list) {
          const mongoId = store._id || store.id
          await fetch(`${BASE_URL}/currentStore/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
        }
      }
      return true
    } catch (error) {
      console.warn('[storeService] removeCurrentStore error:', error.message)
      return false
    }
  },

  // ==========================================
  // 4. RESOURCE: /storeApplication (Đơn đăng ký mở gian hàng của khách)
  // ==========================================
  getStoreApplication: async () => {
    try {
      const res = await fetch(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`)
      if (!res.ok) return null
      const json = await res.json()
      const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      return list[0] || null
    } catch (error) {
      console.warn('[storeService] getStoreApplication error:', error.message)
      return null
    }
  },

  saveStoreApplication: async (applicationData) => {
    try {
      await storeService.removeStoreApplication()

      const res = await fetch(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      })
      if (!res.ok) throw new Error('Failed to save storeApplication')
      const json = await res.json()
      return json.data || applicationData
    } catch (error) {
      console.warn('[storeService] saveStoreApplication error:', error.message)
      return applicationData
    }
  },

  removeStoreApplication: async () => {
    try {
      const res = await fetch(`${BASE_URL}/storeApplication?apiKey=${API_KEY}`)
      if (res.ok) {
        const json = await res.json()
        const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
        for (const app of list) {
          const mongoId = app._id || app.id
          await fetch(`${BASE_URL}/storeApplication/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
        }
      }
      return true
    } catch (error) {
      console.warn('[storeService] removeStoreApplication error:', error.message)
      return false
    }
  },

  // ==========================================
  // Tiện ích Store Settings & Analytics
  // ==========================================
  updateStoreSettings: async (storeId, settingsPayload) => {
    const updatedStore = {
      name: settingsPayload.brandIdentity?.storeName,
      email: settingsPayload.brandIdentity?.contactEmail,
      phone: settingsPayload.brandIdentity?.phone,
      category: settingsPayload.brandIdentity?.category,
      imageUrl: settingsPayload.brandIdentity?.logoImage,
      bannerUrl: settingsPayload.brandIdentity?.bannerImage,
      description: settingsPayload.brandIdentity?.bio,
      address: settingsPayload.fulfillmentCenter?.streetAddress,
      city: settingsPayload.fulfillmentCenter?.city,
      state: settingsPayload.fulfillmentCenter?.state,
      zipCode: settingsPayload.fulfillmentCenter?.zipCode,
      country: settingsPayload.fulfillmentCenter?.country,
      status: settingsPayload.storeOperations?.vacationMode ? 'paused' : 'active',
      bankInfo: {
        bankName: settingsPayload.payoutDetails?.bankName,
        accountName: settingsPayload.payoutDetails?.accountHolder,
        accountNumber: settingsPayload.payoutDetails?.accountNumber,
        routingNumber: settingsPayload.payoutDetails?.routingNumber,
        payoutSchedule: settingsPayload.payoutDetails?.payoutSchedule,
      },
      customerPolicies: settingsPayload.customerPolicies,
      shippingPolicy: {
        processingTime: settingsPayload.fulfillmentCenter?.processingTime,
        freeShippingThreshold: settingsPayload.fulfillmentCenter?.freeShippingThreshold,
      },
      storeOperations: settingsPayload.storeOperations,
    }

    // Cập nhật cả currentStore và allStores
    await storeService.updateCurrentStore(updatedStore)
    return storeService.updateInAllStores(storeId, updatedStore)
  },

  fetchStoreAnalytics: async (storeId, range = 'Last 6 Months') => {
    return getStoreAnalyticsData(storeId)
  },

  exportReport: (analyticsData, storeName) => {
    exportAnalyticsReportCSV(analyticsData, storeName)
  },
}

export default storeService
