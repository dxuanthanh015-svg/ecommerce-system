package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ProductRequest;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock ProductRepository productRepository;
    @Mock ProductMapper productMapper;
    @Mock StoreRepository storeRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock MostViewedCacheService mostViewedCacheService;
    @Mock TrendingCacheService trendingCacheService;
    @Mock ReviewRepository reviewRepository;
    @Mock OrderItemRepository orderItemRepository;
    @InjectMocks ProductService productService;

    @AfterEach
    void clearSecurityContext() { SecurityContextHolder.clearContext(); }

    @Test
    void createProductRejectsNegativePriceBeforeRepositoryWork() {
        ProductRequest request = ProductRequest.builder().price(new BigDecimal("-1")).discountedPrice(null).build();

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(request));
        verifyNoInteractions(storeRepository, categoryRepository, productMapper, productRepository, trendingCacheService);
    }

    @Test
    void createProductRejectsDiscountGreaterThanOriginalPrice() {
        ProductRequest request = ProductRequest.builder().price(new BigDecimal("100"))
                .discountedPrice(new BigDecimal("101")).build();

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(request));
        verifyNoInteractions(storeRepository, categoryRepository, productMapper, productRepository);
    }

    @Test
    void updateProductRejectsUnknownProduct() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("seller-1", "", List.of()));
        Store store = Store.builder().name("Store").build();
        store.setId("store-1");
        when(storeRepository.findByOwnerId("seller-1")).thenReturn(Optional.of(store));
        when(productRepository.findById("missing-product")).thenReturn(Optional.empty());
        ProductRequest request = ProductRequest.builder().price(new BigDecimal("50000")).build();

        assertThrows(RuntimeException.class, () -> productService.updateProduct("missing-product", request));
        verify(productRepository, never()).save(any(Product.class));
        verifyNoInteractions(trendingCacheService);
    }

    @Test
    void getProductsPassesRequestedPageToRepository() {
        var pageable = PageRequest.of(2, 7);
        when(productRepository.findAll(org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Product>>any(),
                eq(pageable))).thenReturn(new PageImpl<>(List.of(), pageable, 0));

        var page = productService.getProducts("shirt", "cat-1", "store-1", BigDecimal.ZERO,
                new BigDecimal("500000"), 4.0, pageable);

        assertEquals(2, page.getNumber());
        assertEquals(7, page.getSize());
        verify(productRepository).findAll(org.mockito.ArgumentMatchers.<org.springframework.data.jpa.domain.Specification<Product>>any(),
                eq(pageable));
    }
}
