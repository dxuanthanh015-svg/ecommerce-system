import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { voucherService } from "../services/voucherService";

// 1. Lấy danh sách vouchers theo storeId
export const useVouchers = (storeId = null) => {
  return useQuery({
    queryKey: QUERY_KEYS.VOUCHERS(storeId),
    queryFn: () => voucherService.fetchVouchers(storeId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// 2. Lấy voucher theo mã code
export const useVoucherByCode = (code, storeId = null) => {
  return useQuery({
    queryKey: ['voucher', code, storeId],
    queryFn: () => voucherService.fetchVoucherByCode(code, storeId),
    enabled: Boolean(code),
    staleTime: 5 * 60 * 1000,
  });
};

// 3. Tạo voucher mới (Store Manager)
export const useCreateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ voucherDraft, storeId, status }) =>
      voucherService.createVoucher(voucherDraft, storeId, status),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VOUCHERS(variables.storeId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.VOUCHERS(null) });
    },
  });
};

// 4. Cập nhật voucher (Store Manager)
export const useUpdateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ voucherId, updateData }) =>
      voucherService.updateVoucher(voucherId, updateData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });
};

// 5. Xóa voucher (Store Manager)
export const useDeleteVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (voucherId) => voucherService.deleteVoucher(voucherId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });
};
