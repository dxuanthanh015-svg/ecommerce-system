package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.CategoryResponse;
import com.thanhhandsome.backend.dto.request.CategoryRequest;
import com.thanhhandsome.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Lấy danh mục thành công")
                .result(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("/tree")
    public ApiResponse<List<CategoryResponse>> getTree() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Lấy cây danh mục thành công")
                .result(categoryService.getCategoryTree())
                .build();
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, Object>> getStats() {
        return ApiResponse.<Map<String, Object>>builder().message("Lấy thống kê danh mục thành công")
                .result(categoryService.getStats()).build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder().message("Tạo danh mục thành công")
                .result(categoryService.create(request)).build();
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> update(@PathVariable String categoryId,
                                                @RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder().message("Cập nhật danh mục thành công")
                .result(categoryService.update(categoryId, request)).build();
    }

    @PostMapping(value = "/admin/import", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, Integer>> importCsv(@RequestPart("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) throw new IllegalArgumentException("File CSV đang trống");
        String csv = new String(file.getBytes(), StandardCharsets.UTF_8);
        return ApiResponse.<Map<String, Integer>>builder().message("Import danh mục thành công")
                .result(Map.of("imported", categoryService.importCsv(csv))).build();
    }
}
