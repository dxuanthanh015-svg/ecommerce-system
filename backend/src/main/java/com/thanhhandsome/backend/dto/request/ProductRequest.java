package com.thanhhandsome.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    String title;

    @NotBlank(message = "Thương hiệu không được để trống")
    String brand;

    String color;

    String description;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    BigDecimal price;

    BigDecimal discountedPrice;

    @JsonAlias({"discountPersent", "discountPercent"})
    Integer discountPercent;

    @Builder.Default
    Boolean isFlashSale = false;

    @Builder.Default
    Boolean isTrending = false;

    String flashSaleEndTime;

    @NotNull(message = "Số lượng tổng không được để trống")
    Integer quantity;

    @Builder.Default
    List<SizeRequest> size = new ArrayList<>();

    @Builder.Default
    List<VariantRequest> variants = new ArrayList<>();

    String imageUrl;

    @Builder.Default
    List<String> images = new ArrayList<>();

    String topLavelCategory;      // Level 1: "Men", "Women",...
    String secondLavelCategory;   // Level 2: "Clothing",...
    String thirdLavelCategory;    // Level 3: "jackets_coats",...
    String fourthLavelCategory;   // Level 4 (tag)

    String categoryId;            // Tùy chọn (nếu có sẵn ID)

    @JsonAlias({"isVisible", "isActive"})
    @Builder.Default
    Boolean isActive = true;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SizeRequest {
        String name;
        @Builder.Default
        Integer quantity = 0;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VariantRequest {
        String sizeName;
        String colorName;
        String colorCode;
        @Builder.Default
        Integer quantity = 0;
    }
}
