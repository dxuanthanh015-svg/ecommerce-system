package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.StoreApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreApplicationRepository extends JpaRepository<StoreApplication,String> {

}
