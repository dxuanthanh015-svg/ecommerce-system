package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    String id;
    String productId;
    String productTitle;
    String productImageUrl;
    String size;
    String color;
    Integer quantity;
    BigDecimal price;
    BigDecimal discountedPrice;
    BigDecimal itemSubtotal;
}
