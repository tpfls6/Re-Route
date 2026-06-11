package com.reroute.domain.actionitem.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class ActionItemDto {

  @Getter
  @Builder
  public static class Response {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String categoryName;
    private String format;
    private String formatName;
    private Integer estimatedMinutes;
    private String status;
    private LocalDateTime createdAt;
    private String recoveryTypeDescription;
    private Long questId;
  }
}
