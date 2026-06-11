package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CampfireMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampfireMessageRepository extends JpaRepository<CampfireMessage, Long> {
  List<CampfireMessage> findByCampfireIdOrderByCreatedAtAsc(Long campfireId);
  List<CampfireMessage> findByCampfireIdAndIdGreaterThanOrderByCreatedAtAsc(Long campfireId, Long afterId);
  void deleteByCampfireId(Long campfireId);
}
