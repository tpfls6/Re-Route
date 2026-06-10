package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {
  List<CommunityComment> findByPostIdOrderByCreatedAtAsc(Long postId);
  long countByPostId(Long postId);
  void deleteByPostId(Long postId);
}
