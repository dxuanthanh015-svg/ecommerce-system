import { useQuery, useQueryClient, useMutation, } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { authService } from "../services/authService";

export { QUERY_KEYS };

export const useCurrentUser = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: () => authService.getMyProfile(),
        staleTime: 5 * 60 * 1000, // Cache 5 phút
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
            // Login response intentionally contains only brief user info. Force
            // useCurrentUser to fetch /users/my-profile (including addresses).
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_STORE })
            qc.invalidateQueries({ queryKey: ['cart'] })
            qc.invalidateQueries({ queryKey: ['wishlist'] })
        }
    })
}

export const useLoginWithGoogleMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (code) => authService.loginWithGoogle(code),
        onSuccess: (user) => {
            qc.setQueryData(QUERY_KEYS.CURRENT_USER, user);
            // Google login also returns brief user info without saved addresses.
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_STORE });
            qc.invalidateQueries({ queryKey: ['cart'] });
            qc.invalidateQueries({ queryKey: ['wishlist'] });
        }
    });
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


export const useUpdateProfileMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (idOrData) => {

            const payload =
                idOrData && typeof idOrData === "object" && "data" in idOrData
                    ? idOrData.data
                    : idOrData;
            return authService.updateProfile(payload);
        },
        onSuccess: (updatedUser) => {
            qc.setQueryData(QUERY_KEYS.CURRENT_USER, updatedUser);
        },
    });
}

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (userData) => authService.register(userData),
    })
}
