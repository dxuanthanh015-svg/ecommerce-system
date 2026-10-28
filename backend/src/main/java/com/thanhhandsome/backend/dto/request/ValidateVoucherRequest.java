package com.thanhhandsome.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ValidateVoucherRequest {
    String code;
    String storeId;
    BigDecimal subtotal;
    List<Object> cartItems; // not validated deeply
}
