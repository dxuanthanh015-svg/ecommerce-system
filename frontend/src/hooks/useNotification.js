import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useNotification = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: QUERY_KEYS.NOTIFICATION,
        queryFn: () => notificationService.fetchNotification(),
        refetchInterval: 5000,
    })
}

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, notification }) => notificationService.putNotification(id, notification),
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