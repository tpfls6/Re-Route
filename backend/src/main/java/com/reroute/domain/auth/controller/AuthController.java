package com.reroute.domain.auth.controller;

import com.reroute.domain.auth.dto.AuthDto;
import com.reroute.domain.auth.service.AuthService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "회원가입, 로그인, JWT 인증 API")
public class AuthController {

  private final AuthService authService;

  @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임으로 회원가입하고 access/refresh token을 발급합니다.")
  @PostMapping("/register")
  public ApiResponse<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
    return ApiResponse.success(authService.register(req));
  }

  @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인하고 access/refresh token을 발급합니다.")
  @PostMapping("/login")
  public ApiResponse<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest req) {
    return ApiResponse.success(authService.login(req));
  }

  @Operation(summary = "Access Token 재발급", description = "refresh token을 검증하고 새 access/refresh token을 재발급합니다.")
  @PostMapping("/refresh")
  public ApiResponse<AuthDto.AuthResponse> refresh(@Valid @RequestBody AuthDto.RefreshRequest req) {
    return ApiResponse.success(authService.refresh(req));
  }

  @Operation(summary = "로그아웃", description = "현재 사용자의 활성 refresh token을 모두 폐기합니다.")
  @PostMapping("/logout")
  public ApiResponse<Void> logout(@AuthenticationPrincipal User user) {
    authService.logout(user.getId());
    return ApiResponse.success("로그아웃 되었습니다.");
  }

  @Operation(summary = "내 정보 조회", description = "현재 인증된 사용자의 정보를 조회합니다.")
  @GetMapping("/me")
  public ApiResponse<AuthDto.UserInfo> me(@AuthenticationPrincipal User user) {
    return ApiResponse.success(authService.me(user.getId()));
  }

  @Operation(summary = "비밀번호 변경", description = "현재 비밀번호를 확인한 뒤 새 비밀번호로 변경하고 refresh token을 폐기합니다.")
  @PatchMapping("/password")
  public ApiResponse<Void> changePassword(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody AuthDto.ChangePasswordRequest req
  ) {
    authService.changePassword(user.getId(), req);
    return ApiResponse.success("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
  }
}
