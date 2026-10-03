package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items", indexes = {
        @Index(name = "idx_order_id", columnList = "order_id"),
        @Index(name = "idx_product_id", columnList = "product_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    ProductVariant productVariant;

    // --- SNAPSHOT THÔNG TIN SẢN PHẨM TẠI THỜI ĐIỂM MUA ---
    @Column(name = "product_title", nullable = false, length = 255)
    String productTitle;

    @Column(name = "product_image_url", length = 500)
    String productImageUrl;

    @Column(length = 100)
    String sku; // Snapshot mã SKU kho

    @Column(length = 50)
    String size;

    @Column(length = 50)
    String color;

    @Column(nullable = false)
    @Builder.Default
    Integer quantity = 1;

    @Column(nullable = false)
    BigDecimal price; // Đơn giá gốc

    @Column(name = "discounted_price")
    BigDecimal discountedPrice; // Đơn giá thực bán sau giảm giá

    // --- HELPER METHOD ---
    /**
     * Tính tổng tiền của món hàng (Đơn giá thực bán * Số lượng)
     */
    public BigDecimal getItemSubtotal() {
        BigDecimal finalPrice = (discountedPrice != null) ? discountedPrice : price;
        return finalPrice.multiply(BigDecimal.valueOf(quantity));
    }
}