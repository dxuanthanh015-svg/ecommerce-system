package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.entity.StoreApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface StoreRepository extends JpaRepository<Store,String> {
    Optional<Store> findByOwnerId(String ownerId);
    Optional<Store> findByOwnerEmail(String ownerEmail);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    long countByStatus(StoreStatus status);
}

