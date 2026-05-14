package com.reroute.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

public class UserDto {

  @Getter
  @Builder
  public static class RegisterRequest {
    private String email;
    private String password;
    private String nickname;
  }

  @Getter
  @Builder
  public static class LoginRequest {
    private String email;
    private String password;
  }

  @Getter
  @Builder
  public static class Response {
    private Long id;
    private String email;
    private String nickname;
  }
}
