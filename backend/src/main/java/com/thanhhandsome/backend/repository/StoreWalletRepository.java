package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.StoreWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreWalletRepository extends JpaRepository<StoreWallet,String> {
    Optional<StoreWallet> findByStoreId(String s);
}
