package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.WishlistResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.mapper.WishlistMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.WishListRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {
    @Mock WishListRepository wishListRepository;
    @Mock ProductRepository productRepository;
    @Mock UserRepository userRepository;
    @Mock WishlistMapper wishlistMapper;
    @InjectMocks WishlistService wishlistService;

    @AfterEach
    void clearSecurityContext() { SecurityContextHolder.clearContext(); }

    @Test
    void addingExistingWishlistProductDoesNotCreateDuplicate() {
        User user = User.builder().email("buyer@example.test").build();
        user.setId("buyer-1");
        Product product = Product.builder().title("Shirt").build();
        product.setId("product-1");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(user));
        when(productRepository.findById("product-1")).thenReturn(Optional.of(product));
        when(wishListRepository.existsByUserIdAndProductId("buyer-1", "product-1")).thenReturn(true);
        when(wishListRepository.findByUserId("buyer-1")).thenReturn(List.of());
        when(wishlistMapper.toWishlistItemResponseList(List.of())).thenReturn(List.of());

        wishlistService.addToWishlist(new com.thanhhandsome.backend.dto.request.WishlistRequest("product-1"));

        verify(wishListRepository, never()).save(any());
        verify(wishListRepository).findByUserId("buyer-1");
    }

    @Test
    void addingUnknownProductIsRejected() {
        User user = User.builder().email("buyer@example.test").build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("buyer-1", "", List.of()));
        when(userRepository.findById("buyer-1")).thenReturn(Optional.of(user));
        when(productRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> wishlistService.addToWishlist(
                new com.thanhhandsome.backend.dto.request.WishlistRequest("missing")));
        verifyNoInteractions(wishListRepository);
    }
}
