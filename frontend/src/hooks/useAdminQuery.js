import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { adminService } from "../services/adminService"
import { QUERY_KEYS } from "../constants/queryKeys"
import { toast } from "react-hot-toast";

export const useAdminDashboardQuery = () => {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN_DASHBOARD,
        queryFn: () => adminService.fetchDashboardData(),
        staleTime: 60 * 1000, // Cache 1 phút, tránh refetch liên tục
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false, // Không refetch khi focus/click qua lại các cửa sổ
        refetchOnMount: true,
        refetchInterval: 30 * 1000, // Nhận đơn đăng ký Store Manager mới trên header Admin
    });
};

// Duyệt đơn
export const useApproveStoreApplication = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (application) => {
            const applicationId = typeof application === "string"
                ? application
                : application?.id || application?._id || application?.applicationId;
            if (!applicationId) throw new Error("Không tìm thấy mã đơn đăng ký gian hàng.");
            return adminService.approveStoreApplication(applicationId);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
            await qc.invalidateQueries({ queryKey: QUERY_KEYS.ALL_STORES });
            toast.success("Đã duyệt gian hàng thành công!");
        },
        onError: (error) => {
            console.error("Lỗi khi duyệt đơn:", error);
            toast.error(error.message || "Lỗi duyệt gian hàng");
        },
    });
};
// Từ chối đơn

export const useRejectStoreApplication = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => await adminService.rejectStoreApplication(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
            toast.success("Đã từ chối đơn đăng ký gian hàng!");
        },
        onError: (error) => {
            console.error("Lỗi khi từ chối đơn:", error);
            toast.error(error.message || "Lỗi từ chối gian hàng");
        },
    });
};
