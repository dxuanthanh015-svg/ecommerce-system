package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.OrderItemRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.function.Function;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TrendingCacheService {
    ProductRepository productRepository;
    OrderItemRepository orderItemRepository;
    ProductMapper productMapper;


    static final String CACHE_KEY = "trending:products:v5";
    static final String PREVIOUS_CACHE_KEY = "trending:products:v4";
    static final String LEGACY_CACHE_KEY = "trending:products:v3";
    static final int CACHE_LIMIT = 50;
    static final Duration TTL = Duration.ofMinutes(5);

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
        // Remove the old manually flagged trending cache after switching to delivered sales.
        try {
            redisTemplate.delete(PREVIOUS_CACHE_KEY);
            redisTemplate.delete(LEGACY_CACHE_KEY);
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
        var sales = orderItemRepository.findTopDeliveredPaidSales(
                PaymentStatus.PAID, OrderStatus.DELIVERED, PageRequest.of(0, limit));
        if (sales.isEmpty()) return List.of();

        List<String> productIds = sales.stream().map(OrderItemRepository.ProductQuantitySold::getProductId).toList();
        Map<String, Product> activeProducts = productRepository.findAllById(productIds).stream()
                .filter(product -> Boolean.TRUE.equals(product.getIsActive()))
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // Keep the sales query's order; findAllById does not guarantee input ordering.
        return sales.stream()
                .map(row -> {
                    Product product = activeProducts.get(row.getProductId());
                    if (product == null) return null;
                    ProductResponse response = productMapper.toProductResponse(product);
                    response.setSoldCount(row.getQuantitySold());
                    return response;
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }
    // Gọi khi doanh số đủ điều kiện hoặc danh sách sản phẩm active thay đổi.
    public void evictCache() {
        try {
            redisTemplate.delete(CACHE_KEY);
            redisTemplate.delete(PREVIOUS_CACHE_KEY);
            redisTemplate.delete(LEGACY_CACHE_KEY);
            log.info("[Trending] Cache đã bị xóa (invalidated)");
        } catch (Exception e) {
            log.warn("[Trending] Không xóa được Redis cache: {}", e.getMessage());
        }
    }
}
