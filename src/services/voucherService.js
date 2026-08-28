import {
  loadVouchers,
  createVoucher,
  voucherValidate,
  consumeVoucher,
  getPromotionMetrics,
} from '../storeManager/components/Promotions/voucher.utils'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

// ==========================================
// RESOURCE: /voucher (Mã giảm giá của các gian hàng)
// ==========================================
export const voucherService = {
  fetchVouchers: async (storeId = null) => {
    try {
      const res = await fetch(`${BASE_URL}/voucher?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch vouchers')
      const json = await res.json()
      let list = Array.isArray(json.data?.data) ? json.data.data : json.data || []
      if (storeId) {
        list = list.filter((v) => String(v.storeId) === String(storeId))
      }
      return list
    } catch (error) {
      console.warn('[voucherService] fetchVouchers fallback:', error.message)
      return loadVouchers(storeId)
    }
  },

  fetchVoucherByCode: async (code, storeId = null) => {
    try {
      const vouchers = await voucherService.fetchVouchers(storeId)
      return vouchers.find(
        (v) => (v.code || '').toUpperCase() === (code || '').toUpperCase()
      ) || null
    } catch (error) {
      console.warn('[voucherService] fetchVoucherByCode error:', error.message)
      return null
    }
  },

  fetchMetrics: async (storeId) => {
    try {
      const vouchers = await voucherService.fetchVouchers(storeId)
      const activeCount = vouchers.filter((v) => v.status === 'Active').length
      const totalRedemptions = vouchers.reduce((sum, v) => sum + (Number(v.usedCount) || 0), 0)
      const totalDiscountGiven = vouchers.reduce(
        (sum, v) => sum + (Number(v.totalDiscountGiven) || 0), 0
      )
      return { activeVouchers: activeCount, totalRedemptions, totalDiscountGiven }
    } catch (error) {
      console.warn('[voucherService] fetchMetrics fallback:', error.message)
      return getPromotionMetrics(storeId)
    }
  },

  createVoucher: async (voucherDraft, storeId, status = 'Active') => {
    try {
      const newVoucher = {
        id: voucherDraft.id || `vouch_${Date.now()}`,
        storeId: storeId || 'store-001',
        status,
        createdAt: new Date().toISOString(),
        usedCount: 0,
        totalDiscountGiven: 0,
        ...voucherDraft,
      }
      const res = await fetch(`${BASE_URL}/voucher?apiKey=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVoucher),
      })
      if (!res.ok) throw new Error('Failed to create voucher')
      const json = await res.json()
      return json.data || newVoucher
    } catch (error) {
      console.warn('[voucherService] createVoucher fallback:', error.message)
      return createVoucher(voucherDraft, storeId, status)
    }
  },

  updateVoucher: async (voucherId, updateData) => {
    try {
      const res = await fetch(`${BASE_URL}/voucher?apiKey=${API_KEY}`)
      if (!res.ok) throw new Error('Failed to fetch vouchers')
      const json = await res.json()
      const list = json.data?.data || []
      const matched = list.find(
        (v) => String(v.id || v._id) === String(voucherId)
      )
      if (matched) {
        const mongoId = matched._id || matched.id
        const updateRes = await fetch(`${BASE_URL}/voucher/${mongoId}?apiKey=${API_KEY}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...matched, ...updateData }),
        })
        if (!updateRes.ok) throw new Error('Failed to update voucher')
        const updateJson = await updateRes.json()
        return updateJson.data || { ...matched, ...updateData }
      }
      return updateData
    } catch (error) {
      console.warn('[voucherService] updateVoucher error:', error.message)
      return updateData
    }
  },

  deleteVoucher: async (voucherId) => {
    try {
      const res = await fetch(`${BASE_URL}/voucher?apiKey=${API_KEY}`)
      if (!res.ok) return false
      const json = await res.json()
      const list = json.data?.data || []
      const matched = list.find((v) => String(v.id || v._id) === String(voucherId))
      if (matched) {
        const mongoId = matched._id || matched.id
        await fetch(`${BASE_URL}/voucher/${mongoId}?apiKey=${API_KEY}`, { method: 'DELETE' })
      }
      return true
    } catch (error) {
      console.warn('[voucherService] deleteVoucher error:', error.message)
      return false
    }
  },

  validateVoucher: async (code, storeId, subtotal, cartItems = []) => {
    try {
      const voucher = await voucherService.fetchVoucherByCode(code, storeId)
      if (!voucher) return { isValid: false, message: 'Mã giảm giá không tồn tại!' }
      if (voucher.status !== 'Active') return { isValid: false, message: 'Mã giảm giá đã hết hạn hoặc tạm dừng!' }
      if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
        return { isValid: false, message: `Đơn hàng phải đạt tối thiểu ${voucher.minOrderValue.toLocaleString()}đ!` }
      }
      if (voucher.usageLimit && (voucher.usedCount || 0) >= voucher.usageLimit) {
        return { isValid: false, message: 'Mã giảm giá đã hết lượt sử dụng!' }
      }
      // Tính discount
      let discountAmount = 0
      if (voucher.discountType === 'percentage') {
        discountAmount = (subtotal * Number(voucher.discountValue || 0)) / 100
        if (voucher.maxDiscount) discountAmount = Math.min(discountAmount, Number(voucher.maxDiscount))
      } else {
        discountAmount = Number(voucher.discountValue || 0)
      }
      return {
        isValid: true,
        discountAmount,
        voucher,
        message: `Áp dụng mã "${voucher.code}" thành công! Giảm ${discountAmount.toLocaleString()}đ`,
      }
    } catch (error) {
      console.warn('[voucherService] validateVoucher fallback:', error.message)
      return voucherValidate(code, storeId, subtotal, cartItems)
    }
  },

  consumeVoucher: async (code, storeId, discountAmount = 0) => {
    try {
      const voucher = await voucherService.fetchVoucherByCode(code, storeId)
      if (!voucher) return false
      const voucherId = voucher.id || voucher._id
      await voucherService.updateVoucher(voucherId, {
        usedCount: (Number(voucher.usedCount) || 0) + 1,
        totalDiscountGiven: (Number(voucher.totalDiscountGiven) || 0) + discountAmount,
      })
      return true
    } catch (error) {
      console.warn('[voucherService] consumeVoucher fallback:', error.message)
      return consumeVoucher(code, storeId, discountAmount)
    }
  },
}

export default voucherService
