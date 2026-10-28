package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository  extends JpaRepository<CartItem,String> {
    Optional<CartItem> findByCartIdAndProductIdAndSizeAndColor(
            String cartId, String productId, String size, String color
    );
}
