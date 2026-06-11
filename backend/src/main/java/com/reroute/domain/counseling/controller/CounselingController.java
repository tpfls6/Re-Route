package com.reroute.domain.counseling.controller;

import com.reroute.domain.counseling.dto.CounselingDto;
import com.reroute.domain.counseling.service.CounselingService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/counseling")
@RequiredArgsConstructor
@Tag(name = "Counseling", description = "상담 세션 및 GPT 분석 API")
public class CounselingController {

  private final CounselingService counselingService;

  @Operation(summary = "상담 세션 생성", description = "현재 사용자에게 새 상담 세션을 생성합니다.")
  @PostMapping("/sessions")
  public ApiResponse<CounselingDto.SessionResponse> createSession(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody CounselingDto.CreateSessionRequest req
  ) {
    return ApiResponse.success(counselingService.createSession(user.getId(), req));
  }

  @Operation(summary = "상담 세션 목록 조회", description = "현재 사용자의 상담 세션 목록을 최신순으로 조회합니다.")
  @GetMapping("/sessions")
  public ApiResponse<List<CounselingDto.SessionResponse>> getSessions(@AuthenticationPrincipal User user) {
    return ApiResponse.success(counselingService.getSessions(user.getId()));
  }

  @Operation(summary = "상담 메시지 전송", description = "사용자 메시지를 저장하고 GPT 상담 답변을 생성해 함께 저장합니다.")
  @PostMapping("/messages")
  public ApiResponse<CounselingDto.MessagePairResponse> sendMessage(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody CounselingDto.MessageRequest req
  ) {
    return ApiResponse.success(counselingService.sendMessage(user.getId(), req));
  }

  @Operation(summary = "상담 메시지 목록 조회", description = "상담 세션의 메시지 목록을 시간순으로 조회합니다.")
  @GetMapping("/sessions/{sessionId}/messages")
  public ApiResponse<List<CounselingDto.MessageResponse>> getMessages(
      @AuthenticationPrincipal User user,
      @PathVariable Long sessionId
  ) {
    return ApiResponse.success(counselingService.getMessages(user.getId(), sessionId));
  }

  @Operation(summary = "상담 세션 완료", description = "상담 세션을 완료 처리하고 GPT 분석 결과를 생성하거나 갱신합니다.")
  @PatchMapping("/sessions/{sessionId}/complete")
  public ApiResponse<CounselingDto.AnalysisResponse> completeSession(
      @AuthenticationPrincipal User user,
      @PathVariable Long sessionId
  ) {
    return ApiResponse.success(counselingService.completeSession(user.getId(), sessionId));
  }

  @Operation(summary = "상담 분석 결과 조회", description = "이미 저장된 상담 세션 분석 결과를 조회합니다.")
  @GetMapping("/sessions/{sessionId}/analysis")
  public ApiResponse<CounselingDto.AnalysisResponse> getAnalysis(
      @AuthenticationPrincipal User user,
      @PathVariable Long sessionId
  ) {
    return ApiResponse.success(counselingService.getAnalysis(user.getId(), sessionId));
  }

  @Operation(summary = "상담 세션 삭제", description = "상담 세션과 관련된 메시지, 분석, 퀘스트, 액션 아이템을 모두 삭제합니다.")
  @DeleteMapping("/sessions/{sessionId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteSession(
      @AuthenticationPrincipal User user,
      @PathVariable Long sessionId
  ) {
    counselingService.deleteSession(user.getId(), sessionId);
  }

  @Operation(
      summary = "상담 세션 GPT 분석",
      description = "상담 세션의 메시지를 GPT API로 분석해 회복 유형을 분류하고 분석 결과를 저장합니다."
  )
  @PostMapping("/sessions/{sessionId}/analyze")
  public ApiResponse<CounselingDto.AnalysisResponse> analyzeSession(
      @AuthenticationPrincipal User user,
      @PathVariable Long sessionId
  ) {
    return ApiResponse.success(counselingService.analyzeSession(user.getId(), sessionId));
  }
}
