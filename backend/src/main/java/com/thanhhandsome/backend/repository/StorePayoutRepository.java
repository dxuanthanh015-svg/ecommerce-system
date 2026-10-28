package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.StorePayout;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StorePayoutRepository extends JpaRepository<StorePayout,String> {
    List<StorePayout> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
