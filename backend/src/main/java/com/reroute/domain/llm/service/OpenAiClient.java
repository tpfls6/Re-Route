package com.reroute.domain.llm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.llm.config.OpenAiProperties;
import com.reroute.domain.llm.dto.LlmAnalysisResult;
import com.reroute.domain.llm.dto.LlmCounselingReply;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

  private static final String CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

  private final OpenAiProperties properties;
  private final ObjectMapper objectMapper;

  public LlmAnalysisResult analyzeRecoveryType(String conversation) {
    if (!StringUtils.hasText(properties.getApiKey())) {
      throw new IllegalStateException("OPENAI_API_KEY is not configured");
    }

    Map<String, Object> requestBody = Map.of(
        "model", properties.getModel(),
        "temperature", 0.2,
        "messages", List.of(
            Map.of("role", "system", "content", systemPrompt()),
            Map.of("role", "user", "content", conversation)
        ),
        "response_format", responseFormat()
    );

    String response = RestClient.create()
        .post()
        .uri(CHAT_COMPLETIONS_URL)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer " + properties.getApiKey())
        .body(requestBody)
        .retrieve()
        .body(String.class);

    return parseAnalysisResult(response);
  }

  public LlmCounselingReply generateCounselingReply(String conversation) {
    if (!StringUtils.hasText(properties.getApiKey())) {
      throw new IllegalStateException("OPENAI_API_KEY is not configured");
    }

    Map<String, Object> requestBody = Map.of(
        "model", properties.getModel(),
        "temperature", 0.7,
        "messages", List.of(
            Map.of("role", "system", "content", counselingSystemPrompt()),
            Map.of("role", "user", "content", conversation)
        ),
        "response_format", counselingResponseFormat()
    );

    String response = RestClient.create()
        .post()
        .uri(CHAT_COMPLETIONS_URL)
        .contentType(MediaType.APPLICATION_JSON)
        .header("Authorization", "Bearer " + properties.getApiKey())
        .body(requestBody)
        .retrieve()
        .body(String.class);

    return parseCounselingReply(response);
  }

  private LlmAnalysisResult parseAnalysisResult(String response) {
    try {
      JsonNode root = objectMapper.readTree(response);
      String content = root.path("choices").path(0).path("message").path("content").asText();
      if (!StringUtils.hasText(content)) {
        throw new IllegalStateException("OpenAI response content is empty");
      }
      return objectMapper.readValue(content, LlmAnalysisResult.class);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Failed to parse OpenAI analysis response", e);
    }
  }

  private LlmCounselingReply parseCounselingReply(String response) {
    try {
      JsonNode root = objectMapper.readTree(response);
      String content = root.path("choices").path(0).path("message").path("content").asText();
      if (!StringUtils.hasText(content)) {
        throw new IllegalStateException("OpenAI response content is empty");
      }
      return objectMapper.readValue(content, LlmCounselingReply.class);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Failed to parse OpenAI counseling response", e);
    }
  }

  private String systemPrompt() {
    return """
        You classify a Korean counseling conversation into exactly one recovery type.

        This is not a medical diagnosis. Treat the result only as a temporary tendency observed
        in the conversation. Use careful, supportive wording.

        Recovery types:
        - AVOIDANT: 회피형. Avoids or postpones facing feelings, tasks, or problems.
        - OVERFOCUSED: 과몰입형. Cannot disengage from a concern, goal, person, or thought loop.
        - LETHARGIC: 무기력형. Low energy, low motivation, difficulty starting action.
        - RELATION_ANXIOUS: 관계불안형. Sensitive to rejection, distance, replies, or approval from others.
        - PERFECTIONIST: 완벽주의형. High standards or fear of mistakes blocks action.

        Return only JSON that matches the schema. recoveryType must be one of:
        AVOIDANT, OVERFOCUSED, LETHARGIC, RELATION_ANXIOUS, PERFECTIONIST.
        """;
  }

  private String counselingSystemPrompt() {
    return """
        You are a supportive Korean counseling assistant for the Re-Route app.

        Safety and tone rules:
        - Do not provide a medical diagnosis.
        - Do not say the user is a fixed type of person.
        - Keep the reply warm, brief, and practical.
        - Validate the user's feeling first.
        - Avoid overwhelming advice. Suggest at most one tiny next step.
        - End with one gentle question when helpful.
        - If the user mentions self-harm, suicide, abuse, or immediate danger, set riskLevel to HIGH
          and encourage contacting local emergency services or a trusted person right away.

        Return only JSON that matches the schema.
        """;
  }

  private Map<String, Object> responseFormat() {
    return Map.of(
        "type", "json_schema",
        "json_schema", Map.of(
            "name", "recovery_type_analysis",
            "strict", true,
            "schema", Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                    "recoveryType", Map.of(
                        "type", "string",
                        "enum", List.of("AVOIDANT", "OVERFOCUSED", "LETHARGIC", "RELATION_ANXIOUS", "PERFECTIONIST")
                    ),
                    "confidence", Map.of("type", "number", "minimum", 0, "maximum", 1),
                    "summary", Map.of("type", "string"),
                    "reason", Map.of("type", "string"),
                    "emotionKeywords", Map.of(
                        "type", "array",
                        "items", Map.of("type", "string")
                    )
                ),
                "required", List.of("recoveryType", "confidence", "summary", "reason", "emotionKeywords")
            )
        )
    );
  }

  private Map<String, Object> counselingResponseFormat() {
    return Map.of(
        "type", "json_schema",
        "json_schema", Map.of(
            "name", "counseling_reply",
            "strict", true,
            "schema", Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                    "content", Map.of("type", "string"),
                    "riskLevel", Map.of(
                        "type", "string",
                        "enum", List.of("LOW", "MEDIUM", "HIGH")
                    )
                ),
                "required", List.of("content", "riskLevel")
            )
        )
    );
  }
}
