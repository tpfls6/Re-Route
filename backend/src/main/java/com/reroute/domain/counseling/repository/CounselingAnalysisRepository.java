package com.reroute.domain.counseling.repository;

import com.reroute.domain.counseling.entity.CounselingAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CounselingAnalysisRepository extends JpaRepository<CounselingAnalysis, Long> {
  Optional<CounselingAnalysis> findBySessionId(Long sessionId);
}
