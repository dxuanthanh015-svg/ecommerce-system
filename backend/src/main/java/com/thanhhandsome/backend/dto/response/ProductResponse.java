package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String title;
    String slug;
    String brand;
    BigDecimal price;
    BigDecimal discountedPrice;
    Integer discountPercent;
    Integer quantity;
    String imageUrl;
    List<String> images;
    String description;
    Double rating;
    Integer reviewCount;
    Long viewsCount;
    Long soldCount;
    Boolean isActive;
    Boolean isTrending;
    Boolean isFlashSale;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Thông tin store rút gọn
    StoreInfo store;

    // Thông tin category rút gọn
    CategoryInfo category;

    // Danh sách biến thể
    @Builder.Default
    List<VariantResponse> variants = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StoreInfo {
        String id;
        String name;
        String logoUrl;
        Double rating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        String id;
        String name;
        String slug;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantResponse {
        String id;
        String sizeName;
        String colorName;
        String colorCode;
        Integer quantity;
    }
}
