package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts", indexes = {
        @Index(name = "idx_cart_user_id", columnList = "user_id")
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter

public class Cart extends BaseEntity{
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<CartItem> items = new ArrayList<>();

    @Column(name = "total_price")
    @Builder.Default
    BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(name = "total_discounted_price")
    @Builder.Default
    BigDecimal totalDiscountedPrice = BigDecimal.ZERO;

    @Column(name = "discount")
    @Builder.Default
    BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "total_item")
    @Builder.Default
    Integer totalItem = 0;

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

}
