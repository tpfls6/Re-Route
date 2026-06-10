package com.reroute.domain.community.service;

import com.reroute.domain.community.dto.CommunityModerationDecision;
import com.reroute.domain.community.exception.CommunityContentBlockedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommunityModerationService {

  public static final String CRISIS_NOTICE =
      "지금 스스로를 해칠 위험이 있다면 혼자 있지 말고 즉시 112 또는 119에 연락하거나, "
          + "믿을 수 있는 사람에게 현재 상황을 알려주세요.";

  private final CommunityModerationClient moderationClient;
  private final CommunityModerationAuditService auditService;

  public CommunityModerationDecision inspect(Long userId, String targetType, String content) {
    CommunityModerationDecision decision = moderationClient.moderate(userId, content);
    auditService.record(userId, targetType, content, decision);
    if (decision.blocked()) {
      throw new CommunityContentBlockedException(decision.reason(), decision.categories());
    }
    return decision;
  }
}
