package com.thanhhandsome.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {

    @NotBlank(message = "ID sản phẩm không được để trống")
    @JsonAlias({"id", "productId"})
    String productId;

    String variantId;

    String size;

    String color;

    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    @Builder.Default
    Integer quantity = 1;

    BigDecimal price;
}
