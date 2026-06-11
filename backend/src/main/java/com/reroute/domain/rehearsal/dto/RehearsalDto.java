package com.reroute.domain.rehearsal.dto;

import com.reroute.domain.quest.dto.UserQuestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class RehearsalDto {

  @Getter
  public static class TurnRequest {
    @NotNull
    private Integer scenarioId;

    @Valid
    @Size(max = 30, message = "대화는 최대 30턴까지 진행됩니다.")
    private List<MessageItem> messages;

    private boolean forceComplete;

    @Getter
    public static class MessageItem {
      private String role;    // "user" | "npc"
      private String content;
    }
  }

  @Getter
  @Builder
  public static class TurnResponse {
    private String npcReply;
    private int userTurnCount;
    private boolean isFinal;
    private boolean suggestEnd;
    private String feedback;
  }

  @Getter
  public static class CompleteRequest {
    @NotNull
    private Integer scenarioId;

    @NotNull
    @Size(max = 100)
    private String scenarioName;

    @Valid
    private List<TurnRequest.MessageItem> messages;

    private String feedback;
  }

  @Getter
  @Builder
  public static class SessionResponse {
    private Long id;
    private int scenarioId;
    private String scenarioName;
    private String feedback;
    private Long questId;
    private String createdAt;
    private UserQuestDto.Detail quest;
  }
}
