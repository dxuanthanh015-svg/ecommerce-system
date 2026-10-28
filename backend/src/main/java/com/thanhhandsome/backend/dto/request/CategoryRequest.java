package com.thanhhandsome.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CategoryRequest {
    @NotBlank
    private String name;
    private String slug;
    private String parentId;
    private BigDecimal commissionRate;
    private Boolean active;
    private String imageUrl;
}
