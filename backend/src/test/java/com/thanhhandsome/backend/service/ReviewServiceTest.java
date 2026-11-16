package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ReviewRequest;
import com.thanhhandsome.backend.dto.response.ReviewResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.Review;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.mapper.ReviewMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.ReviewRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {
    @Mock ReviewRepository reviewRepository;
    @Mock ProductRepository productRepository;
    @Mock UserRepository userRepository;
    @Mock ReviewMapper reviewMapper;
    @InjectMocks ReviewService reviewService;

    @AfterEach
    void clearSecurityContext() { SecurityContextHolder.clearContext(); }

    @Test
    void createReviewAssociatesProductAndUpdatesProductRating() {
        User user = User.builder().email("buyer@example.test").build();
        user.setId("buyer-1");
        Product product = Product.builder().title("Shirt").build();
        product.setId("product-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(user));
        when(productRepository.findById("product-1")).thenReturn(Optional.of(product));
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(reviewRepository.findByProductIdOrderByCreatedAtDesc("product-1"))
                .thenAnswer(invocation -> List.of(Review.builder().rating(4.0).build(), Review.builder().rating(2.0).build()));
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(ReviewResponse.builder().build());

        reviewService.createReview(ReviewRequest.builder().productId("product-1").rating(4.0)
                .title("  Nice  ").comment("Good quality").build());

        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).save(reviewCaptor.capture());
        Review savedReview = reviewCaptor.getValue();
        assertSame(product, savedReview.getProduct());
        assertSame(user, savedReview.getUser());
        assertNull(savedReview.getOrder());
        assertEquals("Nice", savedReview.getTitle());
        assertFalse(savedReview.getIsVerifiedPurchase());
        assertEquals(3.0, product.getRating());
        assertEquals(2, product.getReviewCount());
        verify(productRepository).save(product);
    }

    @Test
    void createReviewRejectsUnknownProduct() {
        User user = User.builder().email("buyer@example.test").build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(user));
        when(productRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> reviewService.createReview(
                ReviewRequest.builder().productId("missing").rating(5.0).comment("Review").build()));
        verifyNoInteractions(reviewRepository);
    }
}
