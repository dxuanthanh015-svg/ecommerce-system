package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import com.thanhhandsome.backend.enums.DiscountType;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherValidateResponse {
    Boolean isValid;
    String message;
    BigDecimal discountAmount;
    String voucherId;
    String code;
    DiscountType discountType;
}
