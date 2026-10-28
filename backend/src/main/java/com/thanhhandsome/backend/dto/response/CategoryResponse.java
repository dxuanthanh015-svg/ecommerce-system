package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    String id;
    String name;
    String slug;
    int level;
    String imageUrl;
    String parentId;
    BigDecimal commissionRate;
    Boolean active;
    List<CategoryResponse> subCategories;
}
