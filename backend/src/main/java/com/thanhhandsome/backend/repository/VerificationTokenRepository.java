package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
}
