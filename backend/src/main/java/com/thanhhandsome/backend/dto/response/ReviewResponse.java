package com.thanhhandsome.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    String id;
    String productId;
    String userId;
    String authorName;
    String authorAvatar;
    Double rating;
    String title;
    String comment;
    Integer likesCount;
    Boolean isVerifiedPurchase;
    LocalDateTime createdAt;

    @JsonProperty("date")
    public LocalDateTime getDate() {
        return createdAt;
    }
}
