const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const viewsService = {
    fetchViewsData: async () => {
        try {
            const res = await fetch(`${BASE_URL}/viewsData?apiKey=${API_KEY}`)
            if (!res.ok) return {}
            const json = await res.json()
            const list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
            return list.reduce((acc, item) => {
                if (item.productId) acc[item.productId] = item
                return acc
            }, {})
        } catch {
            return {}
        }
    },

    recordProductView: async (product, cachedViews = null) => {
        if (!product?.id) return null
        try {
            let viewsMap = cachedViews
            // Nếu chưa có viewsMap từ cache, lấy danh sách views hiện tại để xác định đúng _id và số views
            if (!viewsMap || Object.keys(viewsMap).length === 0) {
                viewsMap = await viewsService.fetchViewsData()
            }

            const existing = viewsMap ? viewsMap[product.id] : null
            const updatedViews = (existing?.views || 0) + 1
            const payload = {
                productId: product.id,
                storeId: product.id_store || product.storeId || "store-001",
                title: product.title || "",
                imageUrl: product.imageUrl || "",
                views: updatedViews,
                lastView: new Date().toISOString(),
            }

            let savedData = null
            if (existing && (existing._id || existing.id)) {
                const mongoId = existing._id || existing.id
                const res = await fetch(`${BASE_URL}/viewsData/${mongoId}?apiKey=${API_KEY}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existing, ...payload }),
                })
                if (res.ok) {
                    const json = await res.json()
                    savedData = json.data || { ...existing, ...payload }
                }
            } else {
                const res = await fetch(`${BASE_URL}/viewsData?apiKey=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                if (res.ok) {
                    const json = await res.json()
                    savedData = json.data || payload
                }
            }
            return savedData || payload
        } catch (e) {
            console.warn('[viewsService] recordProductView error:', e.message)
            return null
        }
    },

    saveViewsData: async (productId, viewEntry, allViews) => {
        try {
            const list = Object.values(allViews || {})
            const existing = list.find((v) => String(v.productId) === String(productId))
            const payload = { ...viewEntry, productId }
            if (existing) {
                const mongoId = existing._id || existing.id
                await fetch(`${BASE_URL}/viewsData/${mongoId}?apiKey=${API_KEY}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existing, ...payload }),
                })
            } else {
                await fetch(`${BASE_URL}/viewsData?apiKey=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            }
        } catch (e) {
            console.warn('[viewsService] saveViewsData error:', e.message)
        }
    }

}