package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "wishlist",  indexes = {
        @Index(name = "idx_wishlist_user_id", columnList = "user_id"),
        @Index(name = "idx_wishlist_product_id", columnList = "product_id")
},
    uniqueConstraints = {@UniqueConstraint(name = "uk_wishlist_user_product", columnNames = {"user_id", "product_id"})}
)

public class Wishlist extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",  nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;


}
