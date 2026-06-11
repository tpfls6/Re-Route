package com.reroute.domain.llm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.llm.config.GeminiProperties;
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
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "llm.provider", havingValue = "gemini", matchIfMissing = true)
@RequiredArgsConstructor
public class GeminiClient implements LlmClient {

  private static final String GENERATE_CONTENT_PATH =
      "/v1beta/models/{model}:generateContent?key={apiKey}";

  private final GeminiProperties properties;
  private final ObjectMapper objectMapper;

  public LlmAnalysisResult analyzeRecoveryType(Long userId, List<LlmChatMessage> conversation) {
    validateConfiguration();

    Map<String, Object> requestBody = Map.of(
        "systemInstruction", textContent(systemPrompt()),
        "contents", buildContents(conversation),
        "generationConfig", generationConfig(0.2, responseSchema())
    );

    String response = generateContent(requestBody);
    return parseAnalysisResult(response);
  }

  public LlmCounselingReply generateCounselingReply(Long userId, List<LlmChatMessage> conversation, RecoveryType primaryType) {
    try {
      validateConfiguration();

      Map<String, Object> requestBody = Map.of(
          "systemInstruction", textContent(counselingSystemPrompt(primaryType)),
          "contents", buildContents(conversation),
          "generationConfig", generationConfig(0.7, counselingResponseSchema())
      );

      String response = generateContent(requestBody);
      return parseCounselingReply(response);
    } catch (LlmException e) {
      if (!properties.isFallbackEnabled()) {
        throw e;
      }
      return generateFallbackReply(conversation);
    }
  }

  private String generateContent(Map<String, Object> requestBody) {
    try {
      return restClient()
        .post()
        .uri(GENERATE_CONTENT_PATH, properties.getModel(), properties.getApiKey())
        .contentType(MediaType.APPLICATION_JSON)
        .body(requestBody)
        .retrieve()
        .body(String.class);
    } catch (RestClientResponseException e) {
      if (e.getStatusCode().value() == HttpStatus.UNAUTHORIZED.value()) {
        throw new LlmException("GEMINI_API_KEY가 유효하지 않습니다.", e);
      }
      if (e.getStatusCode().value() == HttpStatus.TOO_MANY_REQUESTS.value()) {
        throw new LlmException("Gemini API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.", e);
      }
      if (e.getStatusCode().value() == HttpStatus.BAD_REQUEST.value()) {
        throw new LlmException("Gemini API 요청 설정이 올바르지 않습니다.", e);
      }
      throw new LlmException("Gemini API 호출에 실패했습니다.", e);
    } catch (ResourceAccessException e) {
      throw new LlmException("Gemini API에 연결할 수 없습니다.", e);
    }
  }

  private LlmCounselingReply generateFallbackReply(List<LlmChatMessage> conversation) {
    String latestUserMessage = conversation.stream()
        .filter(message -> "user".equals(message.role()))
        .map(LlmChatMessage::content)
        .reduce((first, second) -> second)
        .orElse("");
    String normalized = latestUserMessage.toLowerCase(Locale.ROOT);

    if (containsAny(normalized, "자해", "자살", "죽고 싶", "죽고싶", "살기 싫", "살기싫",
        "목숨", "폭행", "학대", "위협", "죽이겠")) {
      return new LlmCounselingReply(
          "지금 말씀하신 상황은 혼자 버티지 않는 것이 가장 중요해요. 즉각적인 위험이 있다면 112나 119에 연락하고, 가능하면 지금 곁에 와줄 수 있는 신뢰하는 사람에게 바로 알려주세요. 현재 혼자 계신가요?",
          "HIGH", true, false
      );
    }

    if (containsAny(normalized, "불안", "공황", "숨이", "무서", "두려", "괴로")) {
      return new LlmCounselingReply(
          "지금 불안하고 버거운 마음이 크게 느껴지는 것 같아요. 불안이 올라올 때 도움이 되는 방법 하나를 먼저 드릴게요. 발바닥이 바닥에 닿는 감각을 느끼며 '4초 들숨, 4초 날숨'으로 두 번만 천천히 숨을 쉬어보세요. 몸이 조금 가라앉으면 생각도 조금 정리돼요. 지금 가장 크게 걱정되는 한 가지는 무엇인가요?",
          "MEDIUM", true, false
      );
    }

    boolean suggestClose = containsAny(normalized, "고마워", "감사", "도움이 됐", "나아진 것 같", "다 말한 것 같", "괜찮아진");
    String content = suggestClose
        ? "오늘 힘드신 마음을 용기 있게 꺼내주셨어요. 많이 지치셨을 텐데 이야기 나눠줘서 고마워요. 오늘 대화를 여기서 마무리하는 건 어떨까요?"
        : "많이 지치고 마음을 움직이기 어려운 상태로 들려요. 이럴 때는 '해야 하는 일'보다 '5분 안에 할 수 있는 아주 작은 것' 하나에만 집중하는 게 도움이 돼요. 예를 들어 물 한 잔 마시기, 창문 열기처럼 아무것도 아닌 것처럼 느껴지는 행동이요. 오늘 특히 힘들게 만든 게 뭔지 조금 더 이야기해줄 수 있어요?";
    return new LlmCounselingReply(content, "LOW", true, suggestClose);
  }

  private boolean containsAny(String content, String... keywords) {
    for (String keyword : keywords) {
      if (content.contains(keyword)) {
        return true;
      }
    }
    return false;
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
      throw new LlmException("GEMINI_API_KEY가 설정되어 있지 않습니다.");
    }
    if (!StringUtils.hasText(properties.getModel())) {
      throw new LlmException("GEMINI_MODEL이 설정되어 있지 않습니다.");
    }
  }

  private List<Map<String, Object>> buildContents(List<LlmChatMessage> conversation) {
    List<Map<String, Object>> contents = new ArrayList<>();
    conversation.stream()
        .filter(message -> StringUtils.hasText(message.content()))
        .forEach(message -> contents.add(Map.of(
            "role", "assistant".equals(message.role()) ? "model" : "user",
            "parts", List.of(Map.of("text", message.content()))
        )));
    return contents;
  }

  private Map<String, Object> textContent(String text) {
    return Map.of("parts", List.of(Map.of("text", text)));
  }

  private Map<String, Object> generationConfig(double temperature, Map<String, Object> schema) {
    return Map.of(
        "temperature", temperature,
        "responseMimeType", "application/json",
        "responseSchema", schema
    );
  }

  private JsonNode responseCandidate(String response) throws JsonProcessingException {
    JsonNode candidate = objectMapper.readTree(response).path("candidates").path(0);
    String finishReason = candidate.path("finishReason").asText();
    if ("SAFETY".equals(finishReason) || "BLOCKLIST".equals(finishReason)
        || "PROHIBITED_CONTENT".equals(finishReason)) {
      throw new LlmException("Gemini가 안전 정책에 따라 응답을 생성하지 않았습니다.");
    }
    return candidate;
  }

  private LlmAnalysisResult parseAnalysisResult(String response) {
    try {
      String content = responseCandidate(response)
          .path("content").path("parts").path(0).path("text").asText();
      if (!StringUtils.hasText(content)) {
        throw new LlmException("Gemini 분석 응답이 비어 있습니다.");
      }
      return objectMapper.readValue(content, LlmAnalysisResult.class);
    } catch (JsonProcessingException e) {
      throw new LlmException("Gemini 분석 응답을 해석할 수 없습니다.", e);
    }
  }

  private LlmCounselingReply parseCounselingReply(String response) {
    try {
      String content = responseCandidate(response)
          .path("content").path("parts").path(0).path("text").asText();
      if (!StringUtils.hasText(content)) {
        throw new LlmException("Gemini 상담 응답이 비어 있습니다.");
      }
      JsonNode reply = objectMapper.readTree(content);
      return new LlmCounselingReply(
          reply.path("content").asText(),
          reply.path("riskLevel").asText("LOW"),
          false,
          reply.path("suggestClose").asBoolean(false)
      );
    } catch (JsonProcessingException e) {
      throw new LlmException("Gemini 상담 응답을 해석할 수 없습니다.", e);
    }
  }

  private String systemPrompt() {
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

        sessionTitle은 이 상담의 핵심 주제를 요약한 짧은 제목입니다.
        - 10자 이내, 2~4단어로 작성하세요. 예: "직장 스트레스", "관계 피로감", "무기력한 오늘"
        - 마침표나 특수문자 없이 명사구로 작성하세요.

        반드시 스키마에 맞는 JSON만 반환하세요. recoveryType은 아래 값 중 하나여야 합니다:
        AVOIDANT, OVERFOCUSED, LETHARGIC, RELATION_ANXIOUS, PERFECTIONIST.
        """;
  }

  private String counselingSystemPrompt(RecoveryType primaryType) {
    String typeHint = primaryType != null
        ? "\n사용자의 현재 회복 유형: " + primaryType.getDisplayName() + " (" + primaryType.name() + ")\n"
          + "→ " + primaryType.getDescription() + "\n"
          + "이 경향에 맞는 구체적인 관점이나 전략을 자연스럽게 제안하되, 사용자를 이 유형으로 단정하지 마세요.\n"
        : "";

    return "당신은 Re-Route 앱의 따뜻하고 능동적인 한국어 상담 어시스턴트입니다. "
        + "공감과 경청은 기본이고, 적절한 타이밍에 구체적인 관점·전략·행동을 스스로 먼저 제안하는 것이 당신의 역할입니다."
        + typeHint + """

        === 답변 전, 전체 대화를 읽고 현재 단계를 스스로 판단하세요 ===

        【경청 단계】아래 신호가 보이면 이 단계입니다:
        - 사용자가 감정이나 상황을 처음 꺼내는 중
        - 아직 핵심 감정이 충분히 드러나지 않은 느낌
        → ① 사용자의 감정을 먼저 반영하세요. "~하셨군요", "~한 마음이 크게 느껴지셨을 것 같아요."
           ② 그 다음, 비슷한 상황에서 사람들이 흔히 겪는 점을 짧게 정상화(normalization)하거나,
              상황을 다르게 볼 수 있는 관점 한 가지를 먼저 건네세요. (강요하지 말고, "이런 시각도 있어요" 식으로)
           ③ 열린 질문 1개로 마무리하세요.
           suggestClose = false

        【제안 단계】아래 신호가 보이면 이 단계입니다:
        - 핵심 감정이나 문제가 충분히 드러난 상태
        - "어떻게 해야 할지 모르겠다", "뭔가 해보고 싶은데" 같은 뉘앙스
        - 같은 고민을 2회 이상 반복하는 경우
        → ① 감정을 인정하고 정상화하세요.
           ② 지금 당장 해볼 수 있는 구체적인 행동이나 전략을 1~2가지 먼저 제안하세요.
              예: "오늘 딱 5분만 ~를 해보시는 건 어떨까요?", "~라고 스스로에게 말해보는 방법도 있어요."
           ③ 제안 후 사용자의 반응을 살피는 짧은 질문으로 마무리하세요.
           suggestClose = false

        【마무리 단계】아래 신호 중 하나라도 보이면 마무리를 제안하세요:
        - 사용자가 감사 표현("고마워요", "도움이 됐어요" 등)
        - 안도감이나 가벼워진 느낌("다 말한 것 같아요", "좀 나아진 것 같아요")
        - 발화가 짧아지고 감정 강도가 낮아짐
        → 오늘 나눈 이야기를 따뜻하게 요약하고, 대화를 마무리하자고 제안하세요.
           suggestClose = true
        단, 새로운 무거운 주제가 등장하거나 감정이 다시 격해지면 suggestClose = false를 유지하세요.

        === 공통 규칙 ===
        - 항상 한국어로 답변하세요.
        - 질문만 하지 마세요. 매 답변마다 관점·전략·행동 중 하나를 먼저 제시한 뒤 질문하세요.
        - 의학적 진단, 약물, 처방을 언급하지 마세요.
        - 사용자를 고정된 유형의 사람처럼 단정하지 마세요.
        - 사용자가 자해, 자살, 학대, 즉각적인 위험을 언급하면 riskLevel을 HIGH로 설정하고,
          112 또는 119, 혹은 신뢰할 수 있는 사람에게 즉시 도움을 요청하도록 안내하세요.
        - riskLevel이 HIGH이면 suggestClose = false로 유지하고 즉각적인 안전 확보를 우선하세요.

        반드시 스키마에 맞는 JSON만 반환하세요.
        """;
  }

  private Map<String, Object> responseSchema() {
    return Map.of(
        "type", "OBJECT",
        "properties", Map.of(
            "recoveryType", Map.of(
                "type", "STRING",
                "enum", List.of("AVOIDANT", "OVERFOCUSED", "LETHARGIC", "RELATION_ANXIOUS", "PERFECTIONIST")
            ),
            "confidence", Map.of("type", "NUMBER", "minimum", 0, "maximum", 1),
            "summary", Map.of("type", "STRING"),
            "reason", Map.of("type", "STRING"),
            "emotionKeywords", Map.of(
                "type", "ARRAY",
                "items", Map.of("type", "STRING")
            ),
            "sessionTitle", Map.of("type", "STRING")
        ),
        "required", List.of("recoveryType", "confidence", "summary", "reason", "emotionKeywords", "sessionTitle")
    );
  }

  private Map<String, Object> counselingResponseSchema() {
    return Map.of(
        "type", "OBJECT",
        "properties", Map.of(
            "content", Map.of("type", "STRING"),
            "riskLevel", Map.of(
                "type", "STRING",
                "enum", List.of("LOW", "MEDIUM", "HIGH")
            ),
            "suggestClose", Map.of("type", "BOOLEAN")
        ),
        "required", List.of("content", "riskLevel", "suggestClose")
    );
  }

  public LlmQuestResult generateQuest(List<LlmChatMessage> conversation, RecoveryType recoveryType, String analysisSummary) {
    validateConfiguration();

    Map<String, Object> requestBody = Map.of(
        "systemInstruction", textContent(questSystemPrompt(recoveryType)),
        "contents", buildContents(conversation),
        "generationConfig", generationConfig(0.7, questResponseSchema())
    );

    String response = generateContent(requestBody);
    return parseQuestResult(response);
  }

  @Override
  public String complete(String systemPrompt, String userMessage, double temperature) {
    validateConfiguration();

    Map<String, Object> requestBody = Map.of(
        "systemInstruction", textContent(systemPrompt),
        "contents", List.of(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", userMessage))
        )),
        "generationConfig", Map.of(
            "temperature", temperature,
            "responseMimeType", "application/json"
        )
    );

    String response = generateContent(requestBody);
    try {
      String content = responseCandidate(response)
          .path("content").path("parts").path(0).path("text").asText();
      if (!StringUtils.hasText(content)) {
        throw new LlmException("Gemini 응답이 비어 있습니다.");
      }
      return content;
    } catch (JsonProcessingException e) {
      throw new LlmException("Gemini 응답을 해석할 수 없습니다.", e);
    }
  }

  @Override
  public String completeWithHistory(String systemPrompt, List<LlmChatMessage> history, double temperature) {
    // Gemini는 현재 미사용 — OpenAI 전환 후 필요 시 구현
    throw new LlmException("completeWithHistory는 OpenAI 클라이언트에서만 지원됩니다.");
  }

  private LlmQuestResult parseQuestResult(String response) {
    try {
      String content = responseCandidate(response)
          .path("content").path("parts").path(0).path("text").asText();
      if (!StringUtils.hasText(content)) {
        throw new LlmException("Gemini 퀘스트 응답이 비어 있습니다.");
      }
      return objectMapper.readValue(content, LlmQuestResult.class);
    } catch (JsonProcessingException e) {
      throw new LlmException("Gemini 퀘스트 응답을 해석할 수 없습니다.", e);
    }
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

        반드시 스키마에 맞는 JSON만 반환하세요.
        """.formatted(
            recoveryType.getDisplayName(),
            recoveryType.name(),
            recoveryType.getDescription()
        );
  }

  private Map<String, Object> questResponseSchema() {
    return Map.of(
        "type", "OBJECT",
        "properties", Map.of(
            "title", Map.of("type", "STRING"),
            "background", Map.of("type", "STRING"),
            "why", Map.of("type", "STRING"),
            "steps", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")),
            "tips", Map.of("type", "ARRAY", "items", Map.of("type", "STRING")),
            "estimatedMinutes", Map.of("type", "INTEGER"),
            "difficulty", Map.of("type", "INTEGER")
        ),
        "required", List.of("title", "background", "why", "steps", "tips", "estimatedMinutes", "difficulty")
    );
  }
}
