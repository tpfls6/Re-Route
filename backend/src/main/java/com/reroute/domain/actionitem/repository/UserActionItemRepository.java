package com.reroute.domain.actionitem.repository;

import com.reroute.domain.actionitem.entity.UserActionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActionItemRepository extends JpaRepository<UserActionItem, Long> {
  List<UserActionItem> findByUserIdOrderByCreatedAtDesc(Long userId);
  List<UserActionItem> findByCounselingSessionId(Long sessionId);
  void deleteByUserId(Long userId);
  int countByUserIdAndStatus(Long userId, UserActionItem.CompletionStatus status);
  List<UserActionItem> findByUserIdAndStatus(Long userId, UserActionItem.CompletionStatus status);
}
