package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "voucher_usages", indexes = {
        @Index(name = "idx_vu_voucher_id", columnList = "voucher_id"),
        @Index(name = "idx_vu_user_id", columnList = "user_id"),
        @Index(name = "idx_vu_order_id", columnList = "order_id")
})

public class VoucherUsage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    Voucher voucher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    // Số tiền thực tế đã giảm trong đơn này
    @Column(name = "discount_amount", nullable = false)
    BigDecimal discountAmount;

    @Column(name = "used_at", nullable = false)
    @Builder.Default
    LocalDateTime usedAt = LocalDateTime.now();
}
