package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "products", indexes = {
        @Index(name = "idx_product_store_id", columnList = "store_id"),
        @Index(name = "idx_product_category_id", columnList = "category_id"),
        @Index(name = "idx_product_brand", columnList = "brand"),
        @Index(name = "idx_product_price", columnList = "price"),
        @Index(name = "idx_product_rating", columnList = "rating")
})
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    Category category;

    @Column(nullable = false, length = 255)
    String title;

    @Column(nullable = false, unique = true, length = 255)
    String slug;

    @Column(length = 100)
    String brand;

    @Column(nullable = false)
    BigDecimal price;

    @Column(name = "discounted_price")
    BigDecimal discountedPrice;

    @Column(name = "discount_percent")
    @Builder.Default
    Integer discountPercent = 0;

    @Column(nullable = false)
    @Builder.Default
    Integer quantity = 0; // Tổng tồn kho (hoặc tổng của các Variant)

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    String imageUrl; // URL hoặc data URL Base64 của ảnh đại diện

    @Column(name = "image_s3_key", length = 500)
    String imageS3Key;

    // Album ảnh chi tiết dạng JSON
    @Column(name = "images", columnDefinition = "JSON")
    @Convert(converter = StringListConverter.class)
    @Builder.Default
    List<String> images = new ArrayList<>();

    // Bài viết mô tả chi tiết (Gộp từ ProductDetail)
    @Column(name = "description", columnDefinition = "LONGTEXT")
    String description;

    @Column(name = "rating")
    @Builder.Default
    Double rating = 0.0;

    @Column(name = "review_count")
    @Builder.Default
    Integer reviewCount = 0;

    @Column(name = "views_count")
    @Builder.Default
    Long viewsCount = 0L;

    @Column(name = "last_viewed_at")
    LocalDateTime lastViewedAt;

    @Column(name = "is_active")
    @Builder.Default
    Boolean isActive = true;

    @Column(name = "is_trending", nullable = false)
    @Builder.Default
    Boolean isTrending = false;

    @Column(name = "is_flash_sale", nullable = false)
    @Builder.Default
    Boolean isFlashSale = false;

    // Quản lý biến thể (Size, Color, SKU)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<ProductVariant> variants = new ArrayList<>();

    // Danh sách các lần sản phẩm này tham gia Flash Sale
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    List<FlashSaleItem> flashSaleItems = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade =  CascadeType.ALL)
    @Builder.Default
    List<Review>  reviews = new ArrayList<>();


    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }

    public void addFlashSaleItem(FlashSaleItem flashSaleItem) {
        flashSaleItems.add(flashSaleItem);
        flashSaleItem.setProduct(this);
    }

    public void removeFlashSaleItem(FlashSaleItem flashSaleItem) {
        flashSaleItems.remove(flashSaleItem);
        flashSaleItem.setProduct(null);
    }

}
