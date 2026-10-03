package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale,String> {
}
