package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CommunityCommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityCommentLikeRepository extends JpaRepository<CommunityCommentLike, Long> {
  long countByCommentId(Long commentId);
  boolean existsByCommentIdAndUserId(Long commentId, Long userId);
  Optional<CommunityCommentLike> findByCommentIdAndUserId(Long commentId, Long userId);
  void deleteByCommentId(Long commentId);
}
