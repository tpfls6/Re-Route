package com.reroute.domain.auth.entity;

import com.reroute.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class RefreshToken {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, unique = true, length = 128)
  private String tokenHash;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false)
  @Builder.Default
  private boolean revoked = false;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public boolean isActive() {
    return !revoked && expiresAt.isAfter(LocalDateTime.now());
  }

  public void revoke() {
    this.revoked = true;
  }
}
