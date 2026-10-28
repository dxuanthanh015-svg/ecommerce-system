package com.thanhhandsome.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishlistRequest {
    @NotBlank(message = "ID sản phẩm không được để trống")
    @JsonAlias({"id", "productId"})
    String productId;
}
