package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order,String> {
    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Order> findByStoreIdOrderByCreatedAtDesc(String userId);


}
