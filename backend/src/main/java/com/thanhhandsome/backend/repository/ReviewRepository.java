package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Collection;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    Long countByProductId(String productId);

    @Query("select avg(r.rating) from Review r where r.product.store.id = :storeId")
    Double findAverageRatingByStoreId(@Param("storeId") String storeId);

    @Query("select count(r) from Review r where r.product.store.id = :storeId")
    Long countByStoreId(@Param("storeId") String storeId);

    @Query("select r.product.id as productId, avg(r.rating) as averageRating, count(r) as reviewCount " +
            "from Review r where r.product.id in :productIds group by r.product.id")
    List<ProductReviewStats> findProductReviewStats(@Param("productIds") Collection<String> productIds);
}
