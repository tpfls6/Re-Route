package com.reroute.domain.actionitem.repository;

import com.reroute.domain.actionitem.entity.ActionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionItemRepository extends JpaRepository<ActionItem, Long> {
}
