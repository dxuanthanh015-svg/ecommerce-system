package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MostViewedCacheServiceTest {
    @Mock RedisTemplate<String, Object> redisTemplate;
    @Mock ValueOperations<String, Object> valueOperations;
    @Mock ProductRepository productRepository;
    @Mock ProductMapper productMapper;
    @InjectMocks MostViewedCacheService cacheService;

    @Test
    void cacheHitReturnsAtMostRequestedLimitWithoutDatabaseQuery() {
        ProductResponse first = ProductResponse.builder().id("p1").build();
        ProductResponse second = ProductResponse.builder().id("p2").build();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("mostviewed:products:v2")).thenReturn(List.of(first, second));

        var result = cacheService.getMostViewedProducts(1);

        assertEquals(List.of(first), result);
        verifyNoInteractions(productRepository, productMapper);
    }

    @Test
    void cacheMissFallsBackToRecentlyCreatedProductsWhenViewsListIsEmpty() {
        Product product = Product.builder().title("Recent").build();
        ProductResponse response = ProductResponse.builder().id("recent-1").build();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("mostviewed:products:v2")).thenReturn(null);
        when(productRepository.findByIsActiveTrueOrderByViewsCountDesc(any())).thenReturn(List.of());
        when(productRepository.findByIsActiveTrueOrderByCreatedAtDesc(any())).thenReturn(List.of(product));
        when(productMapper.toProductResponse(product)).thenReturn(response);

        var result = cacheService.getMostViewedProducts(5);

        assertEquals(List.of(response), result);
        verify(redisTemplate).delete("mostviewed:products");
        verify(valueOperations).set(eq("mostviewed:products:v2"), eq(List.of(response)), any(java.time.Duration.class));
    }
}
