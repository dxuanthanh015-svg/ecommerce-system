package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.DiscountType;
import com.thanhhandsome.backend.enums.VoucherStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "vouchers", indexes = {
        @Index(name = "idx_voucher_code", columnList = "code"),
        @Index(name = "idx_voucher_store_id", columnList = "store_id"),
        @Index(name = "idx_voucher_status", columnList = "status"),
        @Index(name = "idx_voucher_dates", columnList = "start_date, end_date")
})

public class Voucher extends BaseEntity{
    @Column(name = "code", nullable = false, unique = true, length = 50)
    String code;

    @Column(length = 255)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 30)
    DiscountType discountType;

    @Column(nullable = false)
    BigDecimal value;

    @Column(name = "min_order_value")
    @Builder.Default
    BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "max_discount_amount")
    BigDecimal maxDiscountAmount ;

    @Column(name = "usage_limit")
    Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    Integer usedCount = 0;

    @Column(name = "revenue_impact")
    @Builder.Default
    BigDecimal revenueImpact = BigDecimal.ZERO;

    @Column(name = "start_date", nullable = false)
    LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    LocalDateTime endDate;

    // Giới hạn mỗi khách hàng chỉ được dùng 1 lần duy nhất
    @Column(name = "limit_per_customer", nullable = false)
    @Builder.Default
    Boolean limitPerCustomer = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    VoucherStatus status = VoucherStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    Store store;
}
