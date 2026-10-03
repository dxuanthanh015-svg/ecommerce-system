package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher,String> {
}
