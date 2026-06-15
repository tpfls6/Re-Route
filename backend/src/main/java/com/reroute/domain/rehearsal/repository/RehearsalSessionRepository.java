package com.reroute.domain.rehearsal.repository;

import com.reroute.domain.rehearsal.entity.RehearsalSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RehearsalSessionRepository extends JpaRepository<RehearsalSession, Long> {
  List<RehearsalSession> findByUserIdOrderByCreatedAtDesc(Long userId);
  Optional<RehearsalSession> findByQuestId(Long questId);
}
