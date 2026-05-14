package com.reroute.domain.actionitem.service;

import com.reroute.domain.actionitem.repository.ActionItemRepository;
import com.reroute.domain.actionitem.repository.UserActionItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActionItemService {

  private final ActionItemRepository actionItemRepository;
  private final UserActionItemRepository userActionItemRepository;
}
