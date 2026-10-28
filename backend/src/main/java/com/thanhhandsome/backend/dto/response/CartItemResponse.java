package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    String id;
    String productId;
    String title;
    String brand;
    String imageUrl;
    String storeId;
    String size;
    String color;
    Integer quantity;
    BigDecimal price;
    BigDecimal discountedPrice;
}
