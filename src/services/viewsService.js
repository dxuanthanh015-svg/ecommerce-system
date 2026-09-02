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