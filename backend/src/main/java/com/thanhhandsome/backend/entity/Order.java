package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentMethod;
import com.thanhhandsome.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_code", columnList = "order_code"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_store_id", columnList = "store_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order extends BaseEntity {

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    Store store;

    // --- CÁC KHOẢN TIỀN (FINANCIAL SNAPSHOT) ---
    @Column(nullable = false)
    BigDecimal subtotal;

    @Column(name = "tax")
    @Builder.Default
    BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "shipping_fee")
    @Builder.Default
    BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "discount_amount")
    @Builder.Default
    BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false)
    BigDecimal totalAmount;

    // --- VOUCHER ÁP DỤNG ---
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<VoucherUsage> appliedVouchers = new ArrayList<>();


    // --- THÔNG TIN GIAO HÀNG (SHIPPING SNAPSHOT) ---
    @Column(name = "recipient_name", nullable = false, length = 100)
    String recipientName;

    @Column(name = "phone", nullable = false, length = 20)
    String phone;

    @Column(name = "street_address", nullable = false, length = 255)
    String streetAddress;

    @Column(length = 100)
    String city;

    @Column(length = 100)
    String district;

    @Column(name = "commission_rate")
    Double commissionRate;

    @Column(name = "commission_fee")
    @Builder.Default
    BigDecimal commissionFee = BigDecimal.ZERO;

    @Column(name = "seller_earnings")
    BigDecimal sellerEarnings;


    // --- TRẠNG THÁI & PHƯƠNG THỨC ---
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 30)
    @Builder.Default
    OrderStatus orderStatus = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    PaymentMethod paymentMethod = PaymentMethod.QR_CODE;

    @Column(length = 500)
    String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<OrderItem> items = new ArrayList<>();

    // --- HELPER METHODS ---
    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeOrderItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public void addVoucherUsage(VoucherUsage voucherUsage) {
        appliedVouchers.add(voucherUsage);
        voucherUsage.setOrder(this);
    }

    public void removeVoucherUsage(VoucherUsage voucherUsage) {
        appliedVouchers.remove(voucherUsage);
        voucherUsage.setOrder(null);
    }
}