package com.thanhhandsome.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {

    @JsonAlias({"orderId", "orderCode"})
    String orderCode;

    String storeId;

    BigDecimal subtotal;
    BigDecimal tax;
    BigDecimal shippingFee;
    BigDecimal discountAmount;

    @JsonAlias({"total", "totalAmount"})
    BigDecimal totalAmount;

    String voucherCode;
    String paymentMethod; // "QR_CODE", "COD", "CREDIT_CARD"

    @JsonAlias({"address", "shippingAddress"})
    AddressRequest address;

    List<OrderItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressRequest {
        @JsonAlias({"fullName", "recipientName"})
        String recipientName;

        @JsonAlias({"phone", "phoneNumber"})
        String phone;

        @JsonAlias({"streetAddress", "address", "line1"})
        String streetAddress;

        String city;
        String district;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        @JsonAlias({"id", "productId"})
        String productId;
        String productVariantId;
        String title;
        String imageUrl;
        String size;
        String color;
        Integer quantity;
        BigDecimal price;
        BigDecimal discountedPrice;
    }
}
