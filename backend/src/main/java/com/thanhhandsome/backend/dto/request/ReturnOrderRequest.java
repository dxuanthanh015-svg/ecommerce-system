package com.thanhhandsome.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnOrderRequest {
    @NotBlank(message = "Lý do trả hàng không được để trống")
    String reason;
}
