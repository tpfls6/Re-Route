package com.reroute.domain.actionitem.controller;

import com.reroute.domain.actionitem.dto.ActionItemDto;
import com.reroute.domain.actionitem.service.ActionItemService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/action-items")
@RequiredArgsConstructor
@Tag(name = "ActionItem", description = "액션 아이템 API")
public class ActionItemController {

  private final ActionItemService actionItemService;

  @Operation(summary = "내 액션 아이템 목록 조회")
  @GetMapping("/me")
  public ApiResponse<List<ActionItemDto.Response>> getMyActionItems(@AuthenticationPrincipal User user) {
    return ApiResponse.success(actionItemService.getMyActionItems(user.getId()));
  }

  @Operation(summary = "액션 아이템 완료 처리")
  @PatchMapping("/me/{userActionItemId}/complete")
  public ApiResponse<ActionItemDto.Response> completeActionItem(
      @AuthenticationPrincipal User user,
      @PathVariable Long userActionItemId
  ) {
    return ApiResponse.success(actionItemService.completeActionItem(user.getId(), userActionItemId));
  }
}
