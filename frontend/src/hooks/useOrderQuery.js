import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { orderService, sortOrdersByNewest } from "../services/orderService";

// 1. Lấy danh sách đơn hàng của khách hàng hiện tại (luôn xếp mới nhất lên đầu)
export const useUserOrders = (userEmail, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_ORDERS(userEmail),
    queryFn: () => orderService.fetchUserOrders(userEmail),
    select: (data) => sortOrdersByNewest(data || []),
    enabled: Boolean(userEmail),
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// 2. Lấy danh sách đơn hàng của Store (Store Manager) - luôn xếp mới nhất lên đầu
// Dùng chung queryKey STORE_REVENUE và select orders để tái sử dụng cache, không fetch lại allStoreRevenue
export const useStoreOrders = (storeId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS(storeId),
    queryFn: () => orderService.fetchStoreOrders(),
    select: (data) => sortOrdersByNewest(data || []),
    enabled: Boolean(storeId),
    staleTime: 30 * 1000,
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
export const useOrderDetail = (orderId, userEmail = null, options = {}) => {
  const qc = useQueryClient()
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const cachedOrders = qc.getQueryData(QUERY_KEYS.USER_ORDERS(userEmail))
      if (cachedOrders && cachedOrders.length > 0) {
        const order = cachedOrders.find((order) => order.orderId === orderId);
        if (order) {
          return order;
        }
      }
      const order = await orderService.fetchUserOrderById(orderId);
      return order;
    },
    initialData: () => {
      const cachedOrders = userEmail ? qc.getQueryData(QUERY_KEYS.USER_ORDERS(userEmail)) : null;
      return cachedOrders?.find((o) => String(o.orderId || o.id) === String(orderId));
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

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status, storeId = null, confirmReceived = false }) =>
      confirmReceived
        ? orderService.confirmReceived(orderId)
        : orderService.updateOrderStatusInAllRevenue(orderId, status, storeId),
    onSuccess: (data, variables) => {
      const orderId = variables?.orderId;
      const newStatus = data?.orderStatus || data?.status || variables?.status;
      if (!orderId || !newStatus) return;

      // 1. Cập nhật trực tiếp cache storeRevenue (Store Manager)
      qc.setQueriesData({ queryKey: ['storeRevenue'] }, (old) => {
        if (!old) return old;
        if (Array.isArray(old.orders)) {
          return {
            ...old,
            orders: old.orders.map((o) =>
              String(o.orderId || o.id) === String(orderId)
                ? { ...o, status: newStatus, orderStatus: newStatus }
                : o
            ),
          };
        }
        return old;
      });

      // 2. Cập nhật trực tiếp cache userOrders (Customer)
      qc.setQueriesData({ queryKey: ['userOrders'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((o) =>
          String(o.orderId || o.id) === String(orderId)
            ? { ...o, status: newStatus, orderStatus: newStatus }
            : o
        );
      });

      // 3. Cập nhật trực tiếp cache orders nếu có
      qc.setQueriesData({ queryKey: ['orders'] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((o) =>
          String(o.orderId || o.id) === String(orderId)
            ? { ...o, status: newStatus, orderStatus: newStatus }
            : o
        );
      });

      // 4. Cập nhật chi tiết đơn hàng nếu đang mở
      qc.setQueriesData({ queryKey: ['order', orderId] }, (old) => {
        if (!old) return old;
        return { ...old, status: newStatus, orderStatus: newStatus };
      });
      if (variables?.storeId) {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS(variables.storeId) });
        qc.invalidateQueries({ queryKey: QUERY_KEYS.STORE_REVENUE(variables.storeId) });
      }
    },
  });
};

export const useConfirmOrderReceived = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => orderService.confirmOrderReceived(orderId),
    onSuccess: (order, orderId) => {
      qc.invalidateQueries({ queryKey: ['userOrders'] });
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['notification'] });
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
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ALL_STORES });
    },
  });
};
