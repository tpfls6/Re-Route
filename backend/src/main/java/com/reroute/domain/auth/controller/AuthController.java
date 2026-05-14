package com.reroute.domain.auth.controller;

import com.reroute.domain.auth.dto.AuthDto;
import com.reroute.domain.auth.service.AuthService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ApiResponse<AuthDto.AuthResponse> register(@RequestBody AuthDto.RegisterRequest req) {
    return ApiResponse.success(authService.register(req));
  }

  @PostMapping("/login")
  public ApiResponse<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest req) {
    return ApiResponse.success(authService.login(req));
  }

  @PostMapping("/logout")
  public ApiResponse<Void> logout() {
    return ApiResponse.success("로그아웃 되었습니다.");
  }

  @GetMapping("/me")
  public ApiResponse<AuthDto.UserInfo> me(@AuthenticationPrincipal User user) {
    return ApiResponse.success(authService.me(user.getId()));
  }
}
