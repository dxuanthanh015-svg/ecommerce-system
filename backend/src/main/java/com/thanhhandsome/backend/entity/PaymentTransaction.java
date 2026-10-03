package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.entity.BaseEntity;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.enums.PaymentMethod;
import com.thanhhandsome.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_transactions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @Column(unique = true, nullable = false, name = "transaction_code")
    String transactionCode; // Mã giao dịch cổng thanh toán hoặc ngân hàng

    BigDecimal amount;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod; // QR_CODE, VNPAY, MOMO, COD

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    PaymentStatus status; // PENDING, SUCCESS, FAILED, EXPIRED

    @Column(name = "qr_code_url", length = 500)
    String qrCodeUrl;

    @Column(name = "qr_code_s3_key", length = 255)
    String qrCodeS3Key;

    LocalDateTime expiresAt; // Hết hạn QR sau 15p
    LocalDateTime paidAt;

    @Column(columnDefinition = "TEXT", name = "gateway_response")
    String gatewayResponse; // Raw JSON phản hồi từ Webhook
}
