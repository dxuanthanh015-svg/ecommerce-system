package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_variants", indexes = {
        @Index(name = "idx_variant_product_id", columnList = "product_id")
})

public class ProductVariant extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @Column(name = "size_name", length = 10)
    String sizeName;

    @Column(name = "color_name", length = 50)
    String colorName;

    @Column(name = "color_code", length = 30)
    String colorCode;

    @Column(nullable = false)
    @Builder.Default
    Integer quantity = 0;
}
