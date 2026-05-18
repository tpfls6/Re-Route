package com.reroute.domain.counseling.entity;

import com.reroute.domain.common.RecoveryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "counseling_analyses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class CounselingAnalysis {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "session_id", nullable = false, unique = true)
  private CounselingSession session;

  @Column(columnDefinition = "TEXT")
  private String summary;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private RecoveryType recoveryType;

  private Double confidence;

  @Column(columnDefinition = "TEXT")
  private String reason;

  @Column(columnDefinition = "TEXT")
  private String emotionKeywords;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public void updateAnalysis(RecoveryType recoveryType, Double confidence, String summary,
      String reason, String emotionKeywords) {
    this.recoveryType = recoveryType;
    this.confidence = confidence;
    this.summary = summary;
    this.reason = reason;
    this.emotionKeywords = emotionKeywords;
  }
}
