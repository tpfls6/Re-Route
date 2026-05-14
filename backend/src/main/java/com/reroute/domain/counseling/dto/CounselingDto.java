package com.reroute.domain.counseling.dto;

import lombok.Builder;
import lombok.Getter;

public class CounselingDto {

  @Getter
  @Builder
  public static class MessageRequest {
    private Long sessionId;
    private String content;
  }

  @Getter
  @Builder
  public static class SessionResponse {
    private Long id;
    private String title;
    private String status;
    private String createdAt;
  }
}
