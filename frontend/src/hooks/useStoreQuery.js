import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { storeService } from "../services/storeService";
import { orderService } from "../services/orderService";
import { notificationService } from "../services/notificationService";

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

// Cập nhật storeSetting
export const useUpdateStoreSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ storeId, settings }) => storeService.updateStoreSettings(storeId, settings),
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
        mutationFn: async ({ formData, storeId, currentUser }) => {
            const userEmail = (currentUser?.email || formData.businessEmail || "").toLowerCase().trim();

            // 1. Kiểm tra xem user này đã gửi đơn đăng ký gian hàng trước đó hay chưa
            const existingApps = await storeService.getStoreApplications();
            const hasExisting = Array.isArray(existingApps) && existingApps.some(
                (app) => (app.applicantEmail?.toLowerCase().trim() === userEmail) || (app.businessEmail?.toLowerCase().trim() === userEmail)
            );

            if (hasExisting) {
                throw new Error("Bạn đã gửi đơn đăng ký trở thành Store Manager rồi! Vui lòng chờ Admin xét duyệt.");
            }

            const appRes = await storeService.saveStoreApplication({
                id: `app_${Date.now()}`,
                ...formData,
                storeId,
                shopName: formData.storeName || formData.shopName,
                status: "Pending",
                submittedAt: new Date().toISOString(),
                applicantEmail: currentUser?.email || formData.businessEmail,
                applicantName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || formData.storeName,
            });

            try {
                await notificationService.postNotification({
                    type: "Apply Store Manager",
                    message: "Đã gửi đơn đăng ký trở thành Store Manager.",
                    applicantName: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "Người dùng mới",
                    applicantEmail: currentUser?.email,
                    shopName: formData.shopName,
                    isRead: false,
                    submittedAt: new Date().toISOString(),
                });
            } catch (e) {
                console.warn("[useApplyStoreManager] Không thể gửi notification:", e.message);
            }

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
