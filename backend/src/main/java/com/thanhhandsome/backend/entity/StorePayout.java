package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "store_payouts")

public class StorePayout extends BaseEntity{
    @Column(unique = true, nullable = false, length = 50)
    String payoutCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    Store store;

    @Column(nullable = false)
    BigDecimal amount;

    @Column(nullable = false, name = "bank_name")
    String bankName;

    @Column(nullable = false, name = "account_number")
    String accountNumber;

    @Column(name = "account_holder",  nullable = false)
    String accountHolder;

    @Enumerated(EnumType.STRING)
    PayoutStatus status; // PENDING, PROCESSING, COMPLETED, REJECTED, FAILED

    String note;

    LocalDateTime processedAt;

}
