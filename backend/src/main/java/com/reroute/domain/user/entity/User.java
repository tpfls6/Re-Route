package com.reroute.domain.user.entity;

import com.reroute.domain.common.RecoveryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false, length = 50)
  private String nickname;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private UserRole role = UserRole.USER;

  @Enumerated(EnumType.STRING)
  @Column(length = 50)
  private RecoveryType primaryRecoveryType;

  @Column(nullable = false, columnDefinition = "TINYINT(1) NOT NULL DEFAULT 0")
  @Builder.Default
  private boolean onboardingCompleted = false;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public void changePassword(String password) {
    this.password = password;
  }

  public void changeNickname(String nickname) {
    this.nickname = nickname;
  }

  public void completeOnboarding(RecoveryType recoveryType) {
    this.primaryRecoveryType = recoveryType;
    this.onboardingCompleted = true;
  }

  public enum UserRole {
    USER, ADMIN
  }
}
