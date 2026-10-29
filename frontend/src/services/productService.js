import apiClient from './apiClient'

const deriveTopCategory = (p) => {
  if (p.topLavelCategory) return p.topLavelCategory;
  return p.category?.parent?.name || p.category?.parentCategory?.name || "";
};

const deriveSecondCategory = (p) => {
  if (p.secondLavelCategory) return p.secondLavelCategory;
  // The API's category is the leaf category, not the second-level category.
  return p.category?.parent?.name || p.category?.parentCategory?.name || "";
};

const normalizeProduct = (p) => {
  if (!p) return null;
  const topCat = deriveTopCategory(p);
  const secondCat = deriveSecondCategory(p);
  const thirdCat = p.thirdLavelCategory || p.category?.slug || p.category?.name || "";
  const storeId = p.store?.id || p.storeId || p.id_store || null;

  return {
    ...p,
    id: p.id,
    isVisible: p.isActive !== false,
    isActive: p.isActive !== false,
    discountPersent: p.discountPercent ?? p.discountPersent ?? 0,
    topLavelCategory: topCat,
    secondLavelCategory: secondCat,
    thirdLavelCategory: thirdCat,
    id_store: storeId,
    storeId: storeId,
    color: p.color || p.variants?.[0]?.colorName || "",
    size: (p.size && p.size.length > 0)
      ? p.size
      : (p.variants || []).map((v) => ({
        name: v.sizeName,
        quantity: v.quantity,
        color: v.colorName
      })),
    imageUrl: p.imageUrl || p.images?.[0] || ""
  };
};

export const productService = {

  fetchProducts: async (filters = {}) => {
    try {
      const params = {};
      if (filters.category && filters.category !== 'All Categories') params.categoryId = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.storeId) params.storeId = filters.storeId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;

      params.page = filters.page !== undefined ? filters.page : 0;
      params.size = filters.size !== undefined ? filters.size : 50;
      if (filters.sort) params.sort = filters.sort;

      const res = await apiClient.get('/products', { params });
      const result = res.data?.result;

      const list = Array.isArray(result) ? result : (result?.content || []);
      return list.map(normalizeProduct);
    } catch (error) {
      console.warn('[productService] fetchProducts error:', error.message);
      throw error;
    }
  },

  fetchProductById: async (id) => {
    if (!id) return null
    try {
      const res = await apiClient.get(`/products/${id}`)
      return normalizeProduct(res.data?.result)
    } catch (error) {
      console.warn('[productService] fetchProductById error:', error.message)
      throw error
    }
  },

  fetchCurrentProducts: async (filters = {}) => {
    try {
      const res = await apiClient.get('/products/my-store')
      const list = Array.isArray(res.data?.result) ? res.data.result : []
      return list.map(normalizeProduct)
    } catch (error) {
      console.warn('[productService] fetchCurrentProducts error:', error.message)
      throw error
    }
  },

  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData)
      return normalizeProduct(res.data?.result)
    } catch (error) {
      console.error('[productService] createProduct error:', error.response?.data || error.message)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await apiClient.put(`/products/${id}`, productData)
      return normalizeProduct(res.data?.result)
    } catch (error) {
      console.error('[productService] updateProduct error:', error.response?.data || error.message)
      throw error
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`)
      return true
    } catch (error) {
      console.error('[productService] deleteProduct error:', error.response?.data || error.message)
      throw error
    }
  },

  toggleProductVisibility: async (productOrId) => {
    try {
      const id = typeof productOrId === 'object' ? (productOrId.id || productOrId._id) : productOrId
      const currentVisible = typeof productOrId === 'object' ? productOrId.isVisible : false

      const res = await apiClient.patch(`/products/${id}/visibility`, { isVisible: !currentVisible })
      return normalizeProduct(res.data?.result)
    } catch (error) {
      console.error('[productService] toggleProductVisibility error:', error.response?.data || error.message)
      throw error
    }
  },

  saveProduct: async (productData, isEdit = false) => {
    const id = productData.id
    if (isEdit && id) {
      return await productService.updateProduct(id, productData)
    } else {
      return await productService.createProduct(productData)
    }
  },

  fetchTrendingProducts: async (limit = 5) => {
    try {
      const res = await apiClient.get('/products/trending', { params: { limit: limit } })
      return res.data?.result || []
    } catch (error) {
      console.warn('[productService] fetchTrendingProducts error:', error.message)
      throw error
    }
  },

  // GET /products/most-viewed?limit=10 → Top sản phẩm được xem nhiều nhất (cached Redis)
  fetchMostViewedProducts: async (limit = 10) => {
    try {
      const res = await apiClient.get('/products/most-viewed', { params: { limit } })
      return res.data?.result || []
    } catch (error) {
      console.warn('[productService] fetchMostViewedProducts error:', error.message)
      throw error
    }
  },
}

export default productService
