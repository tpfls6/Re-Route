package com.reroute.domain.auth.service;

import com.reroute.domain.auth.dto.AuthDto;
import com.reroute.domain.auth.entity.EmailVerification;
import com.reroute.domain.auth.repository.EmailVerificationRepository;
import com.reroute.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

  private static final int CODE_BOUND = 1_000_000;
  private static final int EXPIRE_MINUTES = 5;

  private final EmailVerificationRepository emailVerificationRepository;
  private final UserRepository userRepository;
  private final SecureRandom secureRandom = new SecureRandom();

  @Transactional
  public AuthDto.EmailCodeResponse issueCode(AuthDto.EmailCodeRequest req) {
    EmailVerification.Purpose purpose = req.getPurpose();
    if (purpose == EmailVerification.Purpose.SIGN_UP && userRepository.existsByEmail(req.getEmail())) {
      throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
    }
    if (purpose == EmailVerification.Purpose.PROFILE_UPDATE && !userRepository.existsByEmail(req.getEmail())) {
      throw new IllegalArgumentException("가입되지 않은 이메일입니다.");
    }

    emailVerificationRepository.deleteByEmailAndPurpose(req.getEmail(), purpose);

    String code = String.format("%06d", secureRandom.nextInt(CODE_BOUND));
    LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(EXPIRE_MINUTES);
    emailVerificationRepository.save(EmailVerification.builder()
        .email(req.getEmail())
        .code(code)
        .purpose(purpose)
        .expiresAt(expiresAt)
        .build());

    return AuthDto.EmailCodeResponse.builder()
        .email(req.getEmail())
        .purpose(purpose)
        .expiresAt(expiresAt)
        .code(code)
        .build();
  }

  @Transactional
  public void verifyCode(AuthDto.EmailCodeVerifyRequest req) {
    verify(req.getEmail(), req.getCode(), req.getPurpose());
  }

  @Transactional
  public void verifyAndConsume(String email, String code, EmailVerification.Purpose purpose) {
    verify(email, code, purpose);
    emailVerificationRepository.deleteByEmailAndPurpose(email, purpose);
  }

  private void verify(String email, String code, EmailVerification.Purpose purpose) {
    EmailVerification verification = emailVerificationRepository
        .findTopByEmailAndPurposeOrderByCreatedAtDesc(email, purpose)
        .orElseThrow(() -> new IllegalArgumentException("이메일 인증코드를 먼저 요청해주세요."));

    if (!verification.isUsable()) {
      throw new IllegalArgumentException("이메일 인증코드가 만료되었습니다.");
    }
    if (!verification.getCode().equals(code)) {
      throw new IllegalArgumentException("이메일 인증코드가 올바르지 않습니다.");
    }
    verification.verify();
  }
}
