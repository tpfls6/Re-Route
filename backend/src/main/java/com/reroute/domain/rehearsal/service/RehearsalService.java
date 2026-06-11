package com.reroute.domain.rehearsal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.llm.dto.LlmChatMessage;
import com.reroute.domain.llm.dto.LlmQuestResult;
import com.reroute.domain.llm.exception.LlmException;
import com.reroute.domain.llm.service.LlmClient;
import com.reroute.domain.quest.dto.UserQuestDto;
import com.reroute.domain.quest.entity.UserQuest;
import com.reroute.domain.quest.repository.UserQuestRepository;
import com.reroute.domain.quest.service.QuestService;
import com.reroute.domain.rehearsal.dto.RehearsalDto;
import com.reroute.domain.rehearsal.entity.RehearsalSession;
import com.reroute.domain.rehearsal.repository.RehearsalSessionRepository;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RehearsalService {

  private static final int HARD_MAX_USER_TURNS = 12;
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  // 시나리오별 [이름, 역할 프롬프트, 회복유형]
  private static final Map<Integer, Object[]> SCENARIOS = Map.of(
      1, new Object[]{"발표 리허설", """
          당신은 발표를 듣고 있는 까다로운 청중/질문자입니다.
          사용자는 발표자로서 연습 중입니다.
          처음에는 발표 주제를 물어보고, 이후 발표 내용에 날카로운 질문을 던지거나 반론을 제기하세요.
          질문은 현실적이고 구체적이어야 합니다. 발표자가 잘 답변하면 인정하되,
          부족한 부분은 더 파고드세요.
          """, RecoveryType.PERFECTIONIST},
      2, new Object[]{"면접 리허설", """
          당신은 냉정하고 날카로운 면접관입니다.
          사용자는 입사 지원자로서 면접 연습 중입니다.
          자기소개 → 지원 동기 → 강점/약점 → 상황 판단 질문 순으로 진행하세요.
          답변이 모호하면 "구체적인 사례를 들어주세요"처럼 압박 질문을 하세요.
          전문적이고 사무적인 어투를 유지하세요.
          """, RecoveryType.PERFECTIONIST},
      3, new Object[]{"사과 연습", """
          당신은 친구의 말에 상처를 받은 사람입니다.
          사용자는 당신에게 진심 어린 사과를 해야 합니다.
          처음에는 서운함을 표현하고, 사과가 충분히 진심으로 느껴질 때까지 쉽게 받아들이지 마세요.
          어정쩡하거나 변명 섞인 사과에는 차갑게 반응하고,
          진심이 느껴지면 점차 마음을 열어주세요.
          반말 친근한 어투를 사용하세요.
          """, RecoveryType.RELATION_ANXIOUS},
      4, new Object[]{"거절 연습", """
          당신은 무리한 부탁을 계속 들어달라고 하는 직장 동료입니다.
          사용자는 당신의 부탁을 정중하게 거절하는 연습을 합니다.
          처음엔 토요일 대신 발표를 해달라는 부탁을 시작으로,
          거절당하면 다른 이유나 보상을 내세우며 계속 설득하려 하세요.
          사용자가 확고하게 거절할수록 점점 물러서세요.
          """, RecoveryType.AVOIDANT},
      5, new Object[]{"첫인사 연습", """
          당신은 카페에서 옆자리에 앉은 낯선 사람입니다.
          사용자는 먼저 말을 걸어 자연스러운 대화를 시작하는 연습을 합니다.
          처음에는 약간 어색하게 반응하다가, 사용자가 편하게 다가오면 점차 대화에 응하세요.
          공통 주제(날씨, 카페, 책 등)로 대화를 이어가되 지나치게 활기차지 않게,
          현실적인 낯선 사람처럼 반응하세요.
          """, RecoveryType.RELATION_ANXIOUS},
      6, new Object[]{"전화 통화 연습", """
          당신은 바쁜 거래처 담당자(김대리)입니다.
          사용자는 업무 전화를 거는 연습을 합니다.
          처음엔 "여보세요, 누구세요?"로 시작하고,
          용건이 불명확하면 재차 묻고, 핵심을 빨리 말해주길 유도하세요.
          업무적이고 다소 바빠 보이는 어투를 유지하세요.
          통화를 마무리할 때는 "확인 후 연락드리겠습니다"처럼 마무리하세요.
          """, RecoveryType.AVOIDANT}
  );

  private final LlmClient llmClient;
  private final ObjectMapper objectMapper;
  private final RehearsalSessionRepository rehearsalSessionRepository;
  private final UserQuestRepository userQuestRepository;
  private final QuestService questService;
  private final UserRepository userRepository;

  public RehearsalDto.TurnResponse nextTurn(RehearsalDto.TurnRequest req) {
    Object[] info = SCENARIOS.getOrDefault(req.getScenarioId(), SCENARIOS.get(1));
    String scenarioName = (String) info[0];
    String roleDescription = (String) info[1];

    List<RehearsalDto.TurnRequest.MessageItem> messages = req.getMessages() == null ? List.of() : req.getMessages();
    long userTurnCount = messages.stream().filter(m -> "user".equals(m.getRole())).count();
    boolean isLastTurn = req.isForceComplete() || userTurnCount >= HARD_MAX_USER_TURNS;

    String systemPrompt = buildSystemPrompt(scenarioName, roleDescription, isLastTurn);

    List<LlmChatMessage> history = new ArrayList<>();
    for (RehearsalDto.TurnRequest.MessageItem m : messages) {
      String role = "user".equals(m.getRole()) ? "user" : "assistant";
      history.add(new LlmChatMessage(role, m.getContent()));
    }
    if (history.isEmpty()) {
      history.add(new LlmChatMessage("user", "시작해주세요."));
    }
    // forceComplete: 사용자가 완료 버튼을 누른 경우 피드백 요청 메시지 주입
    if (req.isForceComplete()) {
      history.add(new LlmChatMessage("user", "리허설을 마무리할게요. 피드백 부탁드립니다."));
    }

    try {
      String json = llmClient.completeWithHistory(systemPrompt, history, 0.8);
      return parseResponse(json, (int) userTurnCount, isLastTurn);
    } catch (LlmException e) {
      return RehearsalDto.TurnResponse.builder()
          .npcReply("잠시 연결이 원활하지 않아요. 다시 시도해주세요.")
          .userTurnCount((int) userTurnCount)
          .isFinal(false)
          .suggestEnd(false)
          .build();
    }
  }

  @Transactional
  public RehearsalDto.SessionResponse completeSession(Long userId, RehearsalDto.CompleteRequest req) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

    String messagesJson = writeJson(req.getMessages());
    RehearsalSession session = rehearsalSessionRepository.save(RehearsalSession.builder()
        .user(user)
        .scenarioId(req.getScenarioId())
        .scenarioName(req.getScenarioName())
        .messagesJson(messagesJson)
        .feedback(req.getFeedback())
        .build());

    UserQuestDto.Detail quest = generateQuest(user, session, req);
    if (quest != null) {
      session.linkQuest(quest.getId());
    }

    return toSessionResponse(session, quest);
  }

  public List<RehearsalDto.SessionResponse> getMyHistory(Long userId) {
    return rehearsalSessionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(s -> toSessionResponse(s, null))
        .toList();
  }

  private UserQuestDto.Detail generateQuest(User user, RehearsalSession session, RehearsalDto.CompleteRequest req) {
    try {
      Object[] info = SCENARIOS.getOrDefault(req.getScenarioId(), SCENARIOS.get(1));
      RecoveryType recoveryType = (RecoveryType) info[2];

      List<LlmChatMessage> conversation = new ArrayList<>();
      if (req.getMessages() != null) {
        for (RehearsalDto.TurnRequest.MessageItem m : req.getMessages()) {
          String role = "user".equals(m.getRole()) ? "user" : "assistant";
          conversation.add(new LlmChatMessage(role, m.getContent()));
        }
      }

      String analysisSummary = "[리허설: " + req.getScenarioName() + "] " + (req.getFeedback() != null ? req.getFeedback() : "");
      LlmQuestResult result = llmClient.generateQuest(conversation, recoveryType, analysisSummary);
      UserQuest quest = userQuestRepository.save(UserQuest.builder()
          .user(user)
          .recoveryType(recoveryType)
          .title(result.title())
          .background(result.background())
          .why(result.why())
          .steps(writeJsonList(result.steps()))
          .tips(writeJsonList(result.tips()))
          .estimatedMinutes(result.estimatedMinutes())
          .difficulty(result.difficulty())
          .build());
      return questService.toDetail(quest);
    } catch (Exception e) {
      log.warn("리허설 퀘스트 생성 실패: sessionId={}", session.getId(), e);
      return null;
    }
  }

  private RehearsalDto.SessionResponse toSessionResponse(RehearsalSession s, UserQuestDto.Detail quest) {
    return RehearsalDto.SessionResponse.builder()
        .id(s.getId())
        .scenarioId(s.getScenarioId())
        .scenarioName(s.getScenarioName())
        .feedback(s.getFeedback())
        .questId(s.getQuestId())
        .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().format(FORMATTER) : null)
        .quest(quest)
        .build();
  }

  private String buildSystemPrompt(String scenarioName, String roleDescription, boolean isLastTurn) {
    String base = String.format("""
        당신은 '%s' 시나리오의 NPC입니다.

        역할:
        %s

        응답 규칙:
        - 2~3문장 이내로 짧고 자연스럽게 말하세요.
        - npcReply에는 NPC의 실제 한국어 대사를 작성하세요. 절대 비워두거나 "..." 같은 기호만 쓰지 마세요.
        - 반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
          {"npcReply": "여기에 NPC 실제 대사", "isFinal": false, "suggestEnd": false, "feedback": null}
        - isFinal: 대화가 완전히 종료되어 피드백을 줄 때만 true
        - suggestEnd: 시나리오 목표가 충분히 달성되어 마무리를 제안하고 싶을 때 true (isFinal은 여전히 false)
        - feedback: isFinal=true일 때만 1~2문장 피드백 텍스트, 그 외 null
        """, scenarioName, roleDescription);

    if (isLastTurn) {
      base += """

          지금 대화를 마무리합니다.
          자연스럽게 마무리 대사를 하고 isFinal을 true로 설정하세요.
          feedback에는 사용자의 전체 대화 흐름을 1~2문장으로 피드백해주세요.
          긍정적인 부분을 먼저 언급하고, 개선할 점을 덧붙이는 방식으로 작성하세요.
          """;
    }

    return base;
  }

  private RehearsalDto.TurnResponse parseResponse(String json, int userTurnCount, boolean isLastTurn) {
    try {
      JsonNode node = objectMapper.readTree(json);
      String npcReply = node.path("npcReply").asText("");
      if (npcReply.isBlank() || npcReply.equals("...")) {
        npcReply = "잠시 생각 중이에요. 다시 말씀해 주실 수 있나요?";
      }
      boolean isFinal = node.path("isFinal").asBoolean(false) || isLastTurn;
      boolean suggestEnd = !isFinal && node.path("suggestEnd").asBoolean(false);
      String feedback = node.path("feedback").isNull() ? null : node.path("feedback").asText(null);
      return RehearsalDto.TurnResponse.builder()
          .npcReply(npcReply)
          .userTurnCount(userTurnCount)
          .isFinal(isFinal)
          .suggestEnd(suggestEnd)
          .feedback(feedback)
          .build();
    } catch (Exception e) {
      return RehearsalDto.TurnResponse.builder()
          .npcReply(json)
          .userTurnCount(userTurnCount)
          .isFinal(isLastTurn)
          .suggestEnd(false)
          .build();
    }
  }

  private String writeJson(Object value) {
    try {
      return objectMapper.writeValueAsString(value);
    } catch (JsonProcessingException e) {
      return "[]";
    }
  }

  private String writeJsonList(List<String> list) {
    try {
      return objectMapper.writeValueAsString(list);
    } catch (JsonProcessingException e) {
      return "[]";
    }
  }
}
