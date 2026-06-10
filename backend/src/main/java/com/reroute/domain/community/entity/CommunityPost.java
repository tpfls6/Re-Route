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
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class CommunityPost {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User author;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
  private User legacyAuthor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private CommunityCategory categoryRef;

  @Column(nullable = false, length = 50)
  private String category;

  @Column(nullable = false, length = 50)
  private String anonymousName;

  @Column(length = 50)
  private String anonymousType;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(columnDefinition = "TEXT")
  private String tagsJson;

  @Column(nullable = false)
  @Builder.Default
  private Integer viewCount = 0;

  @Column(nullable = false, length = 30)
  @Builder.Default
  private String status = "ACTIVE";

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public void update(CommunityCategory categoryRef, String category, String title, String content, String tagsJson) {
    this.categoryRef = categoryRef;
    this.category = category;
    this.title = title;
    this.content = content;
    this.tagsJson = tagsJson;
  }
}
