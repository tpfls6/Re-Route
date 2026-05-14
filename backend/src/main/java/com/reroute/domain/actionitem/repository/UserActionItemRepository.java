package com.reroute.domain.actionitem.repository;

import com.reroute.domain.actionitem.entity.UserActionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActionItemRepository extends JpaRepository<UserActionItem, Long> {
  List<UserActionItem> findByUserIdOrderByCreatedAtDesc(Long userId);
}
