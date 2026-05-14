package com.reroute.domain.auth.service;

import com.reroute.domain.auth.dto.AuthDto;
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
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @Transactional
  public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
    if (userRepository.existsByEmail(req.getEmail())) {
      throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
    }
    User user = User.builder()
        .email(req.getEmail())
        .password(passwordEncoder.encode(req.getPassword()))
        .nickname(req.getNickname())
        .build();
    User saved = userRepository.save(user);
    return buildResponse(saved);
  }

  public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
    User user = userRepository.findByEmail(req.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
    if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
      throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    return buildResponse(user);
  }

  public AuthDto.UserInfo me(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    return toUserInfo(user);
  }

  private AuthDto.AuthResponse buildResponse(User user) {
    String token = jwtUtil.generateToken(user.getId());
    return AuthDto.AuthResponse.builder()
        .token(token)
        .user(toUserInfo(user))
        .build();
  }

  private AuthDto.UserInfo toUserInfo(User user) {
    return AuthDto.UserInfo.builder()
        .id(user.getId())
        .email(user.getEmail())
        .nickname(user.getNickname())
        .build();
  }
}
