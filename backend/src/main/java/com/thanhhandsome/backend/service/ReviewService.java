package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ReviewRequest;
import com.thanhhandsome.backend.dto.response.ReviewResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.Review;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.ReviewMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.ReviewRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {

    ReviewRepository reviewRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ReviewMapper reviewMapper;

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(String productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviewMapper.toReviewResponseList(reviews);
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle() != null && !request.getTitle().isBlank()
                        ? request.getTitle().trim()
                        : "Đánh giá sản phẩm")
                .comment(request.getComment().trim())
                .likesCount(0)
                // A review is not verified unless an order is actually matched.
                .isVerifiedPurchase(false)
                .build();

        Review saved = reviewRepository.save(review);

        // Cập nhật rating và reviewCount cho Product
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
        double avgRating = allReviews.stream().mapToDouble(Review::getRating).average().orElse(request.getRating());
        product.setRating(Math.round(avgRating * 10.0) / 10.0);
        product.setReviewCount(allReviews.size());
        productRepository.save(product);

        return reviewMapper.toReviewResponse(saved);
    }
}
