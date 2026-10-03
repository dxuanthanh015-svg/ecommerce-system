import { initialVouchers } from "./promotions.data";

let memoryVouchers = [...initialVouchers];

export const getStoreVoucher = () => {
    return memoryVouchers;
};

export const resolveVoucherStatus = (voucher) => {
    if (!voucher) return "Draft";
    if (voucher.status?.toLowerCase() === "draft") return "Draft";
    const date = new Date();
    if (voucher.startDate && date < new Date(voucher.startDate)) return "Upcoming";
    if (voucher.endDate && date > new Date(voucher.endDate)) return "Expired";
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) return "Expired";
    if (voucher.startDate && voucher.endDate) {
        if (date >= new Date(voucher.startDate) && date <= new Date(voucher.endDate)) return "Active";
    }
    return voucher.status || "Active";
};

export const loadVouchers = (storeId) => {
    const all = memoryVouchers;
    const filtered = storeId ? all.filter(v => String(v.storeId) === String(storeId)) : all;
    return filtered.map(v => ({
        ...v,
        status: resolveVoucherStatus(v) || v.status
    }));
};

export const getPromotionMetrics = (storeId) => {
    const vouchers = loadVouchers(storeId);
    const activeCount = vouchers.filter(v => (v.status || "").toLowerCase() === "active").length;
    const totalUsage = vouchers.reduce(
        (sum, v) => sum + (Number(v.usedCount) || Number(v.usageCount) || 0),
        0
    );
    const revenueImpact = vouchers.reduce(
        (sum, v) => sum + (Number(v.revenueImpact) || 0),
        0
    );

    return [
        {
            id: "active-vouchers",
            label: "Active Vouchers",
            value: activeCount,
            iconKey: "voucher",
            accent: "indigo",
        },
        {
            id: "total-usage",
            label: "Total Usage",
            value: totalUsage,
            iconKey: "usage",
            accent: "slate",
        },
        {
            id: "revenue-impact",
            label: "Revenue Impact",
            value: revenueImpact,
            valueType: "currencyCompact",
            iconKey: "impact",
            accent: "violet",
        },
    ];
};

export const createVoucher = (draft, storeId, status) => {
    if (!draft) return null;
    const allVouchers = memoryVouchers;
    const resolvedCode = draft.code.trim().toUpperCase();

    const normalizedType = draft.discountType?.toLowerCase();
    let type = "percentage";
    if (normalizedType.includes("flat")) {
        type = "amount";
    } else if (normalizedType.includes("shipping")) {
        type = "shipping";
    }

    const hasSchedule = draft.startDate || draft.endDate;
    const scheduleLabel = hasSchedule
        ? `${draft.startDate || "Starts now"} - ${draft.endDate || "No end date"}`
        : "Starts immediately";

    let description = `${draft.value || "0"}% off your campaign`;
    if (type === "amount") {
        description = `$${draft.value || "0"} off selected orders`;
    } else if (type === "shipping") {
        description = "Free shipping offer for selected shoppers";
    }

    const newVoucher = {
        id: `voucher-${Date.now()}`,
        code: resolvedCode,
        storeId: storeId || "store-001",
        title: resolvedCode,
        description,
        type,
        discountType: draft.discountType || "Percentage",
        discountValue: Number(draft.value) || 0,
        minOrderValue: Number(draft.minOrderValue) || 0,
        maxDiscountAmount: Number(draft.maxDiscountAmount) || 0,
        usageLimit: Number(draft.usageLimit) || 0,
        usedCount: 0,
        usageCount: 0,
        revenueImpact: 0,
        startDate: draft.startDate || null,
        endDate: draft.endDate || null,
        scheduleLabel,
        limitPerCustomer: Boolean(draft.limitPerCustomer),
        status: status || "Active",
        createdAt: new Date().toISOString(),
    };

    memoryVouchers = [newVoucher, ...allVouchers];
    return newVoucher;
};

export const isVoucherCodeDuplicate = (code, storeId) => {
    if (!code) return false;
    const allVouchers = memoryVouchers;
    const trimmed = code.trim().toUpperCase();
    return allVouchers.some(
        (v) => (v.code || "").toUpperCase() === trimmed && String(v.storeId) === String(storeId)
    );
};

export const removeVoucher = (voucherId) => {
    const allVouchers = memoryVouchers;
    memoryVouchers = allVouchers.filter((v) => v.id !== voucherId);
};

export const toggleVoucherStatus = (voucherId, newStatus) => {
    const allVouchers = memoryVouchers;
    memoryVouchers = allVouchers.map((v) =>
        v.id === voucherId ? { ...v, status: newStatus } : v
    );
};

export const voucherValidate = (code, storeId, subtotal, customerId) => {
    if (!code) {
        return { valid: false, error: "Vui lòng nhập mã giảm giá." };
    }

    const all = memoryVouchers;
    const trimmed = code.trim().toUpperCase();
    const voucher = all.find(
        (v) =>
            (v.code || "").toUpperCase() === trimmed &&
            String(v.storeId) === String(storeId)
    );

    if (!voucher) {
        return {
            valid: false,
            error: `Mã "${trimmed}" không tồn tại cho gian hàng này.`,
        };
    }

    const currentStatus = resolveVoucherStatus(voucher);
    if (currentStatus === "Expired") {
        return { valid: false, error: "Mã giảm giá này đã hết hạn sử dụng." };
    }
    if (currentStatus === "Upcoming") {
        return { valid: false, error: "Mã giảm giá này chưa đến thời gian áp dụng." };
    }
    if (currentStatus === "Draft") {
        return { valid: false, error: "Mã giảm giá này hiện chưa được kích hoạt." };
    }

    const minSpend = Number(voucher.minOrderValue) || 0;
    if (subtotal < minSpend) {
        return {
            valid: false,
            error: `Đơn hàng tối thiểu phải từ $${minSpend.toFixed(2)} để sử dụng mã này.`,
        };
    }

    let discountAmount = 0;
    const numValue = Number(voucher.discountValue) || 0;
    const maxDiscount = Number(voucher.maxDiscountAmount) || 0;

    if (voucher.discountType === "Percentage" || voucher.type === "percentage") {
        discountAmount = (subtotal * numValue) / 100;
        if (maxDiscount > 0 && discountAmount > maxDiscount) {
            discountAmount = maxDiscount;
        }
    } else if (voucher.discountType === "Fixed Amount" || voucher.type === "amount") {
        discountAmount = Math.min(subtotal, numValue);
    } else if (voucher.discountType === "Free Shipping" || voucher.type === "shipping") {
        discountAmount = subtotal > 500 ? subtotal * 0.005 : 0;
    }

    return {
        valid: true,
        code: voucher.code,
        voucher,
        discountAmount: Math.round(discountAmount * 100) / 100,
        message: `Áp dụng mã "${voucher.code}" thành công!`,
    };
};

export const consumeVoucher = (code, storeId, customerId, orderId, discountApplied) => {
    const allVouchers = memoryVouchers;
    const trimmed = (code || "").trim().toUpperCase();

    memoryVouchers = allVouchers.map((v) => {
        if (
            (v.code || "").toUpperCase() === trimmed &&
            String(v.storeId) === String(storeId)
        ) {
            const currentUsed = Number(v.usedCount) || 0;
            const currentImpact = Number(v.revenueImpact) || 0;
            const updated = {
                ...v,
                usedCount: currentUsed + 1,
                usageCount: currentUsed + 1,
                revenueImpact: currentImpact + (Number(discountApplied) || 0),
            };
            return updated;
        }
        return v;
    });
};
