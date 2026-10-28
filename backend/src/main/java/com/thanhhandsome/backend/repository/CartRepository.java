package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,String> {
    Optional<Cart> findByUserId(String s);

}
