package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.WishlistRequest;
import com.thanhhandsome.backend.dto.response.WishlistResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.entity.Wishlist;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.WishlistMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.WishListRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishlistService {

    WishListRepository wishListRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    WishlistMapper wishlistMapper;

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist() {
        User user = getCurrentUser();
        List<Wishlist> list = wishListRepository.findByUserId(user.getId());
        return wishlistMapper.toWishlistItemResponseList(list);
    }

    @Transactional
    public List<WishlistResponse> addToWishlist(WishlistRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!wishListRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishListRepository.save(wishlist);
        }
        return getWishlist();
    }

    @Transactional
    public List<WishlistResponse> removeFromWishlist(String productId) {
        User user = getCurrentUser();
        wishListRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return getWishlist();
    }

    @Transactional
    public void clearWishlist() {
        User user = getCurrentUser();
        wishListRepository.deleteByUserId(user.getId());
    }
}
