package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.response.CartItemResponse;
import com.thanhhandsome.backend.dto.response.CartResponse;
import com.thanhhandsome.backend.entity.Cart;
import com.thanhhandsome.backend.entity.CartItem;
import com.thanhhandsome.backend.entity.Product;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface CartMapper {

    @Mapping(target = "items", source = "items")
    CartResponse toCartResponse(Cart cart);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "title", source = "product.title")
    @Mapping(target = "brand", source = "product.brand")
    @Mapping(target = "storeId", source = "product.store.id")
    @Mapping(target = "imageUrl", source = "product", qualifiedByName = "resolveImageUrl")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    List<CartItemResponse> toCartItemResponseList(List<CartItem> items);

    @Named("resolveImageUrl")
    default String resolveImageUrl(Product product) {
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
