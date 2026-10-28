import apiClient from "./apiClient";
import { useAuthStore } from "../store/useAuthStore";

export const authService = {
    // 1. Đăng ký tài khoản
    register: async (userData) => {
        try {
            const response = await apiClient.post("/auth/register", {
                email: userData.email?.trim().toLowerCase(),
                password: userData.password,
                firstName: userData.firstName?.trim(),
                lastName: userData.lastName?.trim(),
                phone: userData.phone || null,
                gender: userData.gender || null,
            });
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || "Đăng ký tài khoản thất bại!";
            throw new Error(message);
        }
    },

    // 2. Đăng nhập thường
    login: async (email, password) => {
        try {
            const response = await apiClient.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });

            const { accessToken, user } = response.data.result;
            useAuthStore.getState().setAuth(accessToken, user);
            return user;
        } catch (error) {
            // Network error (backend tắt) vs lỗi từ backend (sai mật khẩu, ...)
            if (!error.response) {
                throw new Error("Không thể kết nối đến máy chủ. Kiểm tra backend có đang chạy không!");
            }
            const message = error.response?.data?.message || "Đăng nhập thất bại!";
            throw new Error(message);
        }
    },

    // 3. Đăng nhập Google OAuth2
    loginWithGoogle: async (code) => {
        try {
            const response = await apiClient.post("/auth/google", { code });
            const { accessToken, user } = response.data.result;
            useAuthStore.getState().setAuth(accessToken, user);
            return user;
        } catch (error) {
            if (!error.response) {
                throw new Error("Không thể kết nối đến máy chủ. Kiểm tra backend có đang chạy không!");
            }
            const message = error.response?.data?.message || "Đăng nhập Google thất bại!";
            throw new Error(message);
        }
    },

    // 4. Đăng xuất
    logout: async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.warn("[authService] Lỗi gọi API logout:", error);
        } finally {
            useAuthStore.getState().clearAuth();
        }
    },

    // 5. Làm mới Access Token
    refreshToken: async () => {
        try {
            const response = await apiClient.post("/auth/refresh");
            const { accessToken, user } = response.data.result;
            useAuthStore.getState().setAuth(accessToken, user);
            return { accessToken, user };
        } catch (error) {
            useAuthStore.getState().clearAuth();
            throw error;
        }
    },

    getMyProfile: async () => {
        try {
            const response = await apiClient.get("/users/my-profile");
            return response.data.result;
        } catch (error) {
            console.error("[authService] Lấy profile thất bại:", error);
            return null;
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await apiClient.put("/users/my-profile", data);
            const updatedUser = response.data.result;

            // Cập nhật lại user trong Zustand store
            const currentToken = useAuthStore.getState().accessToken;
            useAuthStore.getState().setAuth(currentToken, updatedUser);

            return updatedUser;
        } catch (error) {
            const message = error.response?.data?.message || "Cập nhật thông tin thất bại!";
            throw new Error(message);
        }
    },
};

export default authService;
