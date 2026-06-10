package com.reroute.domain.auth.repository;

import com.reroute.domain.auth.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
  Optional<EmailVerification> findTopByEmailAndPurposeOrderByCreatedAtDesc(
      String email,
      EmailVerification.Purpose purpose
  );

  void deleteByEmailAndPurpose(String email, EmailVerification.Purpose purpose);
}
