package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Voucher;
import com.thanhhandsome.backend.enums.VoucherStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, String> {
    Optional<Voucher> findByCodeIgnoreCase(String code);
    Optional<Voucher> findByCodeIgnoreCaseAndStoreIsNull(String code);
    boolean existsByCodeIgnoreCase(String code);
    Optional<Voucher> findByCodeIgnoreCaseAndStoreId(String code, String storeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Voucher v WHERE LOWER(v.code) = LOWER(:code) AND v.store.id = :storeId")
    Optional<Voucher> findForUpdateByCodeAndStoreId(@Param("code") String code, @Param("storeId") String storeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Voucher v WHERE LOWER(v.code) = LOWER(:code) AND v.store IS NULL")
    Optional<Voucher> findForUpdateGlobalByCode(@Param("code") String code);
    List<Voucher> findByStoreIdOrderByCreatedAtDesc(String storeId);
    List<Voucher> findAllByOrderByCreatedAtDesc();
    long countByStoreIdAndStatus(String storeId, VoucherStatus status);
    long countByStatus(VoucherStatus status);

    @Query("SELECT COALESCE(SUM(v.revenueImpact), 0) FROM Voucher v WHERE v.store.id = :storeId")
    BigDecimal sumRevenueImpactByStoreId(@Param("storeId") String storeId);

    @Query("SELECT COALESCE(SUM(v.revenueImpact), 0) FROM Voucher v")
    BigDecimal sumAllRevenueImpact();

    @Query("SELECT COALESCE(SUM(v.usedCount), 0) FROM Voucher v WHERE v.store.id = :storeId")
    Long sumUsedCountByStoreId(@Param("storeId") String storeId);

    @Query("SELECT COALESCE(SUM(v.usedCount), 0) FROM Voucher v")
    Long sumAllUsedCount();
}
