package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.StorePayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorePayoutRepository extends JpaRepository<StorePayout,String> {
}
