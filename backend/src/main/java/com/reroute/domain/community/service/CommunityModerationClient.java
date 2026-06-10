package com.reroute.domain.community.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.community.dto.CommunityModerationDecision;
import com.reroute.domain.llm.config.LlmProperties;
import com.reroute.domain.llm.exception.LlmException;
import com.reroute.domain.llm.service.LlmClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class CommunityModerationClient {

  private static final Pattern PHONE = Pattern.compile("(?<!\\d)01[016789][\\s.-]?\\d{3,4}[\\s.-]?\\d{4}(?!\\d)");
  private static final Pattern EMAIL = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  private static final Pattern RESIDENT_NUMBER = Pattern.compile("(?<!\\d)\\d{6}[\\s-]?[1-4]\\d{6}(?!\\d)");
  private static final Pattern DETAILED_ADDRESS = Pattern.compile(
      "(?:[가-힣]+(?:로|길|대로)\\s*\\d+(?:-\\d+)?|[가-힣]+(?:동|읍|면)\\s*\\d+(?:-\\d+)?)"
  );
  private static final List<String> OBFUSCATED_ABUSE_TERMS = List.of(
      "시발", "씨발", "ㅅㅂ", "병신", "ㅂㅅ", "개새끼", "새끼야", "꺼져", "닥쳐",
      "죽여버", "죽여줄", "죽어라", "강간", "성희롱"
  );
  private static final List<String> SELF_HARM_TERMS = List.of(
      "자해", "자살", "죽고싶", "죽고 싶", "살기싫", "살기 싫", "목숨을 끊"
  );

  private final LlmClient llmClient;
  private final LlmProperties llmProperties;
  private final ObjectMapper objectMapper;

  public CommunityModerationDecision moderate(Long userId, String content) {
    if (!StringUtils.hasText(content)) {
      return CommunityModerationDecision.allowed();
    }

    Set<String> localSignals = detectLocalSignals(content);
    if (localSignals.contains("PERSONAL_INFORMATION")) {
      return new CommunityModerationDecision(
          true,
          false,
          "전화번호, 이메일, 주민등록번호 또는 상세 주소 등 개인정보는 게시할 수 없습니다.",
          List.copyOf(localSignals)
      );
    }

    try {
      return callContextClassifier(content, localSignals);
    } catch (LlmException e) {
      if (!llmProperties.isFallbackEnabled()) {
        throw e;
      }
      return fallbackDecision(content, localSignals);
    }
  }

  private CommunityModerationDecision callContextClassifier(String content, Set<String> detectedSignals) {
    String userMessage = """
        검사할 커뮤니티 내용:
        %s

        사전 탐지 신호:
        %s
        """.formatted(content, detectedSignals.isEmpty() ? "없음" : String.join(", ", detectedSignals));

    String json = llmClient.complete(moderationSystemPrompt(), userMessage, 0.0);
    try {
      JsonNode decision = objectMapper.readTree(json);
      List<String> categories = new ArrayList<>();
      decision.path("categories").forEach(category -> categories.add(category.asText()));
      return new CommunityModerationDecision(
          decision.path("blocked").asBoolean(),
          decision.path("selfHarmRisk").asBoolean(),
          decision.path("reason").asText("커뮤니티 안전 정책에 따른 판정입니다."),
          categories
      );
    } catch (JsonProcessingException e) {
      throw new LlmException("커뮤니티 문맥 검사 결과를 해석할 수 없습니다.", e);
    }
  }

  private CommunityModerationDecision fallbackDecision(String content, Set<String> localSignals) {
    boolean selfHarmRisk = containsAny(content.toLowerCase(Locale.ROOT), SELF_HARM_TERMS);
    boolean blocked = localSignals.contains("OBFUSCATED_ABUSE");
    String reason = blocked
        ? "욕설, 모욕 또는 위협으로 의심되는 표현이 포함되어 있습니다. 표현을 수정해주세요."
        : selfHarmRisk
            ? "위험 신호가 감지되어 도움 안내를 함께 제공합니다."
            : "AI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.";
    return new CommunityModerationDecision(blocked, selfHarmRisk, reason, List.copyOf(localSignals));
  }

  private Set<String> detectLocalSignals(String content) {
    Set<String> signals = new LinkedHashSet<>();
    if (PHONE.matcher(content).find()
        || EMAIL.matcher(content).find()
        || RESIDENT_NUMBER.matcher(content).find()
        || DETAILED_ADDRESS.matcher(content).find()) {
      signals.add("PERSONAL_INFORMATION");
    }

    String normalized = content.toLowerCase(Locale.ROOT)
        .replaceAll("[^0-9a-z가-힣ㄱ-ㅎㅏ-ㅣ]", "");
    if (OBFUSCATED_ABUSE_TERMS.stream()
        .map(term -> term.replaceAll("\\s+", ""))
        .anyMatch(normalized::contains)) {
      signals.add("OBFUSCATED_ABUSE");
    }
    if (containsAny(content.toLowerCase(Locale.ROOT), SELF_HARM_TERMS)) {
      signals.add("SELF_HARM_CONTEXT");
    }
    return signals;
  }

  private boolean containsAny(String content, List<String> keywords) {
    return keywords.stream().anyMatch(content::contains);
  }

  private String moderationSystemPrompt() {
    return """
        당신은 Re-Route 한국어 커뮤니티의 안전 문맥 판정기입니다.
        입력 내용이 커뮤니티에 등록 가능한지 다음 정책으로 판정하세요.

        차단:
        - 특정 사람이나 집단을 향한 욕설, 모욕, 괴롭힘, 혐오 또는 차별
        - 상대방을 향한 성희롱, 성적 대상화, 음란한 요구
        - 타인을 향한 폭력 위협, 협박, 범죄 실행 지시·조장·모집
        - 타인의 개인정보 공개, 신상 털기, 불법 행위를 돕는 구체적 방법
        - 자해나 자살을 부추기거나 구체적인 방법을 제공하는 내용

        허용:
        - 본인이 겪은 욕설, 차별, 성희롱, 폭력, 범죄 피해 경험을 도움받기 위해 설명하는 내용
        - 자신의 감정이나 자해·자살 충동을 털어놓으며 도움을 요청하는 내용
        - 비방 목적이 아닌 인용, 뉴스·교육·상담 목적의 설명

        selfHarmRisk는 작성자가 현재 자해·자살 의도나 충동을 표현하는 경우 true입니다.
        피해 경험 서술에 욕설이나 폭력 단어가 포함되었다는 이유만으로 차단하지 마세요.
        반대로 초성, 띄어쓰기, 특수문자로 우회한 공격 표현도 실제 의미를 기준으로 판정하세요.
        reason은 사용자에게 보여줄 짧고 정중한 한국어 수정 안내로 작성하세요.

        반드시 다음 JSON 형식으로만 반환하세요 (다른 텍스트 없이):
        {
          "blocked": true 또는 false,
          "selfHarmRisk": true 또는 false,
          "reason": "판정 이유 (한국어)",
          "categories": ["카테고리1", ...]
        }
        """;
  }
}
