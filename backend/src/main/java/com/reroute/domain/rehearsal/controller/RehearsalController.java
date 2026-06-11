package com.reroute.domain.rehearsal.controller;

import com.reroute.domain.rehearsal.dto.RehearsalDto;
import com.reroute.domain.rehearsal.service.RehearsalService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rehearsals")
@RequiredArgsConstructor
@Tag(name = "Rehearsal", description = "VR 마인드 리허설 API")
public class RehearsalController {

  private final RehearsalService rehearsalService;

  @Operation(summary = "리허설 다음 턴")
  @PostMapping("/turn")
  public ApiResponse<RehearsalDto.TurnResponse> nextTurn(
      @Valid @RequestBody RehearsalDto.TurnRequest req
  ) {
    return ApiResponse.success(rehearsalService.nextTurn(req));
  }

  @Operation(summary = "리허설 완료 저장 및 퀘스트 생성")
  @PostMapping("/complete")
  public ApiResponse<RehearsalDto.SessionResponse> complete(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody RehearsalDto.CompleteRequest req
  ) {
    return ApiResponse.success(rehearsalService.completeSession(user.getId(), req));
  }

  @Operation(summary = "내 리허설 히스토리 조회")
  @GetMapping("/me")
  public ApiResponse<List<RehearsalDto.SessionResponse>> getHistory(
      @AuthenticationPrincipal User user
  ) {
    return ApiResponse.success(rehearsalService.getMyHistory(user.getId()));
  }
}
