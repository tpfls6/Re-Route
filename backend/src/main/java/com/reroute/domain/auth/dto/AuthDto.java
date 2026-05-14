package com.reroute.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

public class AuthDto {

  @Getter
  public static class LoginRequest {
    private String email;
    private String password;
  }

  @Getter
  public static class RegisterRequest {
    private String email;
    private String password;
    private String nickname;
  }

  @Getter
  @Builder
  public static class UserInfo {
    private Long id;
    private String email;
    private String nickname;
  }

  @Getter
  @Builder
  public static class AuthResponse {
    private String token;
    private UserInfo user;
  }
}
