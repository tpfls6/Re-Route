package com.reroute.domain.quest.dto;

import com.reroute.domain.common.RecoveryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class UserQuestDto {

  @Getter
  @Builder
  @Schema(description = "퀘스트 목록 응답")
  public static class Summary {
    private Long id;
    private String title;
    private RecoveryType recoveryType;
    private String recoveryTypeName;
    private int estimatedMinutes;
    private int difficulty;
    private String difficultyLabel;
    private String status;
    private Long sessionId;
    private String createdAt;
    private String feeling;
    private Integer difficultyRating;
    private String reflection;
    private String nextStep;
  }

  @Getter
  @Builder
  @Schema(description = "퀘스트 상세 응답")
  public static class Detail {
    private Long id;
    private String title;
    private String background;
    private String why;
    private List<String> steps;
    private List<String> tips;
    private int estimatedMinutes;
    private int difficulty;
    private String difficultyLabel;
    private RecoveryType recoveryType;
    private String recoveryTypeName;
    private String status;
    private Long sessionId;
    private String createdAt;
    private String feeling;
    private Integer difficultyRating;
    private String reflection;
    private String nextStep;
  }

  @Getter
  @Schema(description = "회고 저장 요청")
  public static class RetroRequest {
    @Size(max = 50, message = "기분 값은 50자 이하로 입력해주세요.")
    private String feeling;

    @Min(value = 1, message = "난이도 평가는 1점 이상이어야 합니다.")
    @Max(value = 5, message = "난이도 평가는 5점 이하여야 합니다.")
    private Integer difficultyRating;

    @Size(max = 5000, message = "회고는 5000자 이하로 입력해주세요.")
    private String reflection;

    @Size(max = 5000, message = "다음 단계는 5000자 이하로 입력해주세요.")
    private String nextStep;
  }

  public static String difficultyLabel(int difficulty) {
    return switch (difficulty) {
      case 1 -> "Level 1";
      case 2 -> "Level 2";
      case 3 -> "Level 3";
      default -> "Level 1";
    };
  }

  static String difficultyClass(int difficulty) {
    return switch (difficulty) {
      case 1 -> "ql1";
      case 2 -> "ql2";
      case 3 -> "ql3";
      default -> "ql1";
    };
  }
}
