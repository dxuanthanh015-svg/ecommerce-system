package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.RedisVerificationToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisVerificationTokenRepository extends CrudRepository<RedisVerificationToken, String> {
}
