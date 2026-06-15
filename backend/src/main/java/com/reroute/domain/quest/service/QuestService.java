package com.reroute.domain.quest.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.quest.dto.UserQuestDto;
import com.reroute.domain.quest.entity.UserQuest;
import com.reroute.domain.quest.repository.UserQuestRepository;
import com.reroute.domain.rehearsal.repository.RehearsalSessionRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestService {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
  private static final Set<String> ALLOWED_FEELINGS = Set.of("proud", "okay", "hard", "mixed");

  private final UserQuestRepository userQuestRepository;
  private final RehearsalSessionRepository rehearsalSessionRepository;
  private final ObjectMapper objectMapper;

  public List<UserQuestDto.Summary> getMyQuests(Long userId) {
    return userQuestRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toSummary)
        .toList();
  }

  public UserQuestDto.Detail getQuest(Long userId, Long questId) {
    UserQuest quest = findOwned(userId, questId);
    return toDetail(quest);
  }

  @Transactional
  public UserQuestDto.Detail completeQuest(Long userId, Long questId) {
    UserQuest quest = findOwned(userId, questId);
    if (quest.getStatus() == UserQuest.QuestStatus.SKIPPED) {
      throw new IllegalArgumentException("건너뛴 퀘스트는 완료할 수 없습니다.");
    }
    if (quest.getStatus() == UserQuest.QuestStatus.COMPLETED) {
      return toDetail(quest);
    }
    quest.complete();
    return toDetail(quest);
  }

  @Transactional
  public UserQuestDto.Detail skipQuest(Long userId, Long questId) {
    UserQuest quest = findOwned(userId, questId);
    quest.skip();
    return toDetail(quest);
  }

  @Transactional
  public UserQuestDto.Detail saveRetrospective(Long userId, Long questId, UserQuestDto.RetroRequest req) {
    UserQuest quest = findOwned(userId, questId);
    if (quest.getStatus() != UserQuest.QuestStatus.COMPLETED) {
      throw new IllegalArgumentException("완료한 퀘스트에만 회고를 작성할 수 있습니다.");
    }
    if (req.getFeeling() != null && !ALLOWED_FEELINGS.contains(req.getFeeling())) {
      throw new IllegalArgumentException("지원하지 않는 기분 값입니다.");
    }
    quest.updateRetrospective(req.getFeeling(), req.getDifficultyRating(), req.getReflection(), req.getNextStep());
    return toDetail(quest);
  }

  private UserQuest findOwned(Long userId, Long questId) {
    UserQuest quest = userQuestRepository.findById(questId)
        .orElseThrow(() -> new ResourceNotFoundException("퀘스트를 찾을 수 없습니다."));
    if (!quest.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("본인의 퀘스트만 접근할 수 있습니다.");
    }
    return quest;
  }

  private UserQuestDto.Summary toSummary(UserQuest q) {
    SourceInfo src = resolveSource(q);
    return UserQuestDto.Summary.builder()
        .id(q.getId())
        .title(q.getTitle())
        .recoveryType(q.getRecoveryType())
        .recoveryTypeName(q.getRecoveryType().getDisplayName())
        .estimatedMinutes(q.getEstimatedMinutes())
        .difficulty(q.getDifficulty())
        .difficultyLabel(UserQuestDto.difficultyLabel(q.getDifficulty()))
        .status(q.getStatus().name())
        .sessionId(q.getCounselingSession() != null ? q.getCounselingSession().getId() : null)
        .createdAt(q.getCreatedAt() != null ? q.getCreatedAt().format(FORMATTER) : null)
        .feeling(q.getFeeling())
        .difficultyRating(q.getDifficultyRating())
        .reflection(q.getReflection())
        .nextStep(q.getNextStep())
        .sourceType(src.type)
        .rehearsalSessionId(src.resolvedRehearsalSessionId)
        .rehearsalScenarioName(src.rehearsalScenarioName)
        .counselingSessionTitle(src.counselingSessionTitle)
        .build();
  }

  public UserQuestDto.Detail toDetail(UserQuest q) {
    SourceInfo src = resolveSource(q);
    return UserQuestDto.Detail.builder()
        .id(q.getId())
        .title(q.getTitle())
        .background(q.getBackground())
        .why(q.getWhy())
        .steps(readJsonList(q.getSteps()))
        .tips(readJsonList(q.getTips()))
        .estimatedMinutes(q.getEstimatedMinutes())
        .difficulty(q.getDifficulty())
        .difficultyLabel(UserQuestDto.difficultyLabel(q.getDifficulty()))
        .recoveryType(q.getRecoveryType())
        .recoveryTypeName(q.getRecoveryType().getDisplayName())
        .status(q.getStatus().name())
        .sessionId(q.getCounselingSession() != null ? q.getCounselingSession().getId() : null)
        .createdAt(q.getCreatedAt() != null ? q.getCreatedAt().format(FORMATTER) : null)
        .feeling(q.getFeeling())
        .difficultyRating(q.getDifficultyRating())
        .reflection(q.getReflection())
        .nextStep(q.getNextStep())
        .sourceType(src.type)
        .rehearsalSessionId(src.resolvedRehearsalSessionId)
        .rehearsalScenarioName(src.rehearsalScenarioName)
        .counselingSessionTitle(src.counselingSessionTitle)
        .build();
  }

  private SourceInfo resolveSource(UserQuest q) {
    if (q.getCounselingSession() != null) {
      return new SourceInfo("COUNSELING", null, q.getCounselingSession().getTitle(), null);
    }
    if (q.getRehearsalSessionId() != null) {
      String scenarioName = rehearsalSessionRepository.findById(q.getRehearsalSessionId())
          .map(s -> s.getScenarioName())
          .orElse(null);
      return new SourceInfo("REHEARSAL", scenarioName, null, q.getRehearsalSessionId());
    }
    // rehearsalSessionId가 null인 구 데이터: RehearsalSession.questId로 역방향 조회
    return rehearsalSessionRepository.findByQuestId(q.getId())
        .map(s -> new SourceInfo("REHEARSAL", s.getScenarioName(), null, s.getId()))
        .orElse(new SourceInfo("UNKNOWN", null, null, null));
  }

  private record SourceInfo(String type, String rehearsalScenarioName, String counselingSessionTitle, Long resolvedRehearsalSessionId) {}

  private List<String> readJsonList(String json) {
    if (json == null) return List.of();
    try {
      return objectMapper.readValue(json, new TypeReference<>() {});
    } catch (JsonProcessingException e) {
      return List.of();
    }
  }
}
