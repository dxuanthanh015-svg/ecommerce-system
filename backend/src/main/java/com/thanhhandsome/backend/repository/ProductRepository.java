package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,String>, JpaSpecificationExecutor<Product> {
    List<Product> findByStoreId(String storeId);
    List<Product> findByStoreIdAndIsActiveTrue(String storeId);
    long countByStoreIdAndIsActiveTrue(String storeId);
    List<Product> findByCategoryId(String categoryId);
    Optional<Product> findBySlug(String slug);
    Page<Product> findByStoreId(String storeId, Pageable pageable);
    List<Product> findTop5ByIsActiveTrueOrderByCreatedAtDesc();
    List<Product> findByIsActiveTrueAndIsTrendingTrueOrderByCreatedAtDesc(Pageable pageable);
    List<Product> findByIsActiveTrueAndIsTrendingTrueOrderByViewsCountDesc(Pageable pageable);
    boolean existsBySlug(String slug);
    long countByIsActiveTrue();
    List<Product> findByIsActiveTrueOrderByViewsCountDesc(Pageable pageable);
    List<Product> findByIsActiveTrueAndViewsCountGreaterThanOrderByViewsCountDesc(Long viewsCount, Pageable pageable);

    List<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
}


