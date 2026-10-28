import apiClient from './apiClient'

// Voucher data and metrics are loaded from the Spring Boot API.

export const voucherService = {
  toLocalDateTime: (date, endOfDay = false) => date
    ? `${date}T${endOfDay ? "23:59:59" : "00:00:00"}` : null,
  normalizeVoucher: (voucher) => {
    if (!voucher) return voucher;
    const statusMap = { ACTIVE: "Active", DRAFT: "Draft", EXPIRED: "Expired", DISABLED: "Disabled" };
    const typeMap = { PERCENTAGE: "Percentage", FLAT_AMOUNT: "Flat Amount", FREE_SHIPPING: "Free Shipping" };
    const type = typeMap[voucher.discountType] || voucher.discountType;
    return { ...voucher, status: statusMap[voucher.status] || voucher.status, discountType: type,
      value: voucher.value ?? voucher.discountValue,
      discountValue: voucher.value ?? voucher.discountValue,
      type: type === "Flat Amount" ? "amount" : type === "Free Shipping" ? "shipping" : "percentage",
      maxDiscount: voucher.maxDiscountAmount ?? voucher.maxDiscount };
  },

  // GET /vouchers?storeId= -> Lấy danh sách voucher (lọc theo store nếu có)
  fetchVouchers: async (storeId = null) => {
    try {
      const params = storeId ? { storeId } : {}
      const res = await apiClient.get('/vouchers', { params })
      if (!Array.isArray(res.data.result)) throw new Error('API không trả về danh sách voucher')
      return res.data.result.map(voucherService.normalizeVoucher)
    } catch (error) {
      console.warn('[voucherService] fetchVouchers error:', error.response?.data || error.message)
      throw error
    }
  },

  // GET /vouchers/code/{code}?storeId= -> Tìm voucher theo mã
  fetchVoucherByCode: async (code, storeId = null) => {
    if (!code) return null
    try {
      const params = storeId ? { storeId } : {}
      const res = await apiClient.get(`/vouchers/code/${code.toUpperCase()}`, { params })
      return voucherService.normalizeVoucher(res.data.result || null)
    } catch (error) {
      console.warn('[voucherService] fetchVoucherByCode error:', error.message)
      return null
    }
  },

  // GET /vouchers/metrics?storeId= -> Lấy số liệu thống kê voucher của store
  fetchMetrics: async (storeId) => {
    try {
      const res = await apiClient.get('/vouchers/metrics', { params: { storeId } })
      if (!res.data.result) throw new Error('API không trả về thống kê voucher')
      return res.data.result
    } catch (error) {
      console.warn('[voucherService] fetchMetrics error:', error.response?.data || error.message)
      throw error
    }
  },

  // POST /vouchers -> Tạo voucher mới
  // payload: { storeId, code, discountType, discountValue, minOrderValue, usageLimit, expiryDate, ... }
  createVoucher: async (voucherDraft, storeId, status = 'ACTIVE') => {
    try {
      const type = voucherDraft.discountType || voucherDraft.type;
      const discountType = type === "Flat Amount" || type === "amount" ? "FLAT_AMOUNT"
        : type === "Free Shipping" || type === "shipping" ? "FREE_SHIPPING" : "PERCENTAGE";
      const res = await apiClient.post('/vouchers', {
        code: voucherDraft.code,
        description: voucherDraft.description,
        discountType,
        value: Number(voucherDraft.value ?? voucherDraft.discountValue ?? 0),
        minOrderValue: Number(voucherDraft.minOrderValue) || 0,
        maxDiscountAmount: Number(voucherDraft.maxDiscountAmount ?? voucherDraft.maxDiscount) || 0,
        usageLimit: Number(voucherDraft.usageLimit) > 0 ? Number(voucherDraft.usageLimit) : null,
        startDate: voucherService.toLocalDateTime(voucherDraft.startDate),
        endDate: voucherService.toLocalDateTime(voucherDraft.endDate, true),
        limitPerCustomer: Boolean(voucherDraft.limitPerCustomer),
        storeId: storeId || voucherDraft.storeId,
        status: String(status).toUpperCase(),
      })
      return voucherService.normalizeVoucher(res.data.result)
    } catch (error) {
      console.warn('[voucherService] createVoucher error:', error.message)
      throw error
    }
  },

  // PUT /vouchers/{id} -> Cập nhật voucher
  updateVoucher: async (voucherId, updateData) => {
    try {
      const payload = { ...updateData };
      if (payload.status) payload.status = String(payload.status).toUpperCase();
      if (payload.discountType) payload.discountType = payload.discountType === "Flat Amount" ? "FLAT_AMOUNT" : payload.discountType === "Free Shipping" ? "FREE_SHIPPING" : String(payload.discountType).toUpperCase();
      const res = await apiClient.put(`/vouchers/${voucherId}`, payload)
      return voucherService.normalizeVoucher(res.data.result)
    } catch (error) {
      console.warn('[voucherService] updateVoucher error:', error.message)
      throw error
    }
  },

  // DELETE /vouchers/{id} -> Xóa voucher
  deleteVoucher: async (voucherId) => {
    try {
      await apiClient.delete(`/vouchers/${voucherId}`)
      return true
    } catch (error) {
      console.warn('[voucherService] deleteVoucher error:', error.message)
      throw error
    }
  },

  // POST /vouchers/validate -> Kiểm tra tính hợp lệ của voucher (Backend xử lý toàn bộ logic)
  // payload: { code, storeId, subtotal, cartItems }
  validateVoucher: async (code, storeId, subtotal, cartItems = []) => {
    try {
      const res = await apiClient.post('/vouchers/validate', {
        code: code.toUpperCase(),
        storeId,
        subtotal,
        cartItems,
      })
      return res.data.result
    } catch (error) {
      const message = error.response?.data?.message || 'Mã giảm giá không hợp lệ!'
      return { isValid: false, message }
    }
  },

}

export default voucherService
