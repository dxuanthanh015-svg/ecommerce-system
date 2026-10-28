package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MostViewedCacheService {

    static final String CACHE_KEY = "mostviewed:products";
    static final Duration TTL = Duration.ofMinutes(30); // Ngắn hơn trending vì view thay đổi nhanh

    RedisTemplate<String, Object> redisTemplate;
    ProductRepository productRepository;
    ProductMapper productMapper;

    @SuppressWarnings("unchecked")
    public List<ProductResponse> getMostViewedProducts(int limit) {
        // Cache HIT
        try {
            Object cached = redisTemplate.opsForValue().get(CACHE_KEY);
            if (cached instanceof List<?> list && !list.isEmpty()) {
                log.info("[MostViewed] Cache HIT - {} sản phẩm từ Redis", list.size());
                return (List<ProductResponse>) list;
            }
        } catch (Exception e) {
            log.warn("[MostViewed] Redis lỗi, fallback DB: {}", e.getMessage());
        }

        // Cache MISS => Query DB
        log.info("[MostViewed] Cache MISS - query DB...");
        Pageable pageable = PageRequest.of(0, limit);
        List<ProductResponse> result = productRepository
                .findByIsActiveTrueOrderByViewsCountDesc(pageable)
                .stream()
                .map(productMapper::toProductResponse)
                .toList();

        // Fallback nếu chưa có lượt xem nào
        if (result.isEmpty()) {
            result = productRepository
                    .findByIsActiveTrueOrderByCreatedAtDesc(pageable)
                    .stream()
                    .map(productMapper::toProductResponse)
                    .toList();
        }

        // Lưu Redis
        try {
            redisTemplate.opsForValue().set(CACHE_KEY, result, TTL);
        } catch (Exception e) {
            log.warn("[MostViewed] Không lưu được Redis: {}", e.getMessage());
        }
        return result;
    }

    public void evictCache() {
        redisTemplate.delete(CACHE_KEY);
    }
}
