import { product_mock_data } from '../Data/product_mock_data'
import storeService from './storeService'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const productService = {
  // ==========================================
  // 1. RESOURCE: /products (Toàn bộ sản phẩm trên sàn)
  // ==========================================
  fetchProducts: async (filters = {}) => {
    let list = []
    try {
      const res = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`)
      if (res.ok) {
        const json = await res.json()
        const apiList = Array.isArray(json.data?.data) ? json.data.data : json.data || []
        // Ghép API products và product_mock_data (loại bỏ trùng ID)
        const apiIds = new Set(apiList.map((p) => String(p.id || p._id)))
        const mockRemaining = product_mock_data.filter((p) => !apiIds.has(String(p.id)))
        list = [...apiList, ...mockRemaining]
      } else {
        list = [...product_mock_data]
      }
    } catch (error) {
      console.warn('[productService] fetchProducts fallback to mock:', error.message)
      list = [...product_mock_data]
    }

    // Lọc theo filter nếu có
    if (filters.storeId) {
      list = list.filter((p) => String(p.id_store || p.storeId) === String(filters.storeId))
    }
    if (filters.category && filters.category !== 'All Categories') {
      list = list.filter((p) =>
        p.category === filters.category || p.topLavelCategory === filters.category
      )
    }
    if (filters.status && filters.status !== 'All Statuses') {
      list = list.filter((p) => (p.status || '').toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      )
    }
    return list
  },

  fetchProductById: async (id) => {
    if (!id) return null
    try {
      const res = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`)
      if (res.ok) {
        const json = await res.json()
        const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
        const found = list.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
        if (found) return found
      }
    } catch (error) {
      console.warn('[productService] fetchProductById fallback:', error.message)
    }
    return product_mock_data.find((p) => String(p.id) === String(id)) || null
  },

  createProduct: async (productData) => {
    try {
      const newProduct = {
        id: productData.id || `prod_${Date.now()}`,
        createdAt: new Date().toISOString(),
        isVisible: true,
        ...productData,
      }
      const res = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (!res.ok) throw new Error('Failed to create product')
      const json = await res.json()
      return json.data || newProduct
    } catch (error) {
      console.warn('[productService] createProduct error:', error.message)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    try {
      // Tìm _id của MongoDB
      let mongoId = id
      const checkRes = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`)
      if (checkRes.ok) {
        const checkJson = await checkRes.json()
        const list = checkJson.data?.data || []
        const matched = list.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
        if (matched) mongoId = matched._id || matched.id
      }

      const res = await fetch(`${BASE_URL}/products/${mongoId}?apiKey=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, id }),
      })
      if (!res.ok) throw new Error('Failed to update product')
      const json = await res.json()
      return json.data || { id, ...productData }
    } catch (error) {
      console.warn('[productService] updateProduct error:', error.message)
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      let mongoId = id
      const checkRes = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`)
      if (checkRes.ok) {
        const checkJson = await checkRes.json()
        const list = checkJson.data?.data || []
        const matched = list.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
        if (matched) mongoId = matched._id || matched.id
      }
      const res = await fetch(`${BASE_URL}/products/${mongoId}?apiKey=${API_KEY}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete product')
      return true
    } catch (error) {
      console.warn('[productService] deleteProduct error:', error.message)
      throw error
    }
  },

  toggleProductVisibility: async (id) => {
    const product = await productService.fetchProductById(id)
    if (!product) throw new Error('Product not found')
    return productService.updateProduct(id, { ...product, isVisible: !product.isVisible })
  },

  fetchCurrentProducts: async (filters = {}) => {
    try {
      const res = await fetch(`${BASE_URL}/products?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch currentProducts')
      const json = await res.json()
      let list = [];
    if (Array.isArray(json.data?.data)) {
      list = json.data.data;
    } else if (Array.isArray(json.data)) {
      list = json.data;
    } else if (Array.isArray(json)) {
      list = json;
    }
      const currentStore = await storeService.getCurrentStore()
      const storeIds = [filters.storeId, currentStore?.id, currentStore?._id]
        .filter(Boolean)
        .map((id) => String(id).trim())
      const storeIdSet = new Set(storeIds)
      let listCurrentProduct = storeIdSet.size
        ? list.filter((p) =>
            storeIdSet.has(String(p.id_store || p._id_store || p.storeId || '').trim())
          )
        : []
      if (filters.status && filters.status !== 'All Statuses') {
        listCurrentProduct = listCurrentProduct.filter((p) => (p.status || '').toLowerCase() === filters.status.toLowerCase())
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        listCurrentProduct = listCurrentProduct.filter((p) => p.title?.toLowerCase().includes(q))
      }
      return listCurrentProduct.map((p) => ({ ...p, id: p.id || p._id }))
    } catch (error) {
      console.warn('[productService] fetchCurrentProducts fallback:', error.message)
      return []
    }
  },

  addToCurrentProducts: async (productData) => {
    try {
      const res = await fetch(`${BASE_URL}/currentProducts?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (!res.ok) throw new Error('Failed to add to currentProducts')
      const json = await res.json()
      return json.data || productData
    } catch (error) {
      console.warn('[productService] addToCurrentProducts error:', error.message)
      throw error
    }
  },

  updateInCurrentProducts: async (id, productData) => {
    try {
      const res = await fetch(`${BASE_URL}/currentProducts?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch currentProducts')
      const json = await res.json()
      const list = json.data?.data || []
      const matched = list.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
      if (matched) {
        const mongoId = matched._id || matched.id
        const updateRes = await fetch(`${BASE_URL}/currentProducts/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...matched, ...productData, id }),
        })
        if (!updateRes.ok) throw new Error('Failed to update in currentProducts')
        const updateJson = await updateRes.json()
        return updateJson.data || productData
      }
      return productData
    } catch (error) {
      console.warn('[productService] updateInCurrentProducts error:', error.message)
      throw error
    }
  },

  removeFromCurrentProducts: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/currentProducts?apiKey=${API_KEY}`)
      if (!res.ok) return false
      const json = await res.json()
      const list = json.data?.data || []
      const matched = list.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
      if (matched) {
        const mongoId = matched._id || matched.id
        await fetch(`${BASE_URL}/currentProducts/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      }
      return true
    } catch (error) {
      console.warn('[productService] removeFromCurrentProducts error:', error.message)
      return false
    }
  },

  clearCurrentProducts: async () => {
    try {
      const res = await fetch(`${BASE_URL}/currentProducts?apiKey=${API_KEY}`)
      if (!res.ok) return false
      const json = await res.json()
      const list = json.data?.data || []
      for (const p of list) {
        const mongoId = p._id || p.id
        await fetch(`${BASE_URL}/currentProducts/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      }
      return true
    } catch (error) {
      console.warn('[productService] clearCurrentProducts error:', error.message)
      return false
    }
  },


  saveProduct: async (productData, isEdit = false) => {
    const id = productData.id

    if (isEdit && id) {
      // Cập nhật song song cả /products và /currentProducts
      const [prod] = await Promise.allSettled([
        await productService.updateProduct(id, productData),
        await  productService.updateInCurrentProducts(id, productData),
      ])
      return prod.value || productData
    } else {
      // Tạo mới song song cả /products và /currentProducts
      const [prod] = await Promise.allSettled([
        await productService.createProduct(productData),
        await productService.addToCurrentProducts(productData),
      ])
      return prod.value || productData
    }
  },
}

export default productService
