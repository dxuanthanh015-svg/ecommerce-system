package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.OrderRequest;
import com.thanhhandsome.backend.dto.response.OrderResponse;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.mapper.OrderMapper;
import com.thanhhandsome.backend.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock OrderRepository orderRepository;
    @Mock ProductRepository productRepository;
    @Mock StoreRepository storeRepository;
    @Mock UserRepository userRepository;
    @Mock OrderMapper orderMapper;
    @Mock TrendingCacheService trendingCacheService;
    @Mock VoucherService voucherService;
    @Mock NotificationService notificationService;
    @InjectMocks OrderService orderService;

    private User customer;
    private Store store;
    private Product product;

    @BeforeEach
    void setUp() {
        customer = User.builder().email("customer@example.test").firstName("Test").lastName("Customer").build();
        customer.setId("customer-1");
        store = Store.builder().name("Test Store").commissionRate(5.0).build();
        store.setId("store-1");
        product = Product.builder().store(store).title("Test shirt").price(new BigDecimal("100000"))
                .discountedPrice(new BigDecimal("80000")).quantity(10).isActive(true).build();
        product.setId("product-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("customer-1", "", List.of()));
        lenient().when(userRepository.findById("customer-1")).thenReturn(Optional.of(customer));
        lenient().when(storeRepository.findById("store-1")).thenReturn(Optional.of(store));
    }

    @AfterEach
    void clearSecurityContext() { SecurityContextHolder.clearContext(); }

    @Test
    void createOrderRejectsEmptyCart() {
        OrderRequest request = OrderRequest.builder().storeId("store-1").items(List.of()).build();
        assertThrows(IllegalArgumentException.class, () -> orderService.createOrder(request, false));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrderRejectsMissingProduct() {
        when(productRepository.findById("missing")).thenReturn(Optional.empty());
        OrderRequest request = requestFor("missing", 1);
        assertThrows(RuntimeException.class, () -> orderService.createOrder(request, false));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrderRejectsQuantityAboveStock() {
        when(productRepository.findById("product-1")).thenReturn(Optional.of(product));
        assertThrows(IllegalArgumentException.class,
                () -> orderService.createOrder(requestFor("product-1", 11), false));
        assertEquals(10, product.getQuantity());
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrderUsesDiscountedPriceAndServerCalculatedAmountsAndStartsPending() {
        when(productRepository.findById("product-1")).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderMapper.toOrderResponse(any(Order.class))).thenReturn(OrderResponse.builder().build());

        orderService.createOrder(requestFor("product-1", 2), true);

        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        Order order = captor.getValue();
        assertEquals(OrderStatus.PENDING, order.getOrderStatus());
        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
        assertEquals(new BigDecimal("160000"), order.getSubtotal());
        assertEquals(new BigDecimal("12800.00"), order.getTax());
        assertEquals(new BigDecimal("172800.00"), order.getTotalAmount());
        assertEquals(new BigDecimal("80000"), order.getItems().get(0).getDiscountedPrice());
        assertEquals(8, product.getQuantity());
    }

    @Test
    void updateOrderStatusRejectsSkippingRequiredStates() {
        Order order = Order.builder().user(customer).store(store).orderStatus(OrderStatus.PENDING).build();
        order.setId("order-1");
        when(orderRepository.findByIdOrOrderCode("order-1", "order-1")).thenReturn(Optional.of(order));
        when(storeRepository.findByOwnerId("customer-1")).thenReturn(Optional.of(store));

        assertThrows(IllegalArgumentException.class, () -> orderService.updateOrderStatus("order-1", "DELIVERED"));
        assertEquals(OrderStatus.PENDING, order.getOrderStatus());
        verify(orderRepository, never()).save(any());
    }

    @Test
    void storeCanAcceptPendingOrderAndNotifiesCustomer() {
        Order order = Order.builder().orderCode("NX-1").user(customer).store(store)
                .orderStatus(OrderStatus.PENDING).build();
        order.setId("order-1");
        when(orderRepository.findByIdOrOrderCode("order-1", "order-1")).thenReturn(Optional.of(order));
        when(storeRepository.findByOwnerId("customer-1")).thenReturn(Optional.of(store));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(OrderResponse.builder().build());

        orderService.updateOrderStatus("order-1", "PROCESSING");

        assertEquals(OrderStatus.PROCESSING, order.getOrderStatus());
        verify(orderRepository).save(order);
        verify(notificationService).sendToUser(eq("customer-1"), anyString(), anyString(), any(), eq("order-1"));
    }

    @Test
    void customerCanCancelPendingOrderAndInventoryIsRestored() {
        product.setQuantity(8);
        var item = com.thanhhandsome.backend.entity.OrderItem.builder().product(product).quantity(2).build();
        Order order = Order.builder().orderCode("NX-CANCEL").user(customer).store(store)
                .orderStatus(OrderStatus.PENDING).items(new java.util.ArrayList<>(List.of(item))).build();
        order.setId("order-cancel");
        item.setOrder(order);
        when(orderRepository.findByIdOrOrderCode("order-cancel", "order-cancel")).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(OrderResponse.builder().build());

        orderService.cancelMyOrder("order-cancel");

        assertEquals(OrderStatus.CANCELLED, order.getOrderStatus());
        assertEquals(10, product.getQuantity());
        verify(orderRepository).save(order);
    }

    private OrderRequest requestFor(String productId, int quantity) {
        return OrderRequest.builder().orderCode("TEST-ORDER-1").storeId("store-1")
                .items(List.of(OrderRequest.OrderItemRequest.builder().productId(productId).quantity(quantity).build()))
                .build();
    }
}
