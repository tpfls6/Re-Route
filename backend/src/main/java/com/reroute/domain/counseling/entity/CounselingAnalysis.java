package com.reroute.domain.counseling.entity;

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

  @Column(length = 50)
  private String recoveryType;

  @Column(columnDefinition = "TEXT")
  private String emotionKeywords;

  @CreationTimestamp
  private LocalDateTime createdAt;
}
