package com.reroute.domain.community.entity;

import com.reroute.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_moderation_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class CommunityModerationLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, length = 30)
  private String targetType;

  @Column(nullable = false, length = 20)
  private String action;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String submittedContent;

  @Column(nullable = false, length = 500)
  private String reason;

  @Column(columnDefinition = "TEXT")
  private String categoriesJson;

  @Column(nullable = false)
  private boolean selfHarmRisk;

  @CreationTimestamp
  private LocalDateTime createdAt;
}
