import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { orderService } from "../services/orderService";

// 1. Lấy danh sách đơn hàng của khách hàng hiện tại
export const useUserOrders = (userEmail, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_ORDERS(userEmail),
    queryFn: () => orderService.fetchUserOrders(userEmail),
    enabled: Boolean(userEmail),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 2. Lấy danh sách đơn hàng của Store (Store Manager)
export const useStoreOrders = (storeId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS(storeId),
    queryFn: async () => {
      if (!storeId) return [];
      const revenueData = await orderService.fetchStoreRevenueById(storeId);
      return revenueData?.orders || [];
    },
    enabled: Boolean(storeId),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 3. Lấy doanh thu của Store (Store Manager)
export const useStoreRevenue = (storeId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.STORE_REVENUE(storeId),
    queryFn: () => orderService.fetchStoreRevenueById(storeId),
    enabled: Boolean(storeId),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 4. Lấy chi tiết 1 đơn hàng theo orderId
export const useOrderDetail = (orderId, options = {}) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const order = await orderService.fetchUserOrderById(orderId);
      return order || orderService.fetchOrderById(orderId);
    },
    enabled: Boolean(orderId),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// 5. Mutation tạo đơn hàng mới (Checkout)
export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderPayload) => orderService.createOrder(orderPayload),
    onSuccess: (data, variables) => {
      if (variables.customerEmail || variables.email) {
        qc.invalidateQueries({ queryKey: ['userOrders'] });
      }
      if (variables.storeId) {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS(variables.storeId) });
        qc.invalidateQueries({ queryKey: QUERY_KEYS.STORE_REVENUE(variables.storeId) });
      }
    },
  });
};

// 6. Mutation cập nhật trạng thái đơn hàng (Store Manager hoặc Customer xác nhận nhận hàng)
export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateOrderStatusInAllRevenue(orderId, status),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['userOrders'] });
      qc.invalidateQueries({ queryKey: ['storeRevenue'] });
      // Cập nhật cache chi tiết đơn hàng cụ thể nếu có
      if (variables.orderId) {
        qc.setQueryData(['order', variables.orderId], (old) =>
          old ? { ...old, status: variables.status } : old
        );
      }
    },
  });
};

// 7. Mutation xử lý thanh toán & lưu doanh thu (QrCode payment)
export const useProcessOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pendingOrder, currentUser }) =>
      orderService.processOrder(pendingOrder, currentUser || {}),
    // Không invalidate ngay — user sẽ navigate sang /account/order
    // lúc đó useUserOrders sẽ tự fetch fresh data
    onSuccess: (data, variables) => {
      // Chỉ remove cache cũ để lần sau vào /account/order sẽ refetch
      qc.removeQueries({ queryKey: ['userOrders'] });
      qc.removeQueries({ queryKey: ['orders'] });
    },
  });
};
