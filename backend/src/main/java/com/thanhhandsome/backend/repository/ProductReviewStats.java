package com.thanhhandsome.backend.repository;

public interface ProductReviewStats {
    String getProductId();
    Double getAverageRating();
    Long getReviewCount();
}
