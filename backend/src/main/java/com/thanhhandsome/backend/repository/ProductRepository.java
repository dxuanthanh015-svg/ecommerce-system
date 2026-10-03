package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,String> {
    List<Product> findByStoreId(String storeId);
    List<Product> findByCategoryId(String categoryId);
    Optional<Product> findBySlug(String slug);
}


