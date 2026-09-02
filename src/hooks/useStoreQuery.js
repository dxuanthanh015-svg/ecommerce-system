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

// Cập nhật storeSetting
export const useUpdateStoreSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ storeId, settings }) => storeService.updateStoreSettings(storeId, settings),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_STORE })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.ALL_STORES })
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

// Alias for compatibility
export const updateStoreSetting = useUpdateStoreSettings;