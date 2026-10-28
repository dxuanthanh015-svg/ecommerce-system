package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherUsageRepository extends JpaRepository<VoucherUsage,String> {
    boolean existsByVoucher_IdAndUser_Id(String voucherId, String userId);
}
