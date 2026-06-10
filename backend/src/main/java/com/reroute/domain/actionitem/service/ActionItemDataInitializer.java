package com.reroute.domain.actionitem.service;

import com.reroute.domain.actionitem.entity.ActionItem;
import com.reroute.domain.actionitem.entity.ActionItemFormat;
import com.reroute.domain.actionitem.entity.UserActionItem;
import com.reroute.domain.actionitem.repository.ActionItemRepository;
import com.reroute.domain.actionitem.repository.UserActionItemRepository;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.counseling.repository.CounselingAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ActionItemDataInitializer implements ApplicationRunner {

  private static final int ITEMS_PER_ANALYSIS = 2;

  private static final List<ActionItemSeed> DEFAULT_ITEMS = List.of(
      new ActionItemSeed("피하고 있던 일 1분만 시작하기", "완료보다 시작에 집중해 딱 1분만 행동해보세요.",
          RecoveryType.AVOIDANT, ActionItemFormat.MICRO_ACTION, 1),
      new ActionItemSeed("걱정되는 상황을 한 문장으로 적기", "피하고 싶은 상황과 가장 걱정되는 결과를 한 문장씩 적어보세요.",
          RecoveryType.AVOIDANT, ActionItemFormat.REFLECTION_PROMPT, 5),
      new ActionItemSeed("가장 쉬운 단계 하나 실행하기", "부담되는 일을 가장 작은 단계로 나누고 첫 단계만 실행해보세요.",
          RecoveryType.AVOIDANT, ActionItemFormat.TIME_BOX, 5),

      new ActionItemSeed("생각 멈춤 5분 타이머", "고민을 잠시 내려놓고 5분 동안 다른 감각이나 활동에 집중해보세요.",
          RecoveryType.OVERFOCUSED, ActionItemFormat.TIME_BOX, 5),
      new ActionItemSeed("지금 통제 가능한 것 구분하기", "바꿀 수 있는 것과 바꿀 수 없는 것을 각각 한 가지씩 적어보세요.",
          RecoveryType.OVERFOCUSED, ActionItemFormat.REFLECTION_PROMPT, 5),
      new ActionItemSeed("시선을 다른 곳으로 옮기기", "자리에서 일어나 주변의 색이나 소리를 천천히 다섯 가지 찾아보세요.",
          RecoveryType.OVERFOCUSED, ActionItemFormat.GROUNDING, 3),

      new ActionItemSeed("몸을 1분간 움직이기", "기지개, 제자리 걷기처럼 가장 쉬운 움직임을 1분만 해보세요.",
          RecoveryType.LETHARGIC, ActionItemFormat.MICRO_ACTION, 1),
      new ActionItemSeed("오늘 할 일 하나만 고르기", "중요도와 무관하게 지금 할 수 있는 가장 작은 일 하나를 선택하세요.",
          RecoveryType.LETHARGIC, ActionItemFormat.IMPERFECT_START, 3),
      new ActionItemSeed("물 한 잔 마시고 창문 보기", "물 한 잔을 마신 뒤 창밖이나 먼 곳을 보며 호흡을 가다듬어보세요.",
          RecoveryType.LETHARGIC, ActionItemFormat.GROUNDING, 3),

      new ActionItemSeed("상대의 반응을 세 가지로 해석하기", "부정적인 해석 외에 중립적이거나 긍정적인 가능성도 적어보세요.",
          RecoveryType.RELATION_ANXIOUS, ActionItemFormat.RELATION_REFRAME, 5),
      new ActionItemSeed("확인 메시지 보내기 전 10분 기다리기", "불안해서 바로 확인하고 싶을 때 10분만 기다린 뒤 다시 판단해보세요.",
          RecoveryType.RELATION_ANXIOUS, ActionItemFormat.TIME_BOX, 10),
      new ActionItemSeed("내가 원하는 관계 행동 적기", "상대의 반응 대신 내가 선택하고 싶은 건강한 행동을 한 문장으로 적어보세요.",
          RecoveryType.RELATION_ANXIOUS, ActionItemFormat.REFLECTION_PROMPT, 5),

      new ActionItemSeed("60점 상태로 시작하기", "완벽하게 준비하지 말고 현재 상태 그대로 첫 단계를 시작해보세요.",
          RecoveryType.PERFECTIONIST, ActionItemFormat.IMPERFECT_START, 5),
      new ActionItemSeed("실수해도 괜찮은 이유 적기", "이번 일에서 작은 실수가 허용되는 이유를 두 가지 적어보세요.",
          RecoveryType.PERFECTIONIST, ActionItemFormat.REFLECTION_PROMPT, 5),
      new ActionItemSeed("초안에 10분만 쓰기", "수정하지 않고 10분 동안 초안을 만드는 데만 집중해보세요.",
          RecoveryType.PERFECTIONIST, ActionItemFormat.TIME_BOX, 10)
  );

  private final ActionItemRepository actionItemRepository;
  private final UserActionItemRepository userActionItemRepository;
  private final CounselingAnalysisRepository counselingAnalysisRepository;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    seedCatalog();
    backfillMissingAssignments();
  }

  private void seedCatalog() {
    int created = 0;
    for (ActionItemSeed seed : DEFAULT_ITEMS) {
      if (actionItemRepository.existsByTitle(seed.title())) {
        continue;
      }
      actionItemRepository.save(ActionItem.builder()
          .title(seed.title())
          .description(seed.description())
          .category(seed.category())
          .format(seed.format())
          .estimatedMinutes(seed.estimatedMinutes())
          .build());
      created++;
    }
    if (created > 0) {
      log.info("Seeded {} default action items", created);
    }
  }

  private void backfillMissingAssignments() {
    int assigned = 0;
    for (var analysis : counselingAnalysisRepository.findAll()) {
      var session = analysis.getSession();
      if (!userActionItemRepository.findByCounselingSessionId(session.getId()).isEmpty()) {
        continue;
      }

      var candidates = actionItemRepository.findByCategory(analysis.getRecoveryType()).stream()
          .sorted(Comparator.comparing(ActionItem::getId))
          .limit(ITEMS_PER_ANALYSIS)
          .toList();

      for (ActionItem item : candidates) {
        userActionItemRepository.save(UserActionItem.builder()
            .user(session.getUser())
            .actionItem(item)
            .counselingSession(session)
            .build());
        assigned++;
      }
    }
    if (assigned > 0) {
      log.info("Backfilled {} user action item assignments", assigned);
    }
  }

  private record ActionItemSeed(
      String title,
      String description,
      RecoveryType category,
      ActionItemFormat format,
      int estimatedMinutes
  ) {
  }
}
