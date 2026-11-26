package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.PaymentIntentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_intents", indexes = {
        @Index(name = "idx_payment_intent_user", columnList = "user_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentIntent extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "transaction_code", nullable = false, unique = true, length = 100)
    String transactionCode;

    @Column(nullable = false, precision = 15, scale = 2)
    BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    PaymentIntentStatus status = PaymentIntentStatus.PENDING;

    @Lob
    @Column(name = "checkout_payload", nullable = false)
    String checkoutPayload;

    @Column(name = "expires_at")
    LocalDateTime expiresAt;

    @Column(name = "paid_at")
    LocalDateTime paidAt;

    @Column(name = "order_code", length = 80)
    String orderCode;

    @Lob
    @Column(name = "gateway_response")
    String gatewayResponse;
}
