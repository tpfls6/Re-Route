package com.reroute.domain.counseling.repository;

import com.reroute.domain.counseling.entity.CounselingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselingSessionRepository extends JpaRepository<CounselingSession, Long> {
  List<CounselingSession> findByUserIdOrderByCreatedAtDesc(Long userId);
}
