package com.reroute.domain.auth.repository;

import com.reroute.domain.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByTokenHash(String tokenHash);
  List<RefreshToken> findByUserIdAndRevokedFalse(Long userId);
  void deleteByUserId(Long userId);
}
