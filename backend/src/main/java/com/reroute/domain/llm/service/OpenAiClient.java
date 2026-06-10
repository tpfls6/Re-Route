package com.reroute.domain.llm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.llm.config.LlmProperties;
import com.reroute.domain.llm.config.OpenAiProperties;
import com.reroute.domain.llm.dto.LlmAnalysisResult;
import com.reroute.domain.llm.dto.LlmChatMessage;
import com.reroute.domain.llm.dto.LlmCounselingReply;
import com.reroute.domain.llm.dto.LlmQuestResult;
import com.reroute.domain.llm.exception.LlmException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "openai")
@RequiredArgsConstructor
public class OpenAiClient implements LlmClient {

  private static final String CHAT_COMPLETIONS_PATH = "/v1/chat/completions";

  private final OpenAiProperties properties;
  private final LlmProperties llmProperties;
  private final ObjectMapper objectMapper;

  @Override
  public LlmAnalysisResult analyzeRecoveryType(Long userId, List<LlmChatMessage> conversation) {
    validateConfiguration();
    String json = chatWithHistory(analysisSystemPrompt(), conversation, 0.2);
    return parseAnalysisResult(json);
  }

  @Override
  public LlmCounselingReply generateCounselingReply(Long userId, List<LlmChatMessage> conversation, RecoveryType primaryType) {
    try {
      validateConfiguration();
      String json = chatWithHistory(counselingSystemPrompt(primaryType), conversation, 0.7);
      return parseCounselingReply(json);
    } catch (LlmException e) {
      if (!llmProperties.isFallbackEnabled()) throw e;
      return generateFallbackReply(conversation);
    }
  }

  @Override
  public LlmQuestResult generateQuest(List<LlmChatMessage> conversation, RecoveryType recoveryType, String analysisSummary) {
    validateConfiguration();
    String json = chatWithHistory(questSystemPrompt(recoveryType), conversation, 0.7);
    return parseQuestResult(json);
  }

  @Override
  public String complete(String systemPrompt, String userMessage, double temperature) {
    validateConfiguration();
    return chatWithHistory(systemPrompt, List.of(new LlmChatMessage("user", userMessage)), temperature);
  }

  private String chatWithHistory(String systemPrompt, List<LlmChatMessage> conversation, double temperature) {
    List<Map<String, String>> messages = new ArrayList<>();
    messages.add(Map.of("role", "system", "content", systemPrompt));
    conversation.stream()
        .filter(m -> StringUtils.hasText(m.content()))
        .forEach(m -> messages.add(Map.of("role", m.role(), "content", m.content())));

    Map<String, Object> requestBody = Map.of(
        "model", properties.getModel(),
        "messages", messages,
        "temperature", temperature,
        "response_format", Map.of("type", "json_object")
    );

    return extractContent(post(requestBody));
  }

  private String extractContent(String response) {
    try {
      String content = objectMapper.readTree(response)
          .path("choices").path(0).path("message").path("content").asText();
      if (!StringUtils.hasText(content)) {
        throw new LlmException("OpenAI 응답이 비어 있습니다.");
      }
      return content;
    } catch (JsonProcessingException e) {
      throw new LlmException("OpenAI 응답을 해석할 수 없습니다.", e);
    }
  }

  private String post(Map<String, Object> requestBody) {
    try {
      return restClient()
          .post()
          .uri(CHAT_COMPLETIONS_PATH)
          .header("Authorization", "Bearer " + properties.getApiKey())
          .contentType(MediaType.APPLICATION_JSON)
          .body(requestBody)
          .retrieve()
          .body(String.class);
    } catch (RestClientResponseException e) {
      if (e.getStatusCode().value() == HttpStatus.UNAUTHORIZED.value()) {
        throw new LlmException("OPENAI_API_KEY가 유효하지 않습니다.", e);
      }
      if (e.getStatusCode().value() == HttpStatus.TOO_MANY_REQUESTS.value()) {
        throw new LlmException("OpenAI API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.", e);
      }
      if (e.getStatusCode().value() == HttpStatus.BAD_REQUEST.value()) {
        throw new LlmException("OpenAI API 요청 설정이 올바르지 않습니다: " + e.getResponseBodyAsString(), e);
      }
      throw new LlmException("OpenAI API 호출에 실패했습니다.", e);
    } catch (ResourceAccessException e) {
      throw new LlmException("OpenAI API에 연결할 수 없습니다.", e);
    }
  }

  private RestClient restClient() {
    SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
    Duration timeout = Duration.ofMillis(properties.getTimeoutMillis());
    requestFactory.setConnectTimeout(timeout);
    requestFactory.setReadTimeout(timeout);
    return RestClient.builder()
        .baseUrl(properties.getBaseUrl())
        .requestFactory(requestFactory)
        .build();
  }

  private void validateConfiguration() {
    if (!StringUtils.hasText(properties.getApiKey())) {
      throw new LlmException("OPENAI_API_KEY가 설정되어 있지 않습니다.");
    }
    if (!StringUtils.hasText(properties.getModel())) {
      throw new LlmException("OPENAI_MODEL이 설정되어 있지 않습니다.");
    }
  }

  private LlmAnalysisResult parseAnalysisResult(String json) {
    try {
      return objectMapper.readValue(json, LlmAnalysisResult.class);
    } catch (JsonProcessingException e) {
      throw new LlmException("OpenAI 분석 응답을 해석할 수 없습니다.", e);
    }
  }

  private LlmCounselingReply parseCounselingReply(String json) {
    try {
      JsonNode reply = objectMapper.readTree(json);
      return new LlmCounselingReply(
          reply.path("content").asText(),
          reply.path("riskLevel").asText("LOW"),
          false,
          reply.path("suggestClose").asBoolean(false)
      );
    } catch (JsonProcessingException e) {
      throw new LlmException("OpenAI 상담 응답을 해석할 수 없습니다.", e);
    }
  }

  private LlmQuestResult parseQuestResult(String json) {
    try {
      return objectMapper.readValue(json, LlmQuestResult.class);
    } catch (JsonProcessingException e) {
      throw new LlmException("OpenAI 퀘스트 응답을 해석할 수 없습니다.", e);
    }
  }

  private LlmCounselingReply generateFallbackReply(List<LlmChatMessage> conversation) {
    String latestUserMessage = conversation.stream()
        .filter(m -> "user".equals(m.role()))
        .map(LlmChatMessage::content)
        .reduce((first, second) -> second)
        .orElse("");
    String normalized = latestUserMessage.toLowerCase(Locale.ROOT);

    if (containsAny(normalized, "자해", "자살", "죽고 싶", "죽고싶", "살기 싫", "살기싫", "목숨", "폭행", "학대", "위협", "죽이겠")) {
      return new LlmCounselingReply(
          "지금 말씀하신 상황은 혼자 버티지 않는 것이 가장 중요해요. 즉각적인 위험이 있다면 112나 119에 연락하고, 가능하면 지금 곁에 와줄 수 있는 신뢰하는 사람에게 바로 알려주세요. 현재 혼자 계신가요?",
          "HIGH", true, false
      );
    }
    if (containsAny(normalized, "불안", "공황", "숨이", "무서", "두려", "괴로")) {
      return new LlmCounselingReply(
          "지금 불안하고 버거운 마음이 크게 느껴지는 것 같아요. 우선 발바닥이 바닥에 닿는 감각을 느끼며 천천히 한 번 숨을 내쉬어보세요. 지금 가장 크게 걱정되는 한 가지는 무엇인가요?",
          "MEDIUM", true, false
      );
    }
    boolean suggestClose = containsAny(normalized, "고마워", "감사", "도움이 됐", "나아진 것 같", "다 말한 것 같", "괜찮아진");
    String content = suggestClose
        ? "오늘 힘드신 마음을 용기 있게 꺼내주셨어요. 많이 지치셨을 텐데 이야기 나눠줘서 고마워요. 오늘 대화를 여기서 마무리하는 건 어떨까요?"
        : "많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?";
    return new LlmCounselingReply(content, "LOW", true, suggestClose);
  }

  private boolean containsAny(String content, String... keywords) {
    for (String kw : keywords) {
      if (content.contains(kw)) return true;
    }
    return false;
  }

  private String analysisSystemPrompt() {
    return """
        당신은 Re-Route 앱의 한국어 상담 대화를 분석해 회복 유형을 정확히 하나로 분류하는 어시스턴트입니다.

        이 결과는 의학적 진단이 아닙니다. 대화에서 관찰되는 일시적인 경향으로만 다루고,
        summary, reason, emotionKeywords는 모두 조심스럽고 지지적인 한국어로 작성하세요.

        회복 유형:
        - AVOIDANT: 회피형. 감정, 과제, 문제를 마주하기보다 피하거나 미루는 경향.
        - OVERFOCUSED: 과몰입형. 걱정, 목표, 사람, 생각의 고리에서 빠져나오기 어려운 경향.
        - LETHARGIC: 무기력형. 에너지와 동기가 낮고 시작이 어려운 경향.
        - RELATION_ANXIOUS: 관계불안형. 거절, 거리감, 답장, 인정에 민감한 경향.
        - PERFECTIONIST: 완벽주의형. 높은 기준이나 실수에 대한 두려움 때문에 행동이 막히는 경향.

        반드시 다음 JSON 형식으로만 반환하세요 (다른 텍스트 없이):
        {
          "recoveryType": "AVOIDANT|OVERFOCUSED|LETHARGIC|RELATION_ANXIOUS|PERFECTIONIST 중 하나",
          "confidence": 0.0~1.0 사이의 숫자,
          "summary": "분석 요약 (한국어)",
          "reason": "분류 이유 (한국어)",
          "emotionKeywords": ["키워드1", "키워드2", ...]
        }
        """;
  }

  private String counselingSystemPrompt(RecoveryType primaryType) {
    String typeHint = primaryType != null
        ? "\n사용자의 현재 회복 유형: " + primaryType.getDisplayName() + " (" + primaryType.name() + ")\n"
          + "→ " + primaryType.getDescription() + "\n"
          + "이 경향을 참고해 답변의 방향을 조율하되, 사용자를 이 유형으로 단정하지 마세요.\n"
        : "";

    return "당신은 Re-Route 앱의 따뜻하고 지지적인 한국어 상담 어시스턴트입니다."
        + typeHint + """

        === 답변 전, 전체 대화를 읽고 현재 단계를 스스로 판단하세요 ===

        【경청 단계】아래 신호가 보이면 이 단계입니다:
        - 사용자가 감정이나 상황을 처음 꺼내는 중
        - 아직 핵심 감정이 충분히 드러나지 않았거나 발화가 무겁고 정리되지 않은 느낌
        → 사용자의 표현을 그대로 반영(mirroring)하세요. "~하셨군요", "~한 마음이 드셨을 것 같아요"처럼 되돌려주세요.
           해결책이나 행동 제안을 절대 하지 마세요. 부드러운 열린 질문 1개로 마무리하세요.
           suggestClose = false

        【전환 단계】아래 신호가 보이면 이 단계입니다:
        - 핵심 감정이나 문제가 충분히 드러난 상태
        - 이야기를 어느 정도 털어놨지만 아직 무거움, 또는 "어떻게 해야 할지 모르겠다"는 뉘앙스
        → 감정을 인정하고 정상화(normalization)하세요. 예: "그런 상황에서 그렇게 느끼는 건 자연스러운 일이에요."
           지금 바로 할 수 있는 아주 작은 행동 1개만 제안하세요 (5분 이내).
           suggestClose = false

        【마무리 단계】아래 신호 중 하나라도 보이면 마무리를 제안하세요:
        - 사용자가 감사 표현("고마워요", "도움이 됐어요" 등)
        - 안도감이나 가벼워진 느낌("다 말한 것 같아요", "좀 나아진 것 같아요", "괜찮아진 것 같아요")
        - 발화가 짧아지고 감정 강도가 낮아짐
        - 반복되던 무거운 주제에서 자연스럽게 벗어남
        → 오늘 나눈 이야기를 따뜻하게 요약하고, 사용자가 용기 있게 이야기해준 것을 인정하며 마무리를 제안하세요.
           suggestClose = true
        단, 새로운 무거운 주제가 등장하거나 감정이 다시 격해지면 suggestClose = false를 유지하세요.

        === 공통 규칙 ===
        - 항상 한국어로 답변하세요.
        - 의학적 진단, 약물, 처방을 언급하지 마세요.
        - 사용자를 고정된 유형의 사람처럼 단정하지 마세요.
        - 사용자가 자해, 자살, 학대, 즉각적인 위험을 언급하면 riskLevel을 HIGH로 설정하고,
          112 또는 119, 혹은 신뢰할 수 있는 사람에게 즉시 도움을 요청하도록 안내하세요.
        - riskLevel이 HIGH이면 suggestClose = false로 유지하고 즉각적인 안전 확보를 우선하세요.

        반드시 다음 JSON 형식으로만 반환하세요 (다른 텍스트 없이):
        {
          "content": "상담 답변 텍스트",
          "riskLevel": "LOW|MEDIUM|HIGH 중 하나",
          "suggestClose": true 또는 false
        }
        """;
  }

  private String questSystemPrompt(RecoveryType recoveryType) {
    return """
        당신은 Re-Route 앱의 마이크로 퀘스트 생성 어시스턴트입니다.
        상담 대화와 회복 유형을 바탕으로 개인화된 마이크로 퀘스트 하나를 만들어주세요.

        회복 유형: %s (%s)
        유형 설명: %s

        퀘스트 설계 규칙:
        - 5~20분 안에 완료할 수 있는 아주 작은 행동이어야 합니다.
        - 이 회복 유형의 핵심 패턴을 부드럽게 건드리는 과제를 설계하세요.
        - background는 "상담에서 ~라고 하셨어요..." 처럼 대화 내용을 자연스럽게 참조하세요.
        - why는 왜 이 퀘스트가 도움이 되는지 1~2문장으로 설명하세요.
        - steps는 3개 내외로 구체적인 행동 단계를 적어주세요.
        - tips는 2~3개로 실천을 도와주는 팁을 적어주세요.
        - difficulty는 1(쉬움), 2(보통), 3(도전적) 중 하나로 설정하세요.
        - estimatedMinutes는 5~20 사이 정수로 설정하세요.
        - 모든 텍스트는 한국어로 작성하세요.

        반드시 다음 JSON 형식으로만 반환하세요 (다른 텍스트 없이):
        {
          "title": "퀘스트 제목",
          "background": "배경 설명",
          "why": "이유 설명",
          "steps": ["단계1", "단계2", "단계3"],
          "tips": ["팁1", "팁2"],
          "estimatedMinutes": 10,
          "difficulty": 1
        }
        """.formatted(
            recoveryType.getDisplayName(),
            recoveryType.name(),
            recoveryType.getDescription()
        );
  }
}
