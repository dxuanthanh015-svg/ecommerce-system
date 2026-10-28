package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.response.WishlistResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.Wishlist;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface WishlistMapper {

    @Mapping(target = "id", source = "product.id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "title", source = "product.title")
    @Mapping(target = "brand", source = "product.brand")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "discountedPrice", source = "product.discountedPrice")
    @Mapping(target = "storeId", source = "product.store.id")
    @Mapping(target = "category", source = "product.category.name")
    @Mapping(target = "imageUrl", source = "product", qualifiedByName = "resolveProductImageUrl")
    WishlistResponse toWishlistItemResponse(Wishlist wishlist);

    List<WishlistResponse> toWishlistItemResponseList(List<Wishlist> wishlists);

    @Named("resolveProductImageUrl")
    default String resolveProductImageUrl(Product product) {
        if (product == null) return "";
        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            return product.getImageUrl();
        }
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            return product.getImages().get(0);
        }
        return "";
    }
}
