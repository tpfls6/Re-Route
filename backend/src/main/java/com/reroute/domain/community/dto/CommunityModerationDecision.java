package com.reroute.domain.community.dto;

import java.util.List;

public record CommunityModerationDecision(
    boolean blocked,
    boolean selfHarmRisk,
    String reason,
    List<String> categories
) {
  public static CommunityModerationDecision allowed() {
    return new CommunityModerationDecision(false, false, "허용 가능한 내용입니다.", List.of());
  }
}
