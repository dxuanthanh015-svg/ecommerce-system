import { initialVouchers } from "./promotions.data";

export const getStoreVoucher = () => {
    let saveVoucher = JSON.parse(localStorage.getItem("voucher"));
    if (!saveVoucher || saveVoucher.length === 0) {
        localStorage.setItem("voucher", JSON.stringify([]));
        return [];
    }
    return saveVoucher;
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
    let all = JSON.parse(localStorage.getItem("voucher"));
    if (!all || all.length === 0) {
        all = [];
        localStorage.setItem("voucher", JSON.stringify([]));
    }
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
    const allVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
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
        id: `v-${Date.now()}`,
        code: resolvedCode,
        description,
        discountType: draft.discountType,
        value: Number(draft.value) || 0,
        minOrderValue: Number(draft.minOrderValue) || 0,
        maxDiscountAmount: Number(draft.maxDiscountAmount) || 0,
        usageLimit: Number(draft.usageLimit) || 0,
        usedCount: 0,
        usageCount: 0,
        startDate: draft.startDate || "",
        endDate: draft.endDate || "",
        limitPerCustomer: !!draft.limitPerCustomer,
        usedBy: {},
        status: status,
        scheduleLabel,
        type,
        storeId: storeId,
    };

    allVouchers.unshift(newVoucher);
    localStorage.setItem("voucher", JSON.stringify(allVouchers));
    return newVoucher;
};

export const isVoucherCodeDuplicate = (code, storeId, excludeId = null) => {
    const vouchers = loadVouchers(storeId);
    return vouchers.some(
        (v) =>
            v.id !== excludeId &&
            String(v.code).trim().toUpperCase() === String(code).trim().toUpperCase()
    );
};

export const updateVoucher = (id, updates) => {
    const allVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
    const index = allVouchers.findIndex(v => String(v.id) === String(id));
    if (index !== -1) {
        allVouchers[index] = { ...allVouchers[index], ...updates };
        localStorage.setItem("voucher", JSON.stringify(allVouchers));
        return allVouchers[index];
    }
    return null;
};

export const toggleVoucherStatus = (id, newStatus) => {
    return updateVoucher(id, { status: newStatus });
};

export const removeVoucher = (id) => {
    const allVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
    const updated = allVouchers.filter(v => String(v.id) !== String(id));
    localStorage.setItem("voucher", JSON.stringify(updated));
    return updated;
};

export const calculateDiscount = (voucher, subtotal = 0) => {
    if (!voucher) return 0;
    if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
        return 0;
    }
    const val = Number(voucher.value) || 0;
    if (voucher.discountType === "Percentage") {
        const discount = (subtotal * val) / 100;
        const maxCap = Number(voucher.maxDiscountAmount);
        return maxCap > 0 ? Math.min(discount, maxCap) : discount;
    }
    if (voucher.discountType === "Flat Amount") {
        return Math.min(val, subtotal);
    }
    if (voucher.discountType === "Free Shipping") {
        return subtotal > 500 ? subtotal * 0.005 : 0;
    }
    return 0;
};

export const voucherValidate = (code, storeId, subtotal, currentUserId) => {
    const allVouchers = loadVouchers(storeId);
    const voucher = allVouchers.find(
        (v) => String(v.code).trim().toUpperCase() === String(code).trim().toUpperCase()
    );
    if (!voucher) {
        return { error: "Voucher not found" };
    }
    const currentStatus = resolveVoucherStatus(voucher) || voucher.status;
    if (currentStatus !== "Active") {
        return { error: `Voucher is ${currentStatus.toLowerCase()}` };
    }

    if (voucher.startDate && new Date() < new Date(voucher.startDate)) {
        return { error: "Voucher is not active yet" };
    }
    if (voucher.endDate && new Date() > new Date(voucher.endDate)) {
        return { error: "Voucher is expired" };
    }
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
        return { error: "Voucher has reached its usage limit" };
    }
    if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
        return {
            error: `Subtotal is less than minimum order value, minimum is $${voucher.minOrderValue}`,
        };
    }

    if (voucher.limitPerCustomer && currentUserId) {
        const userUsage = voucher.usedBy?.[currentUserId] || 0;
        if (userUsage >= 1) {
            return { error: "You have already used this voucher" };
        }
    }

    const discountAmount = calculateDiscount(voucher, subtotal);

    return {
        valid: true,
        voucher,
        discountAmount,
        message:
            voucher.discountType === "Percentage"
                ? `${voucher.value}% off (max $${voucher.maxDiscountAmount || voucher.value})`
                : voucher.discountType === "Flat Amount"
                    ? `$${voucher.value} off`
                    : "Free Shipping",
        code: voucher.code,
    };
};

export const consumeVoucher = (voucherCode, storeId, userId = "guest", orderId = "", discountAmount = 0) => {
    if (!voucherCode) return;
    const allVouchers = JSON.parse(localStorage.getItem("voucher")) || [];
    const updated = allVouchers.map((v) => {
        if (
            String(v.code).trim().toUpperCase() === String(voucherCode).trim().toUpperCase() &&
            (!storeId || String(v.storeId) === String(storeId))
        ) {
            const newUsedCount = (Number(v.usedCount) || 0) + 1;
            const newStatus =
                v.usageLimit > 0 && newUsedCount >= v.usageLimit ? "Expired" : v.status;
            const userUsage = v.usedBy?.[userId] || 0;
            return {
                ...v,
                usedCount: newUsedCount,
                usageCount: newUsedCount,
                revenueImpact: (Number(v.revenueImpact) || 0) + Number(discountAmount || 0),
                status: newStatus,
                usedBy: {
                    ...(v.usedBy || {}),
                    [userId]: userUsage + 1,
                },
            };
        }
        return v;
    });
    localStorage.setItem("voucher", JSON.stringify(updated));
};


