package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    BigDecimal totalPrice;
    BigDecimal totalDiscountedPrice;
    BigDecimal discount;
    Integer totalItem;
    List<CartItemResponse> items;
}
