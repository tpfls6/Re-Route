package com.reroute.domain.user.controller;

import com.reroute.domain.user.dto.UserDto;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.service.UserService;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "마이페이지 사용자 API")
public class UserController {

  private final UserService userService;

  @Operation(summary = "마이페이지 조회", description = "현재 로그인한 사용자의 이메일과 닉네임을 조회합니다.")
  @GetMapping("/me")
  public ApiResponse<UserDto.Response> getMyPage(@AuthenticationPrincipal User user) {
    return ApiResponse.success(userService.getMyPage(user.getId()));
  }

  @Operation(summary = "사용자 통계 조회", description = "완료 퀘스트 수, 연속 실천일, 자신감 점수 등을 반환합니다.")
  @GetMapping("/me/stats")
  public ApiResponse<UserDto.StatsResponse> getMyStats(@AuthenticationPrincipal User user) {
    return ApiResponse.success(userService.getUserStats(user.getId()));
  }

  @Operation(summary = "마이페이지 수정", description = "이메일 인증코드 확인 후 닉네임 또는 비밀번호를 수정합니다. 이메일은 수정할 수 없습니다.")
  @PatchMapping("/me")
  public ApiResponse<UserDto.Response> updateMyPage(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody UserDto.MyPageUpdateRequest req
  ) {
    return ApiResponse.success(userService.updateMyPage(user.getId(), req));
  }

  @Operation(summary = "회원 탈퇴", description = "현재 로그인한 사용자의 계정과 관련 토큰/사용자 데이터를 삭제합니다.")
  @DeleteMapping("/me")
  public ApiResponse<Void> deleteMyAccount(@AuthenticationPrincipal User user) {
    userService.deleteMyAccount(user.getId());
    return ApiResponse.success("회원 탈퇴가 완료되었습니다.");
  }

  @Operation(summary = "온보딩 질문 목록 조회", description = "회복 유형 분류를 위한 10개의 질문 목록을 반환합니다.")
  @GetMapping("/onboarding/questions")
  public ApiResponse<List<UserDto.OnboardingQuestionResponse>> getOnboardingQuestions() {
    return ApiResponse.success(userService.getOnboardingQuestions());
  }

  @Operation(summary = "온보딩 완료", description = "질문지 응답(1~5점, 10개)을 기반으로 회복 유형을 분류하고 저장합니다.")
  @PostMapping("/onboarding")
  public ApiResponse<UserDto.Response> completeOnboarding(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody UserDto.OnboardingRequest req
  ) {
    return ApiResponse.success(userService.completeOnboarding(user.getId(), req));
  }
}
