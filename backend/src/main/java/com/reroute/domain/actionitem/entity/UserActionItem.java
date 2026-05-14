package com.reroute.domain.actionitem.entity;

import com.reroute.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_action_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class UserActionItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "action_item_id", nullable = false)
  private ActionItem actionItem;

  @Enumerated(EnumType.STRING)
  @Builder.Default
  private CompletionStatus status = CompletionStatus.PENDING;

  private LocalDateTime completedAt;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public void complete() {
    this.status = CompletionStatus.COMPLETED;
    this.completedAt = LocalDateTime.now();
  }

  public enum CompletionStatus {
    PENDING, IN_PROGRESS, COMPLETED, SKIPPED
  }
}
