package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "store_wallets")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreWallet extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", unique = true, nullable = false)
    Store store;

    @Column(name = "available_balance", nullable = false)
    @Builder.Default
    BigDecimal availableBalance = BigDecimal.ZERO;

    @Column(name = "pending_balance", nullable = false)
    @Builder.Default
    BigDecimal pendingBalance = BigDecimal.ZERO;

    @Column(name = "total_revenue", nullable = false)
    @Builder.Default
    BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_withdrawn", nullable = false)
    @Builder.Default
    BigDecimal totalWithdrawn = BigDecimal.ZERO;
}
