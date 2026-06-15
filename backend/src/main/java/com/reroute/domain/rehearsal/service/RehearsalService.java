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
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RehearsalService {

  private static final int HARD_MAX_USER_TURNS = 12;
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  private static final List<String> REFUSAL_PATTERNS = List.of(
      "ai입니다", "ai가 아니", "언어 모델", "저는 실제", "이 역할을 수행",
      "역할을 하기 어렵", "도움을 드리기 어렵", "죄송하지만 저는"
  );

  private static final Map<Integer, Object[]> SCENARIO_UI = Map.of(
      1, new Object[]{"발표 리허설", "청중 앞에서 발표하는 상황 연습", "bi-mic-fill", "ql2", "중급"},
      2, new Object[]{"면접 리허설", "면접관과 1:1 대화 시뮬레이션", "bi-briefcase", "ql3", "고급"},
      3, new Object[]{"사과 연습", "상대방에게 진심 어린 사과하기", "bi-hand-thumbs-up", "ql2", "중급"},
      4, new Object[]{"거절 연습", "상대의 부탁을 정중하게 거절하기", "bi-x-circle", "ql1", "입문"},
      5, new Object[]{"첫인사 연습", "낯선 사람에게 먼저 말 걸기", "bi-chat-dots", "ql1", "입문"},
      6, new Object[]{"전화 통화 연습", "어색한 전화 상황 대처 연습", "bi-telephone", "ql2", "중급"}
  );

  private static final Map<Integer, String> SCENARIO_GOALS = Map.of(
      1, "발표 주제를 명확히 설명하고, 날카로운 질문에 논리적으로 답변하기",
      2, "면접 질문에 구체적인 사례와 자신감 있는 어투로 답변하기",
      3, "변명 없이 진심 어린 사과를 전달해서 상대방이 마음을 열게 하기",
      4, "상대방의 설득과 압박에도 흔들리지 않고 끝까지 정중하게 거절 유지하기",
      5, "낯선 사람에게 먼저 말을 걸어 자연스러운 대화를 이어가기",
      6, "업무 전화에서 핵심 용건을 간결하게 전달하고 통화를 매끄럽게 마무리하기"
  );

  // 시나리오별 [이름, 역할 프롬프트, 회복유형]
  private static final Map<Integer, Object[]> SCENARIOS = Map.of(
      1, new Object[]{"발표 리허설", """
          이름: 청중 (직장 상사 김팀장)
          성격: 논리적이고 날카롭지만 무례하지 않은 50대 직장인
          진행 순서:
          ① 첫 발언: "오늘 발표 주제가 뭐예요?" (이 질문만 하세요)
          ② 주제를 들으면 그 내용에 대한 날카로운 질문 하나만 하세요.
          ③ 답변이 명확하면 짧게 인정하고, 다른 각도의 질문 하나를 추가하세요.
          ④ 답변이 모호하면 "조금 더 구체적으로 말해줄 수 있어요?"라고만 하세요.
          주의: 반드시 사용자가 언급한 발표 내용에 기반해서만 질문하세요. 주제와 무관한 질문 금지.
          """, RecoveryType.PERFECTIONIST},
      2, new Object[]{"면접 리허설", """
          이름: 면접관 이부장
          성격: 냉정하고 효율적인 인사담당자. 시간이 많지 않음.
          진행 순서:
          ① 첫 발언: "간단히 자기소개 해주세요." (이것만 하세요)
          ② 자기소개를 들으면: "저희에 지원하신 동기가 뭔가요?"
          ③ 답변을 들으면: "본인의 강점 하나만 말씀해주세요."
          ④ 마지막: "팀원이 갑자기 빠졌을 때 어떻게 대처하시겠어요?"
          주의: 한 번에 하나의 질문만 하세요. 사용자가 언급하지 않은 직무·회사명을 임의로 가정하지 마세요.
          답변이 모호하면 "구체적인 사례를 들어주세요."라고만 하세요.
          """, RecoveryType.PERFECTIONIST},
      3, new Object[]{"사과 연습", """
          이름: 친구
          성격: 상처를 받았지만 폭발적이지 않고, 진심이 느껴지면 마음을 여는 사람
          첫 발언: "야, 지난번에 네가 한 말 진짜 상처받았어."
          진행:
          - 어정쩡하거나 변명이 섞인 사과에는 차갑게 반응: "그게 사과야?"
          - 진심이 느껴지는 사과에는 조금씩 마음을 여세요.
          - 진심 어린 사과가 2번 이상 이어지면 용서하고 suggestEnd = true.
          주의: 반말을 사용하세요. 지나치게 화내거나 폭발하지 마세요.
          """, RecoveryType.RELATION_ANXIOUS},
      4, new Object[]{"거절 연습", """
          이름: 직장 동료 박과장
          성격: 무리한 부탁을 당연하게 하는 타입. 거절당하면 다른 이유를 들어 설득 시도.
          첫 발언: "야 미안한데, 이번 토요일에 내 발표 좀 대신 해줄 수 있어?"
          진행:
          - 거절당하면 다른 이유로 재시도: "한 번만이야", "나 정말 급해", "밥 살게"
          - 3번 확고하게 거절당하면 완전히 물러서고 suggestEnd = true.
          주의: 반드시 반말을 사용하세요. 발표 대신하기 주제에서 벗어나지 마세요.
          """, RecoveryType.AVOIDANT},
      5, new Object[]{"첫인사 연습", """
          이름: 카페의 낯선 사람
          성격: 혼자 책을 읽거나 노트북으로 일하는 중. 처음엔 다소 무뚝뚝하지만 나쁜 사람은 아님.
          시작: 사용자가 먼저 말을 걸 때까지 기다리세요. 대화 시작 전 첫 발언은 없습니다.
          진행:
          - 처음엔 짧게 반응: "아, 네." 수준
          - 사용자가 자연스럽게 이어가면 조금씩 응하세요.
          - 3~4번 자연스러운 대화가 이어지면 suggestEnd = true.
          주의: 과도하게 친절하거나 활기차게 반응하지 마세요. 현실적인 낯선 사람처럼 행동하세요.
          """, RecoveryType.RELATION_ANXIOUS},
      6, new Object[]{"전화 통화 연습", """
          이름: 김대리 (바쁜 거래처 담당자)
          성격: 업무적이고 간결함. 핵심을 빨리 파악하고 싶어함.
          첫 발언: "여보세요?"
          진행:
          ① 발신자 확인: "실례지만 어디세요?"
          ② 용건이 불명확하면: "어떤 건으로 연락하신 건가요?"
          ③ 용건이 파악되면 응대 후: "확인하고 연락드리겠습니다." 후 suggestEnd = true.
          주의: 전화 통화답게 짧고 간결하게만 말하세요.
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

    try {
      String json = llmClient.completeWithHistory(systemPrompt, history, 0.65);
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

      String scenarioGoal = SCENARIO_GOALS.getOrDefault(req.getScenarioId(), "시나리오 목표를 달성하기");
      LlmQuestResult result = llmClient.generateRehearsalQuest(
          conversation, req.getScenarioName(), scenarioGoal, req.getFeedback()
      );
      UserQuest quest = userQuestRepository.save(UserQuest.builder()
          .user(user)
          .rehearsalSessionId(session.getId())
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

  public List<RehearsalDto.ScenarioResponse> getScenarios() {
    return SCENARIO_UI.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .map(e -> {
          Object[] ui = e.getValue();
          return RehearsalDto.ScenarioResponse.builder()
              .id(e.getKey())
              .name((String) ui[0])
              .desc((String) ui[1])
              .icon((String) ui[2])
              .diffClass((String) ui[3])
              .diffLabel((String) ui[4])
              .build();
        })
        .toList();
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
        .messages(parseMessages(s.getMessagesJson()))
        .build();
  }

  private List<RehearsalDto.TurnRequest.MessageItem> parseMessages(String json) {
    if (json == null || json.isBlank()) return List.of();
    try {
      return objectMapper.readValue(json, new TypeReference<List<RehearsalDto.TurnRequest.MessageItem>>() {});
    } catch (Exception e) {
      log.warn("메시지 파싱 실패: {}", e.getMessage());
      return List.of();
    }
  }

  private String buildSystemPrompt(String scenarioName, String roleDescription, boolean isLastTurn) {
    String base = String.format("""
        아래 캐릭터를 그대로 연기하세요. 당신은 AI가 아니라 그 캐릭터 자체입니다.

        [캐릭터 설정]
        %s

        [필수 대화 규칙]
        1. 한 번에 발언·질문은 하나만 하세요. 여러 개를 한꺼번에 던지지 마세요.
        2. 상대방의 말에 반드시 반응한 후 다음 행동을 하세요.
        3. 2~3문장 이내로 짧고 자연스럽게 말하세요.
        4. "AI입니다", "이 역할을 수행하기 어렵습니다" 같은 말은 절대 하지 마세요.
        5. 시나리오 범위 밖의 대화는 자연스럽게 원래 주제로 돌아오세요.

        [응답 형식] 반드시 아래 JSON만 반환하세요. 다른 텍스트는 포함하지 마세요:
        {"npcReply": "여기에 실제 대사만", "isFinal": false, "suggestEnd": false, "feedback": null}

        - isFinal: 대화 완전 종료 시 true. true로 설정하면 feedback도 반드시 작성해야 합니다.
        - suggestEnd: 시나리오 목표 달성 시 true (isFinal은 false 유지)
        - feedback: isFinal=true이면 전체 대화 평가 1~2문장 필수 (잘한 점→개선점 순서). 그 외 반드시 null.
        """, roleDescription);

    if (isLastTurn) {
      base += """

          [마무리]
          대화를 자연스럽게 끝내세요. isFinal = true로 설정하고,
          feedback에 전체 대화 흐름 평가를 1~2문장으로 작성하세요.
          잘한 점을 먼저, 개선할 점을 이어서 쓰세요.
          """;
    }

    return base;
  }

  private boolean isRefusal(String reply) {
    if (reply == null || reply.isBlank()) return false;
    String lower = reply.toLowerCase(Locale.ROOT);
    return REFUSAL_PATTERNS.stream().anyMatch(lower::contains);
  }

  private RehearsalDto.TurnResponse parseResponse(String json, int userTurnCount, boolean isLastTurn) {
    String fallback = userTurnCount == 0 ? "안녕하세요. 시작해볼까요?" : "네, 계속해주세요.";
    try {
      JsonNode node = objectMapper.readTree(json);
      String npcReply = node.path("npcReply").asText("");
      if (npcReply.isBlank() || npcReply.equals("...") || isRefusal(npcReply)) {
        npcReply = fallback;
      }
      boolean isFinal = node.path("isFinal").asBoolean(false) || isLastTurn;
      boolean suggestEnd = !isFinal && node.path("suggestEnd").asBoolean(false);
      String feedback = node.path("feedback").isNull() ? null : node.path("feedback").asText(null);
      // isFinal인데 LLM이 feedback을 비워둔 경우 기본 피드백 제공
      if (isFinal && (feedback == null || feedback.isBlank())) {
        feedback = "리허설을 완료했습니다. 실제 상황에서도 오늘처럼 차분하게 대응해보세요.";
      }
      return RehearsalDto.TurnResponse.builder()
          .npcReply(npcReply)
          .userTurnCount(userTurnCount)
          .isFinal(isFinal)
          .suggestEnd(suggestEnd)
          .feedback(feedback)
          .build();
    } catch (Exception e) {
      return RehearsalDto.TurnResponse.builder()
          .npcReply(fallback)
          .userTurnCount(userTurnCount)
          .isFinal(isLastTurn)
          .suggestEnd(false)
          .feedback(isLastTurn ? "리허설을 완료했습니다. 실제 상황에서도 오늘처럼 차분하게 대응해보세요." : null)
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
