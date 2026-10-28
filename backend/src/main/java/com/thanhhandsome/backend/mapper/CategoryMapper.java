package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.response.CategoryResponse;
import com.thanhhandsome.backend.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "parentId", source = "parentCategory.id")
    CategoryResponse toCategoryResponse(Category category);
}
