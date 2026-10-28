package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.response.ReviewResponse;
import com.thanhhandsome.backend.entity.Review;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface ReviewMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "authorName", expression = "java(authorName(review))")
    @Mapping(target = "authorAvatar", source = "user.avatarUrl")
    ReviewResponse toReviewResponse(Review review);

    List<ReviewResponse> toReviewResponseList(List<Review> reviews);

    default String authorName(Review review) {
        if (review == null || review.getUser() == null) {
            return "Ẩn danh";
        }

        String firstName = review.getUser().getFirstName() == null ? "" : review.getUser().getFirstName().trim();
        String lastName = review.getUser().getLastName() == null ? "" : review.getUser().getLastName().trim();
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Ẩn danh" : fullName;
    }
}
