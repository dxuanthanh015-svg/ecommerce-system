package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.ReviewRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.ReviewResponse;
import com.thanhhandsome.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ReviewController {

    ReviewService reviewService;

    // GET /reviews?productId= -> Lấy đánh giá sản phẩm (Public)
    @GetMapping
    public ApiResponse<List<ReviewResponse>> getReviews(@RequestParam String productId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Lấy danh sách đánh giá thành công")
                .result(reviewService.getReviewsByProduct(productId))
                .build();
    }

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody @Valid ReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .message("Đăng đánh giá thành công")
                .result(reviewService.createReview(request))
                .build();
    }
}
