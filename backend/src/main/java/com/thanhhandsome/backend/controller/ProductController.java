package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.ProductRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.ProductResponse;
import com.thanhhandsome.backend.service.MostViewedCacheService;
import com.thanhhandsome.backend.service.ProductService;
import com.thanhhandsome.backend.service.TrendingCacheService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProductController {

    ProductService productService;

    TrendingCacheService trendingCacheService;

    MostViewedCacheService mostViewedCacheService;

    @GetMapping("/most-viewed")
    public ApiResponse<List<ProductResponse>> getMostViewProducts(@RequestParam(defaultValue = "10") int limit){
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy danh sách các sản phẩm được xem nhiều nhất thành công")
                .result(mostViewedCacheService.getMostViewedProducts(limit))
                .build();
    }

    @GetMapping("/trending")
    public ApiResponse<List<ProductResponse>> getTrendingProducts(@RequestParam(defaultValue = "5") int limit){
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy danh sách sản phẩm trending thành công")
                .result(trendingCacheService.getTrendingProducts(limit))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String storeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortPart = sort.split(",");
        String sortField = sortPart[0].trim();
        Sort.Direction direction = (sortPart.length > 1 && sortPart[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Page<ProductResponse> products = productService.getProducts(search, categoryId, storeId, minPrice, maxPrice, rating, pageable);

        return ApiResponse.<Page<ProductResponse>>builder()
                .message("Lấy danh sách sản phẩm thành công")
                .result(products)
                .build();
    }

    @GetMapping("/store/{storeId}")
    public ApiResponse<List<ProductResponse>> getPublicStoreProducts(
            @PathVariable String storeId,
            @RequestParam(defaultValue = "all") String tab,
            @RequestParam(required = false) String search) {
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy sản phẩm công khai của cửa hàng thành công")
                .result(productService.getPublicStoreProducts(storeId, tab, search))
                .build();
    }


    @GetMapping("/my-store")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<List<ProductResponse>> getMyStoreProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy danh sách sản phẩm của cửa hàng thành công")
                .result(productService.getMyStoreProducts())
                .build();
    }


    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable String id) {
        return ApiResponse.<ProductResponse>builder()
                .message("Lấy thông tin sản phẩm thành công")
                .result(productService.getProductById(id))
                .build();
    }


    @PostMapping
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .message("Tạo sản phẩm thành công")
                .result(productService.createProduct(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable String id,
            @RequestBody @Valid ProductRequest request
    ) {
        return ApiResponse.<ProductResponse>builder()
                .message("Cập nhật sản phẩm thành công")
                .result(productService.updateProduct(id, request))
                .build();
    }


    @PatchMapping("/{id}/visibility")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<ProductResponse> toggleVisibility(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Boolean> body
    ) {
        Boolean isVisible = (body != null) ? body.get("isVisible") : null;
        return ApiResponse.<ProductResponse>builder()
                .message("Cập nhật trạng thái hiển thị thành công")
                .result(productService.toggleVisibility(id, isVisible))
                .build();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .message("Xóa sản phẩm thành công")
                .build();
    }
}
