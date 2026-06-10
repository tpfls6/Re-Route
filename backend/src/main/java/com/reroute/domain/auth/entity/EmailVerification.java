package com.reroute.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class EmailVerification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String email;

  @Column(nullable = false, length = 10)
  private String code;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private Purpose purpose;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false)
  @Builder.Default
  private boolean verified = false;

  private LocalDateTime verifiedAt;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public boolean isExpired() {
    return expiresAt.isBefore(LocalDateTime.now());
  }

  public boolean isUsable() {
    return !isExpired();
  }

  public void verify() {
    this.verified = true;
    this.verifiedAt = LocalDateTime.now();
  }

  public enum Purpose {
    SIGN_UP, PROFILE_UPDATE
  }
}
