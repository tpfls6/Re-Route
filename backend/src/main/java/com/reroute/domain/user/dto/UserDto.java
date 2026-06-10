package com.reroute.domain.user.dto;

import com.reroute.domain.common.RecoveryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class UserDto {

  @Getter
  @Builder
  public static class RegisterRequest {
    private String email;
    private String password;
    private String nickname;
  }

  @Getter
  @Builder
  public static class LoginRequest {
    private String email;
    private String password;
  }

  @Getter
  @Builder
  @Schema(description = "사용자 정보 응답")
  public static class Response {
    private Long id;
    private String email;
    private String nickname;

    @Schema(description = "온보딩 완료 여부")
    private boolean onboardingCompleted;

    @Schema(description = "온보딩에서 분류된 회복 유형", example = "AVOIDANT")
    private RecoveryType primaryRecoveryType;

    @Schema(description = "회복 유형 한국어 이름", example = "회피형")
    private String primaryRecoveryTypeName;
  }

  @Getter
  public static class MyPageUpdateRequest {
    @Size(max = 50, message = "닉네임은 50자 이하로 입력해주세요.")
    private String nickname;

    @NotBlank(message = "이메일 인증코드는 필수입니다.")
    private String emailVerificationCode;

    private String currentPassword;

    @Size(min = 8, max = 100, message = "새 비밀번호는 8자 이상 100자 이하로 입력해주세요.")
    private String newPassword;

    private String newPasswordConfirm;
  }

  @Getter
  @Schema(description = "온보딩 질문지 응답 요청")
  public static class OnboardingRequest {
    @NotNull(message = "응답 목록은 필수입니다.")
    @Size(min = 10, max = 10, message = "10개의 응답이 필요합니다.")
    @Schema(description = "각 질문에 대한 응답 (1~5점, 10개)", example = "[4,2,3,5,1,3,2,4,5,2]")
    private List<@Min(1) @Max(5) Integer> answers;
  }

  @Getter
  @Builder
  @Schema(description = "사용자 통계 응답")
  public static class StatsResponse {
    @Schema(description = "완료한 퀘스트 수")
    private int questsCompleted;

    @Schema(description = "완료한 액션 아이템 수")
    private int actionItemsCompleted;

    @Schema(description = "연속 실천 일수")
    private int streakDays;

    @Schema(description = "자신감 점수 (0~100)")
    private int confidenceScore;

    @Schema(description = "총 상담 세션 수")
    private int totalSessions;
  }

  @Getter
  @Builder
  @Schema(description = "온보딩 질문 항목")
  public static class OnboardingQuestionResponse {
    @Schema(description = "질문 번호 (1~10)", example = "1")
    private int questionNumber;

    @Schema(description = "질문 내용", example = "해야 할 일이 생기면 자꾸 미루게 되는 편인가요?")
    private String text;

    @Schema(description = "이 질문이 측정하는 회복 유형", example = "AVOIDANT")
    private RecoveryType recoveryType;
  }
}
