package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "flash_sale_items", indexes = {
        @Index(name = "idx_fsi_flash_sale_id", columnList = "flash_sale_id"),
        @Index(name = "idx_fsi_product_id", columnList = "product_id")
})
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder

public class FlashSaleItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_sale_id",  nullable = false)
    FlashSale flashSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id",  nullable = false)
    Product product;

    @Column(name = "sale_price", nullable = false)
    BigDecimal salePrice;

    @Column(name = "discount_percent", nullable = false)
    Integer discountPercent;

    @Column(name = "stock_limit", nullable = false)
    Integer stockLimit;

    @Column(name = "sold_count", nullable = false)
    @Builder.Default
    Integer soldCount = 0;

}
