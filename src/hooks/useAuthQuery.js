import { useQuery, useQueryClient, useMutation, } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { authService } from "../services/authService";

export { QUERY_KEYS };

// hook lấy thông tin người dùng hiện tại dùng chung cho toàn app

export const useCurrentUser = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: () => authService.getCurrentUser(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
    });
}

export const useLoginMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ email, password }) => authService.login(email, password),
        onSuccess: (user) => {
            qc.setQueryData(QUERY_KEYS.CURRENT_USER, user);
            // Khi đăng nhập lại, cập nhật dữ liệu từ server khi login
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_STORE })
            qc.invalidateQueries({ queryKey: ['cart'] })
            qc.invalidateQueries({ queryKey: ['wishlist'] })
        }
    })
}

// Logout
export const useLogoutMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            // Xóa cache khi logout
            qc.setQueryData(QUERY_KEYS.CURRENT_USER, null);
            qc.setQueryData(QUERY_KEYS.CURRENT_STORE, null);
            qc.removeQueries({ queryKey: ['cart'] });
            qc.removeQueries({ queryKey: ['wishlist'] });
        }
    })
}

// Đky tài khoản mới
export const useUpdateProfileMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => {
            return authService.updateProfile(id, data);
        },
        onSuccess: (updateUser) => {
            qc.setQueryData(QUERY_KEYS.CURRENT_USER, updateUser)
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER })
        }
    })
}

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (userData) => authService.register(userData),
    })
}