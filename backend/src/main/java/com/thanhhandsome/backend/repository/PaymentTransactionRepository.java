package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,String> {
}
