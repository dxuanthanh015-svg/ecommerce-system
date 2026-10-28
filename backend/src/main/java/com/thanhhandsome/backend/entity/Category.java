package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "categories", indexes = {@Index(name = "idx_category_level", columnList = "level"),@Index(name = "idx_category_parent_id", columnList = "parent_id")})

public class Category extends BaseEntity{
    @Column(length = 100, nullable = false)
    String name;

    @Column(length = 100, nullable = false, unique = true)
    String slug;

    @Column(nullable = false)
    int level;

    @Column(name = "image_url", length = 500)
    String imageUrl;

    @Column(name = "image_s3_key", length = 500)
    String imageS3Key;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    BigDecimal commissionRate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    Boolean active = true;

    // Danh mục cha
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    Category parentCategory;

    // Danh mục con
    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    @Builder.Default
    List<Category> subCategories = new ArrayList<>();

    public void addSubCategory(Category subCategory) {
        subCategories.add(subCategory);
        subCategory.setParentCategory(this);
    }

    public void removeSubCategory(Category subCategory) {
        subCategories.remove(subCategory);
        subCategory.setParentCategory(null);
    }

}
