package com.thanhhandsome.backend.controller;


import com.thanhhandsome.backend.dto.request.CartItemRequest;
import com.thanhhandsome.backend.dto.request.CartRequest;
import com.thanhhandsome.backend.dto.request.UpdateCartItemRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.CartResponse;
import com.thanhhandsome.backend.entity.Cart;
import com.thanhhandsome.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CartController {
    CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(){
        return ApiResponse.<CartResponse>builder()
                .message("Lấy giỏ hàng thành công")
                .result(cartService.getCart())
                .build();
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> postCart(@RequestBody CartItemRequest cartItemRequest){
        return ApiResponse.<CartResponse>builder()
                .message("Thêm sản phẩm vào giỏ hàng thành công")
                .result(cartService.addToCart(cartItemRequest))
                .build();
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateCartItem(
            @PathVariable String itemId,
            @RequestBody @Valid UpdateCartItemRequest request
    ) {
        return ApiResponse.<CartResponse>builder()
                .message("Cập nhật giỏ hàng thành công")
                .result(cartService.updateCartItem(itemId, request))
                .build();
    }
    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeFromCart(@PathVariable String itemId) {
        return ApiResponse.<CartResponse>builder()
                .message("Xóa sản phẩm khỏi giỏ hàng thành công")
                .result(cartService.removeFromCart(itemId))
                .build();
    }
    @DeleteMapping
    public ApiResponse<Void> clearCart() {
        cartService.clearCart();
        return ApiResponse.<Void>builder()
                .message("Làm trống giỏ hàng thành công")
                .build();
    }

    @PostMapping("/migrate")
    public ApiResponse<CartResponse> migrateCart(@RequestBody CartRequest request) {
        return ApiResponse.<CartResponse>builder()
                .message("Đồng bộ giỏ hàng thành công")
                .result(cartService.migrateCart(request.getItems()))
                .build();
    }


}
