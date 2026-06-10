package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CommunityModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityModerationLogRepository extends JpaRepository<CommunityModerationLog, Long> {
  List<CommunityModerationLog> findAllByOrderByCreatedAtDesc();
}
