package com.reroute.domain.counseling.dto;

import com.reroute.domain.actionitem.dto.ActionItemDto;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.counseling.entity.CounselingMessage;
import com.reroute.domain.quest.dto.UserQuestDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class CounselingDto {

  @Getter
  @Schema(description = "상담 세션 생성 요청")
  public static class CreateSessionRequest {
    @Size(max = 200, message = "상담 제목은 200자 이하로 입력해주세요.")
    @Schema(description = "상담 제목. 비우면 기본 제목이 사용됩니다.", example = "오늘의 상담")
    private String title;
  }

  @Getter
  @Schema(description = "상담 메시지 전송 요청")
  public static class MessageRequest {
    @NotNull(message = "sessionId는 필수입니다.")
    @Schema(description = "상담 세션 ID", example = "1")
    private Long sessionId;

    @NotBlank(message = "메시지 내용은 필수입니다.")
    @Size(max = 4000, message = "메시지는 4000자 이하로 입력해주세요.")
    @Schema(description = "사용자 메시지", example = "요즘 아무것도 하기 싫고 계속 누워만 있어요.")
    private String content;
  }

  @Getter
  @Builder
  @Schema(description = "상담 세션 응답")
  public static class SessionResponse {
    @Schema(description = "상담 세션 ID", example = "1")
    private Long id;

    @Schema(description = "상담 제목", example = "오늘의 상담")
    private String title;

    @Schema(description = "상담 상태", example = "IN_PROGRESS")
    private String status;

    @Schema(description = "생성 시각")
    private String createdAt;
  }

  @Getter
  @Builder
  @Schema(description = "상담 메시지 응답")
  public static class MessageResponse {
    @Schema(description = "메시지 ID", example = "1")
    private Long id;

    @Schema(description = "상담 세션 ID", example = "1")
    private Long sessionId;

    @Schema(description = "메시지 역할", example = "USER")
    private CounselingMessage.MessageRole role;

    @Schema(description = "메시지 내용")
    private String content;

    @Schema(description = "생성 시각")
    private String createdAt;
  }

  @Getter
  @Builder
  @Schema(description = "상담 메시지 전송 응답")
  public static class MessagePairResponse {
    private MessageResponse userMessage;
    private MessageResponse assistantMessage;

    @Schema(description = "위험도", example = "LOW")
    private String riskLevel;

    @Schema(description = "OpenAI 호출 실패로 로컬 안전 응답을 사용했는지 여부", example = "false")
    private boolean fallback;

    @Schema(description = "AI가 세션 마무리를 제안하는지 여부. true이면 프론트엔드에서 상담 종료 UI를 표시하세요.", example = "false")
    private boolean suggestClose;
  }

  @Getter
  @Builder
  @Schema(description = "상담 세션 GPT 분석 응답")
  public static class AnalysisResponse {
    @Schema(description = "분석 ID", example = "1")
    private Long id;

    @Schema(description = "상담 세션 ID", example = "10")
    private Long sessionId;

    @Schema(description = "분류된 회복 유형", example = "LETHARGIC")
    private RecoveryType recoveryType;

    @Schema(description = "회복 유형 한국어 이름", example = "무기력형")
    private String recoveryTypeName;

    @Schema(description = "분류 신뢰도. 0부터 1 사이 값", example = "0.84")
    private Double confidence;

    @Schema(description = "상담 대화 요약")
    private String summary;

    @Schema(description = "해당 유형으로 분류한 이유")
    private String reason;

    @Schema(description = "대화에서 관찰된 감정 키워드")
    private List<String> emotionKeywords;

    @Schema(description = "이번 세션 회복 유형 기반 추천 액션아이템")
    private List<ActionItemDto.Response> recommendedActionItems;

    @Schema(description = "이번 상담 내용 기반으로 Gemini가 생성한 맞춤 퀘스트")
    private UserQuestDto.Detail generatedQuest;
  }
}
