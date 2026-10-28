package com.thanhhandsome.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    String orderCode;

    @JsonProperty("orderId")
    public String getOrderId() {
        return orderCode != null ? orderCode : id;
    }

    String userId;
    String customerName;
    String customerEmail;
    String storeId;
    String storeName;

    BigDecimal subtotal;
    BigDecimal tax;
    BigDecimal shippingFee;
    BigDecimal discountAmount;
    BigDecimal totalAmount;

    @JsonProperty("total")
    public BigDecimal getTotal() {
        return totalAmount;
    }

    String orderStatus;

    @JsonProperty("status")
    public String getStatus() {
        return orderStatus;
    }

    String paymentStatus;
    String paymentMethod;

    String recipientName;
    String phone;
    String streetAddress;
    String city;
    String district;

    List<OrderItemResponse> items;
    LocalDateTime createdAt;
}
