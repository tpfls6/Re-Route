package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
  List<CommunityPost> findAllByOrderByCreatedAtDesc();
  List<CommunityPost> findByCategoryOrderByCreatedAtDesc(String category);
}
