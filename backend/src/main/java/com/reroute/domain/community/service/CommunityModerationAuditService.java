package com.reroute.domain.community.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.community.dto.CommunityModerationDecision;
import com.reroute.domain.community.entity.CommunityModerationLog;
import com.reroute.domain.community.repository.CommunityModerationLogRepository;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommunityModerationAuditService {

  private final CommunityModerationLogRepository logRepository;
  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void record(Long userId, String targetType, String content, CommunityModerationDecision decision) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    logRepository.save(CommunityModerationLog.builder()
        .user(user)
        .targetType(targetType)
        .action(decision.blocked() ? "BLOCKED" : decision.selfHarmRisk() ? "WARNED" : "ALLOWED")
        .submittedContent(content)
        .reason(decision.reason())
        .categoriesJson(writeCategories(decision))
        .selfHarmRisk(decision.selfHarmRisk())
        .build());
  }

  private String writeCategories(CommunityModerationDecision decision) {
    try {
      return objectMapper.writeValueAsString(decision.categories());
    } catch (JsonProcessingException e) {
      return "[]";
    }
  }
}
