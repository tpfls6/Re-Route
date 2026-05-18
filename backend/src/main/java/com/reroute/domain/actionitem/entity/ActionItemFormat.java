package com.reroute.domain.actionitem.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ActionItemFormat {
  MICRO_ACTION("아주 작은 행동"),
  REFLECTION_PROMPT("짧은 성찰 질문"),
  TIME_BOX("시간 제한 행동"),
  GROUNDING("안정화 행동"),
  RELATION_REFRAME("관계 해석 재구성"),
  IMPERFECT_START("불완전하게 시작하기");

  private final String displayName;
}
