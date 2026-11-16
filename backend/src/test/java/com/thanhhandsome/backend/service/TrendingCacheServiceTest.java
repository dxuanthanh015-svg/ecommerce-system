package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.OrderItemRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrendingCacheServiceTest {
    @Mock ProductRepository productRepository;
    @Mock OrderItemRepository orderItemRepository;
    @Mock ProductMapper productMapper;
    @Mock RedisTemplate<String, Object> redisTemplate;
    @Mock ValueOperations<String, Object> valueOperations;
    @InjectMocks TrendingCacheService cacheService;

    @Test
    void cacheHitRespectsRequestLimit() {
        ProductResponse first = ProductResponse.builder().id("p1").build();
        ProductResponse second = ProductResponse.builder().id("p2").build();
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("trending:products:v5")).thenReturn(List.of(first, second));

        var result = cacheService.getTrendingProducts(1);

        assertEquals(List.of(first), result);
        verifyNoInteractions(orderItemRepository, productRepository, productMapper);
    }

    @Test
    void cacheMissBuildsTrendingFromPaidDeliveredSales() {
        Product product = Product.builder().title("Sold product").isActive(true).build();
        product.setId("p1");
        ProductResponse response = ProductResponse.builder().id("p1").build();
        OrderItemRepository.ProductQuantitySold sales = mock(OrderItemRepository.ProductQuantitySold.class);
        when(sales.getProductId()).thenReturn("p1");
        when(sales.getQuantitySold()).thenReturn(3L);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("trending:products:v5")).thenReturn(null);
        when(orderItemRepository.findTopDeliveredPaidSales(eq(PaymentStatus.PAID), eq(OrderStatus.DELIVERED), any(Pageable.class)))
                .thenReturn(List.of(sales));
        when(productRepository.findAllById(List.of("p1"))).thenReturn(List.of(product));
        when(productMapper.toProductResponse(product)).thenReturn(response);

        var result = cacheService.getTrendingProducts(5);

        assertEquals(1, result.size());
        assertEquals(3L, result.get(0).getSoldCount());
        verify(orderItemRepository).findTopDeliveredPaidSales(eq(PaymentStatus.PAID), eq(OrderStatus.DELIVERED), any(Pageable.class));
        verify(redisTemplate).delete("trending:products:v4");
        verify(redisTemplate).delete("trending:products:v3");
    }
}
