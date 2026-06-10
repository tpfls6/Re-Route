package com.reroute.domain.counseling.repository;

import com.reroute.domain.counseling.entity.CounselingMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounselingMessageRepository extends JpaRepository<CounselingMessage, Long> {
  List<CounselingMessage> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
  void deleteBySessionId(Long sessionId);
}
