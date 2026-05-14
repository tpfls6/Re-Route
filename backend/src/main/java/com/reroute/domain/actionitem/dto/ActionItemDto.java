package com.reroute.domain.actionitem.dto;

import lombok.Builder;
import lombok.Getter;

public class ActionItemDto {

  @Getter
  @Builder
  public static class Response {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Integer estimatedMinutes;
    private String status;
  }
}
