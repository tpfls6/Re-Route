package com.reroute.domain.auth.dto;

import com.reroute.domain.auth.entity.EmailVerification;
import com.reroute.domain.common.RecoveryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

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
    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(max = 50, message = "닉네임은 50자 이하로 입력해주세요.")
    @Schema(description = "닉네임", example = "rerouter")
    private String nickname;

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @NotBlank(message = "인증코드는 필수입니다.")
    @Schema(description = "이메일 인증코드", example = "123456")
    private String verificationCode;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하로 입력해주세요.")
    @Schema(description = "비밀번호. 8자 이상", example = "password123")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    @Schema(description = "비밀번호 확인", example = "password123")
    private String passwordConfirm;
  }

  @Getter
  @Schema(description = "이메일 인증코드 발급 요청")
  public static class EmailCodeRequest {
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @NotNull(message = "인증 목적은 필수입니다.")
    @Schema(description = "인증 목적. SIGN_UP 또는 PROFILE_UPDATE", example = "SIGN_UP")
    private EmailVerification.Purpose purpose;
  }

  @Getter
  @Schema(description = "이메일 인증코드 확인 요청")
  public static class EmailCodeVerifyRequest {
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    @Schema(description = "이메일", example = "user@example.com")
    private String email;

    @NotBlank(message = "인증코드는 필수입니다.")
    @Schema(description = "이메일 인증코드", example = "123456")
    private String code;

    @NotNull(message = "인증 목적은 필수입니다.")
    @Schema(description = "인증 목적. SIGN_UP 또는 PROFILE_UPDATE", example = "SIGN_UP")
    private EmailVerification.Purpose purpose;
  }

  @Getter
  @Builder
  @Schema(description = "이메일 인증코드 발급 응답")
  public static class EmailCodeResponse {
    private String email;
    private EmailVerification.Purpose purpose;
    private LocalDateTime expiresAt;

    @Schema(description = "개발용 인증코드. 실제 메일 발송 연동 후에는 응답에서 제거하세요.")
    private String code;
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

    @Schema(description = "온보딩 완료 여부")
    private boolean onboardingCompleted;

    @Schema(description = "온보딩에서 분류된 회복 유형", example = "AVOIDANT")
    private RecoveryType primaryRecoveryType;

    @Schema(description = "회복 유형 한국어 이름", example = "회피형")
    private String primaryRecoveryTypeName;

    @Schema(description = "사용자 권한", example = "USER")
    private String role;
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
