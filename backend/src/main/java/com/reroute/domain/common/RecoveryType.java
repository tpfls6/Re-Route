package com.reroute.domain.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Schema(description = "상담 대화에서 관찰되는 회복 유형")
public enum RecoveryType {
  AVOIDANT("회피형", "감정이나 문제를 마주하기보다 미루거나 피하는 경향"),
  OVERFOCUSED("과몰입형", "특정 고민, 관계, 목표에 지나치게 몰두하고 끊어내기 어려운 경향"),
  LETHARGIC("무기력형", "에너지와 동기가 낮아 시작 자체가 어려운 경향"),
  RELATION_ANXIOUS("관계불안형", "타인의 반응, 거절, 거리감, 인정 욕구에 민감한 경향"),
  PERFECTIONIST("완벽주의형", "높은 기준과 실패에 대한 두려움 때문에 실행이 막히는 경향");

  private final String displayName;
  private final String description;
}
