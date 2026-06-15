package com.reroute.domain.quest.entity;

import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.counseling.entity.CounselingSession;
import com.reroute.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_quests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class UserQuest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "counseling_session_id")
  private CounselingSession counselingSession;

  @Column
  private Long rehearsalSessionId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private RecoveryType recoveryType;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String background;

  @Column(columnDefinition = "TEXT")
  private String why;

  @Column(columnDefinition = "TEXT")
  private String steps;

  @Column(columnDefinition = "TEXT")
  private String tips;

  @Column(nullable = false)
  @Builder.Default
  private int estimatedMinutes = 10;

  @Column(nullable = false)
  @Builder.Default
  private int difficulty = 1;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  @Builder.Default
  private QuestStatus status = QuestStatus.PENDING;

  private LocalDateTime completedAt;

  @Column(length = 50)
  private String feeling;

  @Column
  private Integer difficultyRating;

  @Column(columnDefinition = "TEXT")
  private String reflection;

  @Column(columnDefinition = "TEXT")
  private String nextStep;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public void complete() {
    this.status = QuestStatus.COMPLETED;
    this.completedAt = LocalDateTime.now();
  }

  public void skip() {
    this.status = QuestStatus.SKIPPED;
  }

  public void updateRetrospective(String feeling, Integer difficultyRating, String reflection, String nextStep) {
    this.feeling = feeling;
    this.difficultyRating = difficultyRating;
    this.reflection = reflection;
    this.nextStep = nextStep;
  }

  public enum QuestStatus {
    PENDING, COMPLETED, SKIPPED
  }
}
