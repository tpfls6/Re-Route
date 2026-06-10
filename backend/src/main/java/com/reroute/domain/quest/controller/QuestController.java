package com.reroute.domain.quest.controller;

import com.reroute.domain.quest.dto.UserQuestDto;
import com.reroute.domain.quest.service.QuestService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
@Tag(name = "Quest", description = "상담 기반 퀘스트 API")
public class QuestController {

  private final QuestService questService;

  @Operation(summary = "내 퀘스트 목록 조회")
  @GetMapping("/my")
  public ApiResponse<List<UserQuestDto.Summary>> getMyQuests(@AuthenticationPrincipal User user) {
    return ApiResponse.success(questService.getMyQuests(user.getId()));
  }

  @Operation(summary = "퀘스트 상세 조회")
  @GetMapping("/{questId}")
  public ApiResponse<UserQuestDto.Detail> getQuest(
      @AuthenticationPrincipal User user,
      @PathVariable Long questId
  ) {
    return ApiResponse.success(questService.getQuest(user.getId(), questId));
  }

  @Operation(summary = "퀘스트 완료")
  @PatchMapping("/{questId}/complete")
  public ApiResponse<UserQuestDto.Detail> completeQuest(
      @AuthenticationPrincipal User user,
      @PathVariable Long questId
  ) {
    return ApiResponse.success(questService.completeQuest(user.getId(), questId));
  }

  @Operation(summary = "퀘스트 건너뛰기")
  @PatchMapping("/{questId}/skip")
  public ApiResponse<UserQuestDto.Detail> skipQuest(
      @AuthenticationPrincipal User user,
      @PathVariable Long questId
  ) {
    return ApiResponse.success(questService.skipQuest(user.getId(), questId));
  }

  @Operation(summary = "회고 저장", description = "퀘스트 완료 후 기분, 난이도, 소감, 다음 단계를 저장합니다.")
  @PatchMapping("/{questId}/retrospective")
  public ApiResponse<UserQuestDto.Detail> saveRetrospective(
      @AuthenticationPrincipal User user,
      @PathVariable Long questId,
      @Valid @RequestBody UserQuestDto.RetroRequest req
  ) {
    return ApiResponse.success(questService.saveRetrospective(user.getId(), questId, req));
  }
}
