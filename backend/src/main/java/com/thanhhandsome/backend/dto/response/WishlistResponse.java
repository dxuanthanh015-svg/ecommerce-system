package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistResponse {
    String id;
    String productId;
    String title;
    String brand;
    String imageUrl;
    String storeId;
    String category;
    BigDecimal price;
    BigDecimal discountedPrice;
}
