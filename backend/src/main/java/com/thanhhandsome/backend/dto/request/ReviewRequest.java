package com.thanhhandsome.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {

    @NotBlank(message = "ID sản phẩm không được để trống")
    String productId;

    String storeId;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = 1, message = "Điểm tối thiểu là 1")
    @Max(value = 5, message = "Điểm tối đa là 5")
    Double rating;

    String title;

    @NotBlank(message = "Nội dung nhận xét không được để trống")
    String comment;
}
