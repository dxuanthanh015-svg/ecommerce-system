import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { storeService } from "../services/storeService";
import { orderService } from "../services/orderService";

// Lấy store hiện tại
export const useCurrentStore = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CURRENT_STORE,
        queryFn: () => storeService.getCurrentStore(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1
    })
}
// Lấy hết Toàn bộ store
export const useAllStores = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ALL_STORES,
        queryFn: () => storeService.fetchAllStores(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1
    })
}

// Lấy store theo id
export const useStoreDetail = (storeId) => {
    return useQuery({
        queryKey: ['store', storeId],
        queryFn: () => storeService.fetchStoreById(storeId),
        enabled: Boolean(storeId),
        staleTime: 5 * 60 * 1000,
    })
}

export const usePublicStoreProducts = (storeId, tab = 'all', search = '') => {
    return useQuery({
        queryKey: ['publicStoreProducts', storeId, tab, search],
        queryFn: () => storeService.fetchStoreProducts(storeId, tab, search),
        enabled: Boolean(storeId),
        staleTime: 60 * 1000,
    })
}

// Cập nhật storeSetting
export const useUpdateStoreSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ settings }) => storeService.updateStoreSettings(settings),
        onSuccess: (savedStore) => {
            if (savedStore) {
                qc.setQueryData(QUERY_KEYS.CURRENT_STORE, savedStore);
            } else {
                qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_STORE });
            }
            qc.invalidateQueries({ queryKey: QUERY_KEYS.ALL_STORES });
        }
    })
}

export const useStoreRevenue = (storeId) => {
    return useQuery({
        queryKey: QUERY_KEYS.STORE_REVENUE(storeId),
        queryFn: () => orderService.fetchStoreRevenueById(storeId),
        enabled: Boolean(storeId),
        staleTime: 5 * 60 * 1000,
    })
}

// Đăng ký trở thành Store Manager
export const useApplyStoreManager = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ formData, currentUser }) => {
            const userEmail = (currentUser?.email || formData.businessEmail || "").toLowerCase().trim();

            // This endpoint returns only the current user's application.
            // /stores/applications is admin-only and must not be called here.
            const existingApplication = await storeService.getStoreApplication();
            if (existingApplication) {
                throw new Error("Bạn đã gửi đơn đăng ký trở thành Store Manager rồi! Vui lòng chờ Admin xét duyệt.");
            }

            const appRes = await storeService.saveStoreApplication({
                shopName: formData.shopName || formData.storeName,
                shopDescription: formData.shopDescription,
                primaryCategory: formData.primaryCategory,
                businessType: formData.businessType,
                taxCode: formData.taxCode,
                documentFileName: formData.documentFileName,
                businessEmail: formData.businessEmail || userEmail,
                phone: formData.phone,
                address: formData.pickupAddress,
                city: formData.city,
                idCardNumber: formData.idCardNumber,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountHolder: formData.accountHolder,
            });

            return appRes;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION });
        }
    })
}

// Alias for compatibility
export const updateStoreSetting = useUpdateStoreSettings;
