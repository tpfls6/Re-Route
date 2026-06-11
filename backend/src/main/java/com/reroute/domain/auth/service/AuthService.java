package com.reroute.domain.auth.service;

import com.reroute.domain.auth.dto.AuthDto;
import com.reroute.domain.auth.entity.RefreshToken;
import com.reroute.domain.auth.entity.EmailVerification;
import com.reroute.domain.auth.repository.RefreshTokenRepository;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import com.reroute.global.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final EmailVerificationService emailVerificationService;

  @Transactional
  public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
    if (!req.getPassword().equals(req.getPasswordConfirm())) {
      throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }
    if (userRepository.existsByEmail(req.getEmail())) {
      throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
    }
    emailVerificationService.verifyAndConsume(
        req.getEmail(),
        req.getVerificationCode(),
        EmailVerification.Purpose.SIGN_UP
    );

    User user = User.builder()
        .email(req.getEmail())
        .password(passwordEncoder.encode(req.getPassword()))
        .nickname(req.getNickname())
        .build();
    User saved = userRepository.save(user);
    return buildResponse(saved);
  }

  @Transactional
  public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
    User user = userRepository.findByEmail(req.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
    if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
      throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    return buildResponse(user);
  }

  @Transactional
  public AuthDto.AuthResponse refresh(AuthDto.RefreshRequest req) {
    if (!jwtUtil.isValidRefreshToken(req.getRefreshToken())) {
      throw new IllegalArgumentException("유효하지 않은 refresh token입니다.");
    }

    String tokenHash = jwtUtil.hashToken(req.getRefreshToken());
    RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 refresh token입니다."));

    if (!refreshToken.isActive()) {
      throw new IllegalArgumentException("만료되었거나 폐기된 refresh token입니다.");
    }

    Long userId = jwtUtil.extractUserIdFromRefreshToken(req.getRefreshToken());
    if (!refreshToken.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("유효하지 않은 refresh token입니다.");
    }

    refreshToken.revoke();
    return buildResponse(refreshToken.getUser());
  }

  @Transactional
  public void logout(Long userId) {
    revokeUserRefreshTokens(userId);
  }

  @Transactional
  public void changePassword(Long userId, AuthDto.ChangePasswordRequest req) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

    if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
      throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
    }

    if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
      throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
    }

    user.changePassword(passwordEncoder.encode(req.getNewPassword()));
    revokeUserRefreshTokens(userId);
  }

  public AuthDto.UserInfo me(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    return toUserInfo(user);
  }

  private AuthDto.AuthResponse buildResponse(User user) {
    String accessToken = jwtUtil.generateAccessToken(user.getId());
    String refreshToken = jwtUtil.generateRefreshToken(user.getId());
    saveRefreshToken(user, refreshToken);

    return AuthDto.AuthResponse.builder()
        .token(accessToken)
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .tokenType("Bearer")
        .user(toUserInfo(user))
        .build();
  }

  private void saveRefreshToken(User user, String refreshToken) {
    refreshTokenRepository.save(RefreshToken.builder()
        .user(user)
        .tokenHash(jwtUtil.hashToken(refreshToken))
        .expiresAt(jwtUtil.getRefreshTokenExpiresAt())
        .build());
  }

  private void revokeUserRefreshTokens(Long userId) {
    refreshTokenRepository.findByUserIdAndRevokedFalse(userId)
        .forEach(RefreshToken::revoke);
  }

  private AuthDto.UserInfo toUserInfo(User user) {
    String typeName = user.getPrimaryRecoveryType() != null
        ? user.getPrimaryRecoveryType().getDisplayName()
        : null;
    return AuthDto.UserInfo.builder()
        .id(user.getId())
        .email(user.getEmail())
        .nickname(user.getNickname())
        .onboardingCompleted(user.isOnboardingCompleted())
        .primaryRecoveryType(user.getPrimaryRecoveryType())
        .primaryRecoveryTypeName(typeName)
        .role(user.getRole().name())
        .build();
  }
}
