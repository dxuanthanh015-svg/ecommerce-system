package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items", indexes = {
        @Index(name = "idx_cart_item_cart_id", columnList = "cart_id"),
        @Index(name = "idx_cart_item_product_id", columnList = "product_id"),
        @Index(name = "idx_cart_item_variant_id", columnList = "product_variant_id")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder

public class CartItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    ProductVariant productVariant;

    @Column(name = "size", length = 50)
    String size;

    @Column(name = "color", length = 50)
    String color;

    @Column(nullable = false)
    @Builder.Default
    Integer quantity = 1;

    @Column(nullable = false)
    BigDecimal price;

    @Column(name = "discounted_price")
    BigDecimal discountedPrice;
}
