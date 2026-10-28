package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.request.ProductRequest;
import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.entity.Category;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.ProductVariant;
import com.thanhhandsome.backend.entity.Store;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface ProductMapper {

    @Mapping(target = "store", source = "store")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "variants", source = "variants")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);

    ProductResponse.StoreInfo toStoreInfo(Store store);
    ProductResponse.CategoryInfo toCategoryInfo(Category category);
    ProductResponse.VariantResponse toVariantResponse(ProductVariant variant);
    List<ProductResponse.VariantResponse> toVariantResponseList(List<ProductVariant> variants);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "viewsCount", ignore = true)
    @Mapping(target = "lastViewedAt", ignore = true)
    @Mapping(target = "flashSaleItems", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "slug", ignore = true)
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);
}
