package com.thanhhandsome.backend.dto.request;

import com.thanhhandsome.backend.enums.DiscountType;
import com.thanhhandsome.backend.enums.VoucherStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRequest {

    String storeId; // null = global voucher (admin only)

    @NotBlank(message = "Mã voucher không được để trống")
    String code;

    String description;

    @NotNull(message = "Loại giảm giá không được để trống")
    DiscountType discountType;

    @NotNull(message = "Giá trị giảm không được để trống")
    BigDecimal value;

    BigDecimal minOrderValue;
    BigDecimal maxDiscountAmount;

    Integer usageLimit;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    LocalDateTime endDate;

    Boolean limitPerCustomer;

    VoucherStatus status;
}
