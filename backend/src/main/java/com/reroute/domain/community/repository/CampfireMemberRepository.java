package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CampfireMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampfireMemberRepository extends JpaRepository<CampfireMember, Long> {
  long countByCampfireId(Long campfireId);
  boolean existsByCampfireIdAndUserId(Long campfireId, Long userId);
  Optional<CampfireMember> findByCampfireIdAndUserId(Long campfireId, Long userId);
  void deleteByCampfireId(Long campfireId);
}
