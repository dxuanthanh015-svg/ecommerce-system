package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishListRepository extends JpaRepository<Wishlist,String> {
}
