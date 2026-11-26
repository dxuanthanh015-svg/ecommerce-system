package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.PaymentIntent;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, String> {
    Optional<PaymentIntent> findByTransactionCodeAndUser_Id(String transactionCode, String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from PaymentIntent p where p.transactionCode = :transactionCode")
    Optional<PaymentIntent> findByTransactionCodeForUpdate(@Param("transactionCode") String transactionCode);
}
