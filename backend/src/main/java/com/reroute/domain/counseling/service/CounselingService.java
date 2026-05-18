package com.reroute.domain.counseling.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.counseling.dto.CounselingDto;
import com.reroute.domain.counseling.entity.CounselingAnalysis;
import com.reroute.domain.counseling.entity.CounselingMessage;
import com.reroute.domain.counseling.entity.CounselingSession;
import com.reroute.domain.counseling.repository.CounselingAnalysisRepository;
import com.reroute.domain.counseling.repository.CounselingSessionRepository;
import com.reroute.domain.counseling.repository.CounselingMessageRepository;
import com.reroute.domain.llm.dto.LlmAnalysisResult;
import com.reroute.domain.llm.dto.LlmCounselingReply;
import com.reroute.domain.llm.service.OpenAiClient;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CounselingService {

  private final CounselingSessionRepository counselingSessionRepository;
  private final CounselingMessageRepository counselingMessageRepository;
  private final CounselingAnalysisRepository counselingAnalysisRepository;
  private final UserRepository userRepository;
  private final OpenAiClient openAiClient;
  private final ObjectMapper objectMapper;

  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  @Transactional
  public CounselingDto.SessionResponse createSession(Long userId, CounselingDto.CreateSessionRequest req) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

    String title = StringUtils.hasText(req.getTitle()) ? req.getTitle() : "새 상담";
    CounselingSession session = counselingSessionRepository.save(CounselingSession.builder()
        .user(user)
        .title(title)
        .build());

    return toSessionResponse(session);
  }

  public List<CounselingDto.SessionResponse> getSessions(Long userId) {
    return counselingSessionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toSessionResponse)
        .toList();
  }

  @Transactional
  public CounselingDto.MessagePairResponse sendMessage(Long userId, CounselingDto.MessageRequest req) {
    CounselingSession session = getOwnedSession(userId, req.getSessionId());
    if (session.getStatus() != CounselingSession.SessionStatus.IN_PROGRESS) {
      throw new IllegalArgumentException("진행 중인 상담 세션에만 메시지를 보낼 수 있습니다.");
    }

    CounselingMessage userMessage = counselingMessageRepository.save(CounselingMessage.builder()
        .session(session)
        .role(CounselingMessage.MessageRole.USER)
        .content(req.getContent())
        .build());

    List<CounselingMessage> messages = counselingMessageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId());
    LlmCounselingReply reply = openAiClient.generateCounselingReply(buildRecentConversation(messages, 20));

    CounselingMessage assistantMessage = counselingMessageRepository.save(CounselingMessage.builder()
        .session(session)
        .role(CounselingMessage.MessageRole.ASSISTANT)
        .content(reply.content())
        .build());

    return CounselingDto.MessagePairResponse.builder()
        .userMessage(toMessageResponse(userMessage))
        .assistantMessage(toMessageResponse(assistantMessage))
        .riskLevel(reply.riskLevel())
        .build();
  }

  public List<CounselingDto.MessageResponse> getMessages(Long userId, Long sessionId) {
    getOwnedSession(userId, sessionId);
    return counselingMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
        .map(this::toMessageResponse)
        .toList();
  }

  @Transactional
  public CounselingDto.AnalysisResponse completeSession(Long userId, Long sessionId) {
    CounselingSession session = getOwnedSession(userId, sessionId);
    if (session.getStatus() == CounselingSession.SessionStatus.ABANDONED) {
      throw new IllegalArgumentException("중단된 상담 세션은 완료할 수 없습니다.");
    }
    session.complete();
    return analyzeSession(userId, sessionId);
  }

  public CounselingDto.AnalysisResponse getAnalysis(Long userId, Long sessionId) {
    getOwnedSession(userId, sessionId);
    CounselingAnalysis analysis = counselingAnalysisRepository.findBySessionId(sessionId)
        .orElseThrow(() -> new ResourceNotFoundException("상담 분석 결과를 찾을 수 없습니다."));
    return toAnalysisResponse(analysis);
  }

  @Transactional
  public CounselingDto.AnalysisResponse analyzeSession(Long userId, Long sessionId) {
    CounselingSession session = getOwnedSession(userId, sessionId);

    List<CounselingMessage> messages = counselingMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    if (messages.isEmpty()) {
      throw new IllegalArgumentException("분석할 상담 메시지가 없습니다.");
    }

    LlmAnalysisResult result = openAiClient.analyzeRecoveryType(buildConversation(messages));
    String emotionKeywords = writeEmotionKeywords(result.emotionKeywords());

    CounselingAnalysis analysis = counselingAnalysisRepository.findBySessionId(sessionId)
        .map(existing -> {
          existing.updateAnalysis(
              result.recoveryType(),
              result.confidence(),
              result.summary(),
              result.reason(),
              emotionKeywords
          );
          return existing;
        })
        .orElseGet(() -> counselingAnalysisRepository.save(CounselingAnalysis.builder()
            .session(session)
            .recoveryType(result.recoveryType())
            .confidence(result.confidence())
            .summary(result.summary())
            .reason(result.reason())
            .emotionKeywords(emotionKeywords)
            .build()));

    return toAnalysisResponse(analysis);
  }

  private String buildConversation(List<CounselingMessage> messages) {
    return messages.stream()
        .map(message -> message.getRole().name() + ": " + message.getContent())
        .collect(Collectors.joining("\n"));
  }

  private String buildRecentConversation(List<CounselingMessage> messages, int limit) {
    int fromIndex = Math.max(0, messages.size() - limit);
    return buildConversation(messages.subList(fromIndex, messages.size()));
  }

  private String writeEmotionKeywords(List<String> emotionKeywords) {
    try {
      return objectMapper.writeValueAsString(emotionKeywords);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("감정 키워드를 저장할 수 없습니다.", e);
    }
  }

  private List<String> readEmotionKeywords(String emotionKeywords) {
    try {
      return objectMapper.readValue(emotionKeywords, new TypeReference<>() {
      });
    } catch (JsonProcessingException e) {
      return List.of();
    }
  }

  private CounselingDto.AnalysisResponse toAnalysisResponse(CounselingAnalysis analysis) {
    return CounselingDto.AnalysisResponse.builder()
        .id(analysis.getId())
        .sessionId(analysis.getSession().getId())
        .recoveryType(analysis.getRecoveryType())
        .recoveryTypeName(analysis.getRecoveryType().getDisplayName())
        .confidence(analysis.getConfidence())
        .summary(analysis.getSummary())
        .reason(analysis.getReason())
        .emotionKeywords(readEmotionKeywords(analysis.getEmotionKeywords()))
        .build();
  }

  private CounselingSession getOwnedSession(Long userId, Long sessionId) {
    CounselingSession session = counselingSessionRepository.findById(sessionId)
        .orElseThrow(() -> new ResourceNotFoundException("상담 세션을 찾을 수 없습니다."));
    if (!session.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("본인의 상담 세션만 접근할 수 있습니다.");
    }
    return session;
  }

  private CounselingDto.SessionResponse toSessionResponse(CounselingSession session) {
    return CounselingDto.SessionResponse.builder()
        .id(session.getId())
        .title(session.getTitle())
        .status(session.getStatus().name())
        .createdAt(formatDateTime(session.getCreatedAt()))
        .build();
  }

  private CounselingDto.MessageResponse toMessageResponse(CounselingMessage message) {
    return CounselingDto.MessageResponse.builder()
        .id(message.getId())
        .sessionId(message.getSession().getId())
        .role(message.getRole())
        .content(message.getContent())
        .createdAt(formatDateTime(message.getCreatedAt()))
        .build();
  }

  private String formatDateTime(java.time.LocalDateTime dateTime) {
    return dateTime == null ? null : dateTime.format(DATE_TIME_FORMATTER);
  }
}
