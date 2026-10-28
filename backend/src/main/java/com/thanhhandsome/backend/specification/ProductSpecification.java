package com.thanhhandsome.backend.specification;

import com.thanhhandsome.backend.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> filter(String keyword, String categoryId, String storeId, BigDecimal minPrice,
                                                BigDecimal maxPrice, Double rating) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(StringUtils.hasText(keyword)){
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate brandPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), searchPattern);
                predicates.add(criteriaBuilder.or(titlePredicate, brandPredicate));
            }

            if(StringUtils.hasText(categoryId)){
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if(StringUtils.hasText(storeId)){
                predicates.add(criteriaBuilder.equal(root.get("store").get("id"), storeId));
            }

            if(minPrice != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if(maxPrice != null){
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if(rating != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), rating));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
