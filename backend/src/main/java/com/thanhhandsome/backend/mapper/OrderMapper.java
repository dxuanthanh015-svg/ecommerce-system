package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.response.OrderItemResponse;
import com.thanhhandsome.backend.dto.response.OrderResponse;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.entity.OrderItem;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface OrderMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "customerName", expression = "java(order.getUser() != null ? (order.getUser().getFirstName() != null ? order.getUser().getFirstName() + \" \" + (order.getUser().getLastName() != null ? order.getUser().getLastName() : \"\") : order.getRecipientName()) : order.getRecipientName())")
    @Mapping(target = "customerEmail", source = "user.email")
    @Mapping(target = "storeId", source = "store.id")
    @Mapping(target = "storeName", source = "store.name")
    @Mapping(target = "orderStatus", expression = "java(order.getOrderStatus() != null ? order.getOrderStatus().name() : null)")
    @Mapping(target = "paymentStatus", expression = "java(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null)")
    @Mapping(target = "paymentMethod", expression = "java(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)")
    @Mapping(target = "items", source = "items")
    OrderResponse toOrderResponse(Order order);

    List<OrderResponse> toOrderResponseList(List<Order> orders);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productImageUrl", expression = "java(resolveProductImage(orderItem))")
    @Mapping(target = "itemSubtotal", expression = "java(orderItem.getItemSubtotal())")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> items);

    default String resolveProductImage(OrderItem orderItem) {
        if (orderItem == null) return null;
        if (orderItem.getProductImageUrl() != null && !orderItem.getProductImageUrl().isBlank()) {
            return orderItem.getProductImageUrl();
        }
        if (orderItem.getProduct() == null) return null;
        if (orderItem.getProduct().getImageUrl() != null && !orderItem.getProduct().getImageUrl().isBlank()) {
            return orderItem.getProduct().getImageUrl();
        }
        if (orderItem.getProduct().getImages() != null && !orderItem.getProduct().getImages().isEmpty()) {
            return orderItem.getProduct().getImages().get(0);
        }
        return null;
    }
}
