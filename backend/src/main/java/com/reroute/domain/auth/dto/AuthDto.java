package com.reroute.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

public class AuthDto {

  @Getter
  @Schema(description = "로그인 요청")
  public static class LoginRequest {
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Schema(description = "비밀번호", example = "password123")
    private String password;
  }

  @Getter
  @Schema(description = "회원가입 요청")
  public static class RegisterRequest {
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하로 입력해주세요.")
    @Schema(description = "비밀번호. 8자 이상", example = "password123")
    private String password;

    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(max = 50, message = "닉네임은 50자 이하로 입력해주세요.")
    @Schema(description = "닉네임", example = "rerouter")
    private String nickname;
  }

  @Getter
  @Schema(description = "토큰 재발급 요청")
  public static class RefreshRequest {
    @NotBlank(message = "refreshToken은 필수입니다.")
    @Schema(description = "Refresh Token")
    private String refreshToken;
  }

  @Getter
  @Schema(description = "비밀번호 변경 요청")
  public static class ChangePasswordRequest {
    @NotBlank(message = "현재 비밀번호는 필수입니다.")
    @Schema(description = "현재 비밀번호")
    private String currentPassword;

    @NotBlank(message = "새 비밀번호는 필수입니다.")
    @Size(min = 8, max = 100, message = "새 비밀번호는 8자 이상 100자 이하로 입력해주세요.")
    @Schema(description = "새 비밀번호. 8자 이상")
    private String newPassword;
  }

  @Getter
  @Builder
  @Schema(description = "사용자 정보")
  public static class UserInfo {
    @Schema(description = "사용자 ID", example = "1")
    private Long id;

    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @Schema(description = "닉네임", example = "rerouter")
    private String nickname;
  }

  @Getter
  @Builder
  @Schema(description = "인증 응답")
  public static class AuthResponse {
    @Schema(description = "기존 호환용 Access Token")
    private String token;

    @Schema(description = "Access Token")
    private String accessToken;

    @Schema(description = "Refresh Token")
    private String refreshToken;

    @Schema(description = "토큰 타입", example = "Bearer")
    private String tokenType;

    private UserInfo user;
  }
}
