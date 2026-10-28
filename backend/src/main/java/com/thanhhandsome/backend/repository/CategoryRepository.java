package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    Optional<Category> findByNameAndLevel(String name, int level);
    Optional<Category> findByNameAndParentCategory(String name, Category parentCategory);
    List<Category> findByParentCategoryIsNull();
    List<Category> findByLevel(int level);
}
