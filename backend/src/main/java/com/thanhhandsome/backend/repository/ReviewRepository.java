package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review,String> {
}
