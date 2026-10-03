package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem,String> {
}
