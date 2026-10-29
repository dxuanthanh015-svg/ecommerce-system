package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.OrderRequest;
import com.thanhhandsome.backend.dto.request.UpdateOrderStatusRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.OrderResponse;
import com.thanhhandsome.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class OrderController {

    OrderService orderService;

    // POST /orders -> Tạo đơn hàng mới (Pending)
    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody @Valid OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .message("Tạo đơn hàng thành công")
                .result(orderService.createOrder(request, false))
                .build();
    }

    // Demo flow: clicking "I have completed the transfer" confirms payment.
    // Replace this client confirmation with a bank/provider callback when integrated.
    @PostMapping("/process")
    public ApiResponse<OrderResponse> processOrder(@RequestBody @Valid OrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .message("Xác nhận thanh toán và tạo đơn hàng thành công")
                .result(orderService.createOrder(request, true))
                .build();
    }

    // GET /orders/my-orders -> Lấy đơn hàng của user hiện tại
    @GetMapping("/my-orders")
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Lấy danh sách đơn hàng thành công")
                .result(orderService.getMyOrders())
                .build();
    }

    // GET /orders/my-orders/{orderId} -> Chi tiết 1 đơn hàng của user
    @GetMapping("/my-orders/{orderId}")
    public ApiResponse<OrderResponse> getMyOrderById(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderService.getMyOrderById(orderId))
                .build();
    }

    @PatchMapping("/my-orders/{orderId}/confirm-received")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STORE_MANAGER', 'ADMIN')")
    public ApiResponse<OrderResponse> confirmOrderReceived(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .message("Xác nhận đã nhận hàng thành công")
                .result(orderService.confirmOrderReceived(orderId))
                .build();
    }

    // GET /orders/store/my-store -> Lấy đơn hàng của store (Store Manager)
    @GetMapping("/store/my-store")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<List<OrderResponse>> getMyStoreOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Lấy đơn hàng của cửa hàng thành công")
                .result(orderService.getMyStoreOrders())
                .build();
    }

    // PATCH /orders/{orderId}/status -> Cập nhật trạng thái đơn hàng (Store Manager / Admin)
    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody @Valid UpdateOrderStatusRequest request
    ) {
        return ApiResponse.<OrderResponse>builder()
                .message("Cập nhật trạng thái đơn hàng thành công")
                .result(orderService.updateOrderStatus(orderId, request.getStatus()))
                .build();
    }

    // GET /orders -> Tất cả đơn hàng (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Lấy toàn bộ đơn hàng thành công")
                .result(orderService.getAllOrders())
                .build();
    }

    // GET /orders/{orderId} -> Chi tiết đơn hàng bất kỳ (Admin)
    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderService.getOrderById(orderId))
                .build();
    }

    // DELETE /orders/{orderId} -> Xóa đơn hàng (Admin)
    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ApiResponse.<Void>builder()
                .message("Xóa đơn hàng thành công")
                .build();
    }

    // GET /orders/store/{storeId} -> Lấy đơn hàng theo storeId (Admin)
    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<List<OrderResponse>> getOrdersByStoreId(@PathVariable String storeId) {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Lấy đơn hàng theo cửa hàng thành công")
                .result(orderService.getOrdersByStoreId(storeId))
                .build();
    }

    // GET /orders/store/my-store/revenue -> Doanh thu cửa hàng hiện tại
    @GetMapping("/store/my-store/revenue")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<java.util.Map<String, Object>> getMyStoreRevenue() {
        return ApiResponse.<java.util.Map<String, Object>>builder()
                .message("Lấy doanh thu cửa hàng thành công")
                .result(orderService.getMyStoreRevenue())
                .build();
    }

    // GET /orders/store/{storeId}/revenue -> Doanh thu cửa hàng theo ID (Admin)
    @GetMapping("/store/{storeId}/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<java.util.Map<String, Object>> getStoreRevenueById(@PathVariable String storeId) {
        return ApiResponse.<java.util.Map<String, Object>>builder()
                .message("Lấy doanh thu cửa hàng thành công")
                .result(orderService.getStoreRevenueById(storeId))
                .build();
    }

    // GET /orders/revenue/all-stores -> Doanh thu tổng hợp tất cả store (Admin)
    @GetMapping("/revenue/all-stores")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<java.util.Map<String, Object>> getAllStoreRevenue() {
        return ApiResponse.<java.util.Map<String, Object>>builder()
                .message("Lấy doanh thu tổng hợp thành công")
                .result(orderService.getAllStoreRevenue())
                .build();
    }
}
