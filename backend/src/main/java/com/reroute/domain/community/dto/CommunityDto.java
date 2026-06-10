package com.reroute.domain.community.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class CommunityDto {

  @Getter
  public static class PostRequest {
    @NotBlank(message = "카테고리는 필수입니다.")
    @Size(max = 50, message = "카테고리는 50자 이하로 입력해주세요.")
    private String category;

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 100, message = "제목은 100자 이하로 입력해주세요.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    @Size(min = 10, max = 10000, message = "내용은 10자 이상 10000자 이하로 입력해주세요.")
    private String content;

    @Size(max = 5, message = "태그는 최대 5개까지 입력할 수 있습니다.")
    private List<@Size(max = 30, message = "태그는 30자 이하로 입력해주세요.") String> tags;
  }

  @Getter
  public static class CommentRequest {
    @NotBlank(message = "댓글 내용은 필수입니다.")
    @Size(max = 2000, message = "댓글은 2000자 이하로 입력해주세요.")
    private String content;
  }

  @Getter
  public static class CampfireRequest {
    @NotBlank(message = "캠프파이어 이름은 필수입니다.")
    @Size(max = 100, message = "캠프파이어 이름은 100자 이하로 입력해주세요.")
    private String name;

    @NotBlank(message = "캠프파이어 설명은 필수입니다.")
    @Size(max = 300, message = "캠프파이어 설명은 300자 이하로 입력해주세요.")
    private String description;

    @NotBlank(message = "키워드는 필수입니다.")
    @Size(max = 100, message = "키워드는 100자 이하로 입력해주세요.")
    private String keyword;

    @NotNull(message = "공개 여부는 필수입니다.")
    @Schema(example = "true")
    private Boolean open;
  }

  @Getter
  @Builder
  public static class PostSummaryResponse {
    private Long id;
    private String category;
    private String title;
    private String preview;
    private String author;
    private String authorType;
    private String createdAt;
    private String updatedAt;
    private long likes;
    private long commentCount;
    private boolean liked;
    private boolean mine;
    private List<String> tags;
  }

  @Getter
  @Builder
  public static class PostDetailResponse {
    private Long id;
    private String category;
    private String title;
    private String content;
    private String preview;
    private String author;
    private String authorType;
    private String createdAt;
    private String updatedAt;
    private long likes;
    private boolean liked;
    private boolean mine;
    private List<String> tags;
    private List<CommentResponse> comments;
    private String safetyNotice;
  }

  @Getter
  @Builder
  public static class CommentResponse {
    private Long id;
    private Long postId;
    private String author;
    private String authorType;
    private String content;
    private String createdAt;
    private String updatedAt;
    private long likes;
    private boolean liked;
    private boolean mine;
    private String safetyNotice;
  }

  @Getter
  @Builder
  public static class CampfireResponse {
    private Long id;
    private String name;
    private String desc;
    private String description;
    private String keyword;
    private String owner;
    private boolean open;
    private long members;
    private boolean joined;
    private boolean mine;
    private String createdAt;
    private String updatedAt;
    private String safetyNotice;
  }

  @Getter
  @Builder
  public static class ModerationLogResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String targetType;
    private String action;
    private String submittedContent;
    private String reason;
    private List<String> categories;
    private boolean selfHarmRisk;
    private String createdAt;
  }

  @Getter
  @Builder
  public static class ModerationErrorResponse {
    private String code;
    private List<String> categories;
  }
}
