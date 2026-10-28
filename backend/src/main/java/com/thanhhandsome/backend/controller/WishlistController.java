package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.WishlistRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.WishlistResponse;
import com.thanhhandsome.backend.service.WishlistService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class WishlistController {

    WishlistService wishlistService;

    // GET /wishlist -> Lấy danh sách yêu thích
    @GetMapping
    public ApiResponse<List<WishlistResponse>> getWishlist() {
        return ApiResponse.<List<WishlistResponse>>builder()
                .message("Lấy danh sách yêu thích thành công")
                .result(wishlistService.getWishlist())
                .build();
    }

    // POST /wishlist/items -> Thêm sản phẩm vào yêu thích
    @PostMapping("/items")
    public ApiResponse<List<WishlistResponse>> addToWishlist(@RequestBody @Valid WishlistRequest request) {
        return ApiResponse.<List<WishlistResponse>>builder()
                .message("Thêm vào danh sách yêu thích thành công")
                .result(wishlistService.addToWishlist(request))
                .build();
    }

    // DELETE /wishlist/items/{productId} -> Xóa 1 sản phẩm khỏi yêu thích
    @DeleteMapping("/items/{productId}")
    public ApiResponse<List<WishlistResponse>> removeFromWishlist(@PathVariable String productId) {
        return ApiResponse.<List<WishlistResponse>>builder()
                .message("Xóa khỏi danh sách yêu thích thành công")
                .result(wishlistService.removeFromWishlist(productId))
                .build();
    }

    // DELETE /wishlist -> Xóa toàn bộ
    @DeleteMapping
    public ApiResponse<Void> clearWishlist() {
        wishlistService.clearWishlist();
        return ApiResponse.<Void>builder()
                .message("Làm trống danh sách yêu thích thành công")
                .build();
    }
}
