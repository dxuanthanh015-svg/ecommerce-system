package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TrendingCacheService {
    ProductRepository productRepository;
    ProductMapper productMapper;


    String CACHE_KEY = "trending:products:v4";
    int CACHE_LIMIT = 50;
    Duration TTL = Duration.ofMinutes(5);

    RedisTemplate<String, Object> redisTemplate;

    @SuppressWarnings("unchecked")
    public List<ProductResponse> getTrendingProducts(int limit){
        int safeLimit = Math.max(1, Math.min(limit, CACHE_LIMIT));
        try{
            Object cached = redisTemplate.opsForValue().get(CACHE_KEY);
            if(cached instanceof List<?> list && !list.isEmpty()){
                log.info("[Trending] Cache HIT - Redis có {} sản phẩm trending", list.size());
                return ((List<ProductResponse>) list).stream().limit(safeLimit).toList();
            }

        }catch (Exception e) {
            log.warn("[Trending] Không đọc được Redis cache, fallback về DB: {}", e.getMessage());
        }

        log.info("[Trending] cache MISS - query DB ...");
        // Remove the previous cache version, which may contain non-trending fallback products.
        try {
            redisTemplate.delete("trending:products:v3");
        } catch (Exception e) {
            log.warn("[Trending] Không xóa được cache phiên bản cũ: {}", e.getMessage());
        }
        List<ProductResponse> result = queryFromDB(CACHE_LIMIT);
        try {
            redisTemplate.opsForValue().set(CACHE_KEY, result, TTL);
            log.info("[Trending] Đã cache {} sản phẩm trending vào Redis (TTL={})", result.size(), TTL);
        } catch (Exception e) {
            log.warn("[Trending] Không lưu được Redis cache: {}", e.getMessage());
        }
        return result.stream().limit(safeLimit).toList();
    }

    private List<ProductResponse> queryFromDB(int limit) {
        return productRepository
                .findByIsActiveTrueAndIsTrendingTrueOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }
    // Gọi khi có đơn hàng mới → invalidate cache
    public void evictCache() {
        try {
            redisTemplate.delete(CACHE_KEY);
            log.info("[Trending] Cache đã bị xóa (invalidated)");
        } catch (Exception e) {
            log.warn("[Trending] Không xóa được Redis cache: {}", e.getMessage());
        }
    }
}
