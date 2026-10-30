import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useAuthStore } from "../store/useAuthStore";

export const useNotification = (audience = "customer") => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const userId = useAuthStore((state) => state.user?.id);
    return useQuery({
        queryKey: [...QUERY_KEYS.NOTIFICATION, audience, userId || "anonymous"],
        queryFn: () => notificationService.fetchNotification(audience),
        enabled: isAuthenticated,
        refetchInterval: isAuthenticated ? 5000 : false,
    })
}

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION });
        }
    })
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => notificationService.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION });
        }
    })
}

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION }),
    });
}
