package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_product_id", columnList = "product_id"),
        @Index(name = "idx_review_user_id", columnList = "user_id")
})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class Review extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @Column(nullable = false)
    Double rating;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT",nullable = false)
    String comment;

    @Column(name = "likes_count")
    @Builder.Default
    Integer likesCount = 0;

    @Column(name = "is_verified_purchase")
    @Builder.Default
    Boolean isVerifiedPurchase = false;

}
