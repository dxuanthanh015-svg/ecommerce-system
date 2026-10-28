package com.thanhhandsome.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.thanhhandsome.backend.enums.DiscountType;
import com.thanhhandsome.backend.enums.VoucherStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    String id;
    String code;
    String description;
    DiscountType discountType;
    BigDecimal value;
    BigDecimal minOrderValue;
    BigDecimal maxDiscountAmount;
    Integer usageLimit;
    Integer usedCount;
    BigDecimal revenueImpact;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Boolean limitPerCustomer;
    VoucherStatus status;

    // Store info (flat)
    String storeId;
    String storeName;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
