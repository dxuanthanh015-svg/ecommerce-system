package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishListRepository extends JpaRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);
    boolean existsByUserIdAndProductId(String userId, String productId);
    void deleteByUserIdAndProductId(String userId, String productId);
    void deleteByUserId(String userId);
}
