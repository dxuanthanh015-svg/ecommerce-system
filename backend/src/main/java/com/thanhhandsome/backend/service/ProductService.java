package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ProductRequest;
import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.entity.Category;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.entity.ProductVariant;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.CategoryRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.ProductReviewStats;
import com.thanhhandsome.backend.repository.OrderItemRepository;
import com.thanhhandsome.backend.repository.ReviewRepository;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.specification.ProductSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;
    StoreRepository storeRepository;
    CategoryRepository categoryRepository;
    MostViewedCacheService mostViewedCacheService;
    TrendingCacheService trendingCacheService;
    ReviewRepository reviewRepository;
    OrderItemRepository orderItemRepository;

    private Category resolveCategory(ProductRequest request) {
        // Nếu có categoryId cụ thể thì ưu tiên dùng
        if (StringUtils.hasText(request.getCategoryId())) {
            return categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        }
        String top = StringUtils.hasText(request.getTopLavelCategory()) ? request.getTopLavelCategory().trim() : "General";
        String second = StringUtils.hasText(request.getSecondLavelCategory()) ? request.getSecondLavelCategory().trim() : "All";
        String third = StringUtils.hasText(request.getThirdLavelCategory()) ? request.getThirdLavelCategory().trim() : second;

        Category topCat = categoryRepository.findByNameAndLevel(top, 1).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .name(top)
                        .slug(top.toLowerCase().replaceAll("[^a-z0-9]", "-"))
                        .level(1)
                        .build())
        );

        Category secondCat = categoryRepository.findByNameAndParentCategory(second, topCat).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .name(second)
                        .slug((topCat.getSlug() + "-" + second.toLowerCase()).replaceAll("[^a-z0-9]", "-"))
                        .level(2)
                        .parentCategory(topCat)
                        .build())
        );

        return categoryRepository.findByNameAndParentCategory(third, secondCat).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .name(third)
                        .slug((secondCat.getSlug() + "-" + third.toLowerCase()).replaceAll("[^a-z0-9]", "-"))
                        .level(3)
                        .parentCategory(secondCat)
                        .build())
        );
    }


    // helper lấy store
    private Store getCurrentStore(){
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return storeRepository.findByOwnerId(userId).orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    }

    private void applyVariants(Product product, ProductRequest request){
        String color = StringUtils.hasText(request.getColor()) ? request.getColor() : "Default";
        if(request.getSize() != null && !request.getSize().isEmpty()){
            for(ProductRequest.SizeRequest size : request.getSize()){
                ProductVariant variant = ProductVariant.builder()
                                        .sizeName(size.getName())
                                        .colorName(color)
                                        .quantity(size.getQuantity() != null ? size.getQuantity() : 0)
                                        .build();

                product.addVariant(variant);
            }
        }
        else if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductRequest.VariantRequest vr : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .sizeName(vr.getSizeName())
                        .colorName(StringUtils.hasText(vr.getColorName()) ? vr.getColorName() : color)
                        .colorCode(vr.getColorCode())
                        .quantity(vr.getQuantity() != null ? vr.getQuantity() : 0)
                        .build();
                product.addVariant(variant);

            }
        }
    }

    private String generateSlug(String title) {
        String nonLatin = Pattern.compile("[\\s+]").matcher(title).replaceAll("-");
        String normalized = Normalizer.normalize(nonLatin, Normalizer.Form.NFD);
        String slug = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9-]", "");
        return slug + "-" + UUID.randomUUID().toString().substring(0, 8);
    }


    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(String search, String categoryId, String storeId, BigDecimal minPrice,
                                             BigDecimal maxPrice, Double rating, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.filter(search, categoryId, storeId, minPrice, maxPrice, rating);
        Page<Product> products = productRepository.findAll(spec, pageable);
        Map<String, ProductReviewStats> stats = loadReviewStats(products.getContent());
        return products.map(product -> toResponseWithReviewStats(product, stats.get(product.getId())));
    }

    @Transactional
    public ProductResponse getProductById(String productId) {
        Product product =
                productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setViewsCount(((product.getViewsCount() == null) ? 0L : product.getViewsCount()) + 1);
        product.setLastViewedAt(LocalDateTime.now());
        mostViewedCacheService.evictCache();
        return toResponseWithReviewStats(product, loadReviewStats(List.of(product)).get(product.getId()));
    }

    // Lấy sản phẩm của store hiện tại
    @Transactional(readOnly = true)
    public List<ProductResponse> getMyStoreProducts(){
        Store currentStore = getCurrentStore();
        List<Product> products = productRepository.findByStoreId(currentStore.getId());
        Map<String, ProductReviewStats> stats = loadReviewStats(products);
        return products.stream().map(product -> toResponseWithReviewStats(product, stats.get(product.getId()))).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getPublicStoreProducts(String storeId, String tab, String search) {
        Store store = storeRepository.findById(storeId)
                .filter(candidate -> candidate.getStatus() == com.thanhhandsome.backend.enums.StoreStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        String normalizedTab = StringUtils.hasText(tab) ? tab.trim().toLowerCase(Locale.ROOT) : "all";
        if (!List.of("all", "bestseller", "new", "sale").contains(normalizedTab)) {
            throw new IllegalArgumentException("Bộ lọc cửa hàng không hợp lệ");
        }
        String query = StringUtils.hasText(search) ? search.trim().toLowerCase(Locale.ROOT) : "";

        List<Product> products = productRepository.findByStoreIdAndIsActiveTrue(store.getId()).stream()
                .filter(product -> query.isEmpty() || matchesStoreSearch(product, query))
                .filter(product -> switch (normalizedTab) {
                    case "new" -> product.getCreatedAt() != null &&
                            !product.getCreatedAt().isBefore(LocalDateTime.now().minusDays(30));
                    case "sale" -> Boolean.TRUE.equals(product.getIsFlashSale()) ||
                            (product.getDiscountedPrice() != null && product.getPrice() != null &&
                                    product.getDiscountedPrice().compareTo(product.getPrice()) < 0);
                    default -> true;
                })
                .toList();

        List<String> productIds = products.stream().map(Product::getId).toList();
        Map<String, ProductReviewStats> reviewStats = loadReviewStats(products);
        Map<String, Long> sales = productIds.isEmpty() ? Map.of() :
                orderItemRepository.findDeliveredPaidSalesByProductIds(productIds, PaymentStatus.PAID, OrderStatus.DELIVERED)
                        .stream().collect(Collectors.toMap(
                                OrderItemRepository.ProductQuantitySold::getProductId,
                                OrderItemRepository.ProductQuantitySold::getQuantitySold));

        List<Product> sortedProducts = new ArrayList<>(products);
        if ("bestseller".equals(normalizedTab)) {
            sortedProducts.removeIf(product -> sales.getOrDefault(product.getId(), 0L) <= 0);
            sortedProducts.sort(Comparator
                    .comparingLong((Product product) -> sales.getOrDefault(product.getId(), 0L)).reversed()
                    .thenComparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        } else {
            sortedProducts.sort(Comparator.comparing(Product::getCreatedAt,
                    Comparator.nullsLast(Comparator.reverseOrder())));
        }

        return sortedProducts.stream().map(product -> {
            ProductResponse response = toResponseWithReviewStats(product, reviewStats.get(product.getId()));
            response.setSoldCount(sales.getOrDefault(product.getId(), 0L));
            return response;
        }).toList();
    }

    private boolean matchesStoreSearch(Product product, String query) {
        return contains(product.getTitle(), query)
                || contains(product.getBrand(), query)
                || contains(product.getDescription(), query)
                || (product.getCategory() != null &&
                    (contains(product.getCategory().getName(), query) || contains(product.getCategory().getSlug(), query)));
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    // tạo mới sản phẩm
    @Transactional
    public ProductResponse createProduct(ProductRequest productRequest) {
        validatePricing(productRequest.getPrice(), productRequest.getDiscountedPrice());
        Store currentStore = getCurrentStore();
        Category category = resolveCategory(productRequest);
        Product product = productMapper.toProduct(productRequest);
        product.setCategory(category);
        product.setStore(currentStore);
        product.setSlug(generateSlug(product.getTitle()));
        product.setIsActive(productRequest.getIsActive() != null ? productRequest.getIsActive() : true);
        product.setIsTrending(Boolean.TRUE.equals(productRequest.getIsTrending()));
        product.setIsFlashSale(Boolean.TRUE.equals(productRequest.getIsFlashSale()));
        applyPricing(product, productRequest.getPrice(), productRequest.getDiscountedPrice());
        applyVariants(product, productRequest);
        Product savedProduct = productRepository.save(product);
        trendingCacheService.evictCache();
        return toResponseWithReviewStats(savedProduct, null);
    }

    @Transactional
    public ProductResponse updateProduct(String id, ProductRequest request) {
        validatePricing(request.getPrice(), request.getDiscountedPrice());
        Store currentStore = getCurrentStore();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.getStore().getId().equals(currentStore.getId())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
        }
        Category category = resolveCategory(request);
        productMapper.updateProductFromRequest(request, product);
        applyPricing(product, request.getPrice() != null ? request.getPrice() : product.getPrice(),
                request.getDiscountedPrice());
        if (request.getIsTrending() != null) product.setIsTrending(request.getIsTrending());
        if (request.getIsFlashSale() != null) product.setIsFlashSale(request.getIsFlashSale());
        product.setCategory(category);
        product.getVariants().clear();
        applyVariants(product, request);
        Product savedProduct = productRepository.save(product);
        trendingCacheService.evictCache();
        return toResponseWithReviewStats(savedProduct, loadReviewStats(List.of(savedProduct)).get(savedProduct.getId()));
    }

    private void validatePricing(BigDecimal price, BigDecimal discountedPrice) {
        if (price == null || price.signum() < 0) {
            throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn hoặc bằng 0");
        }
        if (discountedPrice != null && (discountedPrice.signum() < 0
                || discountedPrice.compareTo(price) > 0)) {
            throw new IllegalArgumentException("Giá khuyến mãi phải từ 0 đến giá gốc");
        }
    }

    private void applyPricing(Product product, BigDecimal price, BigDecimal discountedPrice) {
        product.setPrice(price);
        if (discountedPrice == null || discountedPrice.compareTo(price) >= 0) {
            product.setDiscountedPrice(null);
            product.setDiscountPercent(0);
            return;
        }
        product.setDiscountedPrice(discountedPrice);
        product.setDiscountPercent(price.signum() == 0 ? 0
                : price.subtract(discountedPrice).multiply(BigDecimal.valueOf(100))
                    .divide(price, 0, java.math.RoundingMode.HALF_UP).intValue());
    }

    @Transactional
    public ProductResponse toggleVisibility(String id, Boolean isVisible) {
        Store currentStore = getCurrentStore();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.getStore().getId().equals(currentStore.getId())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
        }
        boolean newStatus = (isVisible != null) ? isVisible : !Boolean.TRUE.equals(product.getIsActive());
        product.setIsActive(newStatus);
        Product savedProduct = productRepository.save(product);
        trendingCacheService.evictCache();
        return toResponseWithReviewStats(savedProduct, loadReviewStats(List.of(savedProduct)).get(savedProduct.getId()));
    }

    private Map<String, ProductReviewStats> loadReviewStats(Collection<Product> products) {
        List<String> productIds = products.stream().map(Product::getId).filter(id -> id != null).toList();
        if (productIds.isEmpty()) return Map.of();
        return reviewRepository.findProductReviewStats(productIds).stream()
                .collect(Collectors.toMap(ProductReviewStats::getProductId, Function.identity()));
    }

    private ProductResponse toResponseWithReviewStats(Product product, ProductReviewStats stats) {
        ProductResponse response = productMapper.toProductResponse(product);
        BigDecimal price = product.getPrice();
        BigDecimal discountedPrice = product.getDiscountedPrice();
        int discountPercent = price != null && price.signum() > 0 && discountedPrice != null
                && discountedPrice.compareTo(price) < 0
                ? price.subtract(discountedPrice).multiply(BigDecimal.valueOf(100))
                    .divide(price, 0, java.math.RoundingMode.HALF_UP).intValue()
                : 0;
        response.setDiscountPercent(discountPercent);
        if (stats == null || stats.getAverageRating() == null || stats.getReviewCount() == null) {
            response.setRating(0.0);
            response.setReviewCount(0);
        } else {
            response.setRating(Math.round(stats.getAverageRating() * 10.0) / 10.0);
            response.setReviewCount(Math.toIntExact(stats.getReviewCount()));
        }
        return response;
    }
    @Transactional
    public void deleteProduct(String id) {
        Store currentStore = getCurrentStore();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.getStore().getId().equals(currentStore.getId())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
        }
        productRepository.delete(product);
        trendingCacheService.evictCache();
    }

}
