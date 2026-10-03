package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "wallet_transactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WalletTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    StoreWallet wallet;

    @Column(nullable = false)
    BigDecimal amount;

    @Column(name = "balance_before", nullable = false)
    BigDecimal balanceBefore;

    @Column(name = "balance_after", nullable = false)
    BigDecimal balanceAfter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    TransactionType type;

    @Column(name = "reference_id")
    String referenceId;

    @Column(length = 255)
    String description;
}
