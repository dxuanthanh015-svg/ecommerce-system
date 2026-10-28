package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.CategoryRequest;
import com.thanhhandsome.backend.dto.response.CategoryResponse;
import com.thanhhandsome.backend.entity.Category;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.CategoryMapper;
import com.thanhhandsome.backend.repository.CategoryRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.StoreRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    ProductRepository productRepository;
    StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoryTree() {
        return categoryRepository.findByParentCategoryIsNull().stream()
                .map(categoryMapper::toCategoryResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper::toCategoryResponse).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        List<Category> categories = categoryRepository.findAll();
        BigDecimal totalCommission = categories.stream().map(Category::getCommissionRate)
                .filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        long commissionCount = categories.stream().filter(c -> c.getCommissionRate() != null).count();
        return Map.of("activeStores", storeRepository.countByStatus(StoreStatus.ACTIVE),
                "totalProducts", productRepository.countByIsActiveTrue(),
                "avgCommission", commissionCount == 0 ? BigDecimal.ZERO
                        : totalCommission.divide(BigDecimal.valueOf(commissionCount), 2, java.math.RoundingMode.HALF_UP));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category parent = request.getParentId() == null || request.getParentId().isBlank() ? null
                : categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        String slug = slugify(request.getSlug() == null || request.getSlug().isBlank()
                ? request.getName() : request.getSlug());
        if (categoryRepository.existsBySlug(slug)) throw new IllegalArgumentException("Slug danh mục đã tồn tại");
        Category category = Category.builder().name(request.getName().trim()).slug(slug)
                .level(parent == null ? 1 : parent.getLevel() + 1).parentCategory(parent)
                .commissionRate(request.getCommissionRate())
                .active(request.getActive() == null || request.getActive()).imageUrl(request.getImageUrl()).build();
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(String categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (request.getName() != null && !request.getName().isBlank()) category.setName(request.getName().trim());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = slugify(request.getSlug());
            if (!slug.equals(category.getSlug()) && categoryRepository.existsBySlug(slug)) {
                throw new IllegalArgumentException("Slug danh mục đã tồn tại");
            }
            category.setSlug(slug);
        }
        if (request.getCommissionRate() != null) category.setCommissionRate(request.getCommissionRate());
        if (request.getActive() != null) category.setActive(request.getActive());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Transactional
    public int importCsv(String csv) {
        List<List<String>> rows = parseCsv(csv);
        if (rows.size() < 2) throw new IllegalArgumentException("CSV không có dòng dữ liệu");
        Map<String, Integer> columns = new HashMap<>();
        for (int i = 0; i < rows.get(0).size(); i++) {
            columns.put(rows.get(0).get(i).replace("\uFEFF", "").trim().toLowerCase(Locale.ROOT), i);
        }
        if (!columns.containsKey("name")) throw new IllegalArgumentException("CSV cần cột name");
        Map<String, Category> bySlug = new HashMap<>();
        categoryRepository.findAll().forEach(c -> bySlug.put(c.getSlug(), c));
        int imported = 0;
        for (List<String> row : rows.subList(1, rows.size())) {
            String name = csvValue(row, columns, "name");
            if (name.isBlank()) continue;
            String csvSlug = csvValue(row, columns, "slug");
            String slug = slugify(csvSlug.isBlank() ? name : csvSlug);
            String parentSlugValue = csvValue(row, columns, "parentslug");
            String parentSlug = parentSlugValue.isBlank() ? "" : slugify(parentSlugValue);
            Category parent = parentSlug.isBlank() ? null : bySlug.get(parentSlug);
            if (!parentSlug.isBlank() && parent == null) {
                throw new IllegalArgumentException("Không tìm thấy parentSlug: " + parentSlug);
            }
            Category category = bySlug.get(slug);
            if (category == null) {
                category = Category.builder().name(name).slug(slug)
                        .level(parent == null ? 1 : parent.getLevel() + 1).parentCategory(parent).active(true).build();
            } else {
                category.setName(name);
                category.setParentCategory(parent);
                category.setLevel(parent == null ? 1 : parent.getLevel() + 1);
            }
            String commission = csvValue(row, columns, "commissionrate");
            if (!commission.isBlank()) category.setCommissionRate(new BigDecimal(commission));
            String active = csvValue(row, columns, "active");
            if (!active.isBlank()) category.setActive(Boolean.parseBoolean(active));
            category = categoryRepository.save(category);
            bySlug.put(category.getSlug(), category);
            imported++;
        }
        return imported;
    }

    private String csvValue(List<String> row, Map<String, Integer> columns, String name) {
        Integer index = columns.get(name);
        return index == null || index >= row.size() ? "" : row.get(index).trim();
    }

    private List<List<String>> parseCsv(String csv) {
        List<List<String>> rows = new ArrayList<>();
        List<String> row = new ArrayList<>();
        StringBuilder value = new StringBuilder();
        boolean quoted = false;
        for (int i = 0; i < csv.length(); i++) {
            char ch = csv.charAt(i);
            if (ch == '"' && quoted && i + 1 < csv.length() && csv.charAt(i + 1) == '"') {
                value.append('"'); i++;
            } else if (ch == '"') quoted = !quoted;
            else if (ch == ',' && !quoted) { row.add(value.toString()); value.setLength(0); }
            else if ((ch == '\n' || ch == '\r') && !quoted) {
                if (ch == '\r' && i + 1 < csv.length() && csv.charAt(i + 1) == '\n') i++;
                row.add(value.toString()); value.setLength(0);
                if (row.stream().anyMatch(cell -> !cell.isBlank())) rows.add(row);
                row = new ArrayList<>();
            } else value.append(ch);
        }
        row.add(value.toString());
        if (row.stream().anyMatch(cell -> !cell.isBlank())) rows.add(row);
        if (quoted) throw new IllegalArgumentException("CSV có dấu ngoặc kép chưa đóng");
        return rows;
    }

    private String slugify(String value) {
        return Normalizer.normalize(value == null ? "" : value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
