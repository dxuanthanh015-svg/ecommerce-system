package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.OrderRequest;
import com.thanhhandsome.backend.dto.response.OrderResponse;
import com.thanhhandsome.backend.entity.*;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentMethod;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.OrderMapper;
import com.thanhhandsome.backend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepository;
    ProductRepository productRepository;
    StoreRepository storeRepository;
    UserRepository userRepository;
    OrderMapper orderMapper;
    TrendingCacheService trendingCacheService;
    VoucherService voucherService;
    NotificationService notificationService;

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request, boolean isPaid) {
        User user = getCurrentUser();

        // Make client retries safe when order creation succeeded but the response was lost.
        if (request.getOrderCode() != null && !request.getOrderCode().isBlank()) {
            var existingOrder = orderRepository.findByOrderCode(request.getOrderCode());
            if (existingOrder.isPresent()) {
                Order order = existingOrder.get();
                if (!order.getUser().getId().equals(user.getId())) {
                    throw new IllegalArgumentException("Mã đơn hàng đã được sử dụng");
                }
                return orderMapper.toOrderResponse(order);
            }
        }

        String storeId = request.getStoreId();
        Store store = (storeId != null && !storeId.isBlank())
                ? storeRepository.findById(storeId).orElse(null)
                : null;

        if (store == null && request.getItems() != null && !request.getItems().isEmpty()) {
            Product firstProd = productRepository.findById(request.getItems().get(0).getProductId()).orElse(null);
            if (firstProd != null) {
                store = firstProd.getStore();
            }
        }
        if (store == null) {
            store = storeRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng phải có ít nhất một sản phẩm");
        }

        String orderCode = (request.getOrderCode() != null && !request.getOrderCode().isBlank())
                ? request.getOrderCode()
                : "NX-" + UUID.randomUUID();

        PaymentMethod paymentMethod = PaymentMethod.QR_CODE;
        if (request.getPaymentMethod() != null) {
            try {
                paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (Exception ignored) {}
        }

        Order.OrderBuilder orderBuilder = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .store(store)
                .subtotal(BigDecimal.ZERO)
                .tax(BigDecimal.ZERO)
                .shippingFee(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                // Payment confirmation must not bypass the store's order review.
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(isPaid ? PaymentStatus.PAID : PaymentStatus.PENDING)
                .paymentMethod(paymentMethod)
                .items(new ArrayList<>());

        if (request.getAddress() != null) {
            String recipient = request.getAddress().getRecipientName();
            if (recipient == null || recipient.isBlank()) {
                recipient = user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "");
            }
            orderBuilder.recipientName(recipient)
                    .phone(request.getAddress().getPhone() != null ? request.getAddress().getPhone() : (user.getPhone() != null ? user.getPhone() : ""))
                    .streetAddress(request.getAddress().getStreetAddress() != null ? request.getAddress().getStreetAddress() : "Việt Nam")
                    .city(request.getAddress().getCity() != null ? request.getAddress().getCity() : "")
                    .district(request.getAddress().getDistrict() != null ? request.getAddress().getDistrict() : "");
        } else {
            orderBuilder.recipientName(user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : ""))
                    .phone(user.getPhone() != null ? user.getPhone() : "")
                    .streetAddress("Việt Nam");
        }

        Order order = orderBuilder.build();
        BigDecimal calculatedCommission = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
                if (!product.getStore().getId().equals(store.getId())) {
                    throw new IllegalArgumentException("Đơn hàng chỉ được chứa sản phẩm cùng cửa hàng");
                }
                int quantity = itemReq.getQuantity() == null ? 1 : itemReq.getQuantity();
                if (quantity <= 0 || quantity > product.getQuantity()) {
                    throw new IllegalArgumentException("Số lượng sản phẩm không hợp lệ hoặc không đủ tồn kho");
                }
                BigDecimal unitPrice = product.getDiscountedPrice();
                if (unitPrice == null || unitPrice.compareTo(product.getPrice()) >= 0) {
                    unitPrice = product.getPrice();
                }

                String imageUrl = (itemReq.getImageUrl() != null && !itemReq.getImageUrl().isBlank())
                        ? itemReq.getImageUrl()
                        : (product.getImageUrl() != null ? product.getImageUrl() : "");

                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .productTitle(itemReq.getTitle() != null ? itemReq.getTitle() : product.getTitle())
                        .productImageUrl(imageUrl)
                        .size(itemReq.getSize() != null ? itemReq.getSize() : "M")
                        .color(itemReq.getColor() != null ? itemReq.getColor() : "Default")
                        .quantity(quantity)
                        .price(product.getPrice())
                        .discountedPrice(unitPrice)
                        .build();

                order.addOrderItem(orderItem);
                BigDecimal lineSubtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
                order.setSubtotal(order.getSubtotal().add(lineSubtotal));
                BigDecimal commissionRate = product.getCategory() != null
                        ? product.getCategory().getCommissionRate() : null;
                if (commissionRate == null) {
                    commissionRate = BigDecimal.valueOf(store.getCommissionRate() == null ? 5.0 : store.getCommissionRate());
                }
                calculatedCommission = calculatedCommission.add(lineSubtotal.multiply(commissionRate)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
                product.setQuantity(product.getQuantity() - quantity);
            }
        }
        order.setCommissionFee(calculatedCommission);
        order.setSellerEarnings(order.getSubtotal().subtract(calculatedCommission));
        if (order.getSubtotal().signum() > 0) {
            order.setCommissionRate(calculatedCommission.multiply(BigDecimal.valueOf(100))
                    .divide(order.getSubtotal(), 2, RoundingMode.HALF_UP).doubleValue());
        }

        // Shipping is authoritative on the server. Never accept the amount sent
        // by the browser as the value to charge.
        BigDecimal shipping = order.getSubtotal().compareTo(new BigDecimal("500000")) > 0
                ? order.getSubtotal().multiply(new BigDecimal("0.005")).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal tax = order.getSubtotal()
                .multiply(new BigDecimal("0.08"))
                .setScale(2, RoundingMode.HALF_UP);
        if (shipping.signum() < 0 || tax.signum() < 0) {
            throw new IllegalArgumentException("Tổng tiền, thuế, phí giao hàng hoặc giảm giá không hợp lệ");
        }
        order.setShippingFee(shipping);
        order.setTax(tax);
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
            discount = voucherService.consumeForOrder(request.getVoucherCode(), store, user, order);
        }
        if (discount.compareTo(order.getSubtotal().add(shipping)) > 0) {
            throw new IllegalArgumentException("Số tiền giảm giá không hợp lệ");
        }
        order.setDiscountAmount(discount);
        order.setTotalAmount(order.getSubtotal().add(tax).add(shipping).subtract(discount));

        Order saved = orderRepository.save(order);

        if (saved.getStore() != null && saved.getStore().getOwner() != null) {
            notificationService.sendToUser(saved.getStore().getOwner().getId(), "Đơn hàng mới",
                    "Bạn có đơn hàng mới " + saved.getOrderCode() + " cần xử lý.",
                    com.thanhhandsome.backend.enums.NotificationType.STORE_ORDER_NEW, saved.getId());
        }

        // Xóa cache trending để cập nhật lại sản phẩm bán chạy
        try {
            trendingCacheService.evictCache();
        } catch (Exception e) {
            log.warn("Không thể xóa cache trending: {}", e.getMessage());
        }

        return orderMapper.toOrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orderMapper.toOrderResponseList(orders);
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrderById(String orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findByIdOrOrderCode(orderId, orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }
        return orderMapper.toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyStoreOrders() {
        User user = getCurrentUser();
        Store store = storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        List<Order> orders = orderRepository.findByStoreIdOrderByCreatedAtDesc(store.getId());
        return orderMapper.toOrderResponseList(orders);
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String newStatus) {
        Order order = orderRepository.findByIdOrOrderCode(orderId, orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin) {
            Store ownStore = storeRepository.findByOwnerId(authentication.getName())
                    .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
            if (!ownStore.getId().equals(order.getStore().getId())) {
                throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
            }
        }

        OrderStatus previousStatus = order.getOrderStatus();
        OrderStatus requestedStatus;
        try {
            requestedStatus = OrderStatus.valueOf(newStatus.trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ: " + newStatus);
        }
        if (previousStatus == requestedStatus) {
            return orderMapper.toOrderResponse(order);
        }
        if (!isAllowedOrderTransition(previousStatus, requestedStatus)) {
            throw new IllegalArgumentException(
                    "Không thể chuyển trạng thái đơn hàng từ " + previousStatus + " sang " + requestedStatus);
        }
        order.setOrderStatus(requestedStatus);

        if (order.getOrderStatus() == OrderStatus.CANCELLED && previousStatus != OrderStatus.CANCELLED) {
            order.getItems().forEach(item -> {
                Product product = item.getProduct();
                product.setQuantity((product.getQuantity() == null ? 0 : product.getQuantity()) + item.getQuantity());
            });
        }

        Order saved = orderRepository.save(order);
        notificationService.sendToUser(saved.getUser().getId(), "Cập nhật đơn hàng",
                "Đơn hàng " + saved.getOrderCode() + " đã chuyển sang trạng thái " + statusLabel(requestedStatus) + ".",
                com.thanhhandsome.backend.enums.NotificationType.ORDER_UPDATE, saved.getId());
        return orderMapper.toOrderResponse(saved);
    }

    @Transactional
    public OrderResponse confirmOrderReceived(String orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findByIdOrOrderCode(orderId, orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (order.getOrderStatus() != OrderStatus.SHIPPED) {
            throw new IllegalArgumentException("Chỉ có thể xác nhận nhận hàng khi đơn đang giao");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        Order saved = orderRepository.save(order);
        Store store = saved.getStore();
        if (store != null && store.getOwner() != null) {
            notificationService.sendToUser(store.getOwner().getId(), "Khách đã nhận hàng",
                    "Khách hàng đã xác nhận nhận đơn " + saved.getOrderCode() + ".",
                    com.thanhhandsome.backend.enums.NotificationType.STORE_ORDER_UPDATE, saved.getId());
        }
        return orderMapper.toOrderResponse(saved);
    }

    private String statusLabel(OrderStatus status) {
        return status == OrderStatus.SHIPPED ? "Đang giao" : status.name();
    }

    private boolean isAllowedOrderTransition(OrderStatus current, OrderStatus requested) {
        if (current == requested) return true;
        return switch (current) {
            case PENDING -> requested == OrderStatus.PROCESSING || requested == OrderStatus.CANCELLED;
            case PROCESSING -> requested == OrderStatus.SHIPPED || requested == OrderStatus.CANCELLED;
            // Customer confirmation endpoint alone can complete delivery.
            case SHIPPED -> false;
            case DELIVERED, CANCELLED -> false;
        };
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderMapper.toOrderResponseList(orderRepository.findAll());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findByIdOrOrderCode(orderId, orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return orderMapper.toOrderResponse(order);
    }

    @Transactional
    public void deleteOrder(String orderId) {
        Order order = orderRepository.findByIdOrOrderCode(orderId, orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        orderRepository.delete(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStoreId(String storeId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin) {
            Store ownStore = storeRepository.findByOwnerId(authentication.getName())
                    .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
            if (!ownStore.getId().equals(storeId)) {
                throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
            }
        }
        List<Order> orders = orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId);
        return orderMapper.toOrderResponseList(orders);
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getMyStoreRevenue() {
        User user = getCurrentUser();
        Store store = storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        return buildRevenueMap(store.getId());
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getStoreRevenueById(String storeId) {
        return buildRevenueMap(storeId);
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getAllStoreRevenue() {
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal total = allOrders.stream()
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("totalRevenue", total);
        result.put("totalOrders", allOrders.size());
        return result;
    }

    private java.util.Map<String, Object> buildRevenueMap(String storeId) {
        List<Order> orders = orderRepository.findByStoreIdOrderByCreatedAtDesc(storeId);
        BigDecimal total = orders.stream()
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("storeId", storeId);
        result.put("totalRevenue", total);
        result.put("totalOrders", orders.size());
        return result;
    }
}
