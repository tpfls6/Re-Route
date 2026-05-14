package com.reroute.domain.counseling.repository;

import com.reroute.domain.counseling.entity.EmotionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmotionLogRepository extends JpaRepository<EmotionLog, Long> {
  List<EmotionLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}
