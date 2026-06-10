package com.reroute.domain.actionitem.repository;

import com.reroute.domain.actionitem.entity.ActionItem;
import com.reroute.domain.common.RecoveryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActionItemRepository extends JpaRepository<ActionItem, Long> {
  List<ActionItem> findByCategory(RecoveryType category);
  boolean existsByTitle(String title);
}
