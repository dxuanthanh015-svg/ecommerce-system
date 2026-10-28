package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.StoreApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreApplicationRepository extends JpaRepository<StoreApplication,String> {
    Optional<StoreApplication> findByUserId(String userId);
    boolean existsByUserId(String userId);
    List<StoreApplication> findAllByOrderByCreatedAtDesc();
}
