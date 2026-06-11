package com.reroute.domain.actionitem.service;

import com.reroute.domain.actionitem.dto.ActionItemDto;
import com.reroute.domain.actionitem.entity.UserActionItem;
import com.reroute.domain.actionitem.repository.ActionItemRepository;
import com.reroute.domain.actionitem.repository.UserActionItemRepository;
import com.reroute.domain.quest.repository.UserQuestRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActionItemService {

  private final ActionItemRepository actionItemRepository;
  private final UserActionItemRepository userActionItemRepository;
  private final UserQuestRepository userQuestRepository;

  public List<ActionItemDto.Response> getMyActionItems(Long userId) {
    return userActionItemRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public ActionItemDto.Response completeActionItem(Long userId, Long userActionItemId) {
    UserActionItem item = userActionItemRepository.findById(userActionItemId)
        .orElseThrow(() -> new ResourceNotFoundException("액션 아이템을 찾을 수 없습니다."));
    if (!item.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("본인의 액션 아이템만 완료할 수 있습니다.");
    }
    item.complete();
    return toResponse(item);
  }

  private ActionItemDto.Response toResponse(UserActionItem uai) {
    var item = uai.getActionItem();
    Long questId = (uai.getCounselingSession() != null)
        ? userQuestRepository.findByCounselingSessionId(uai.getCounselingSession().getId())
            .map(q -> q.getId()).orElse(null)
        : null;
    return ActionItemDto.Response.builder()
        .id(uai.getId())
        .title(item.getTitle())
        .description(item.getDescription())
        .category(item.getCategory().name())
        .categoryName(item.getCategory().getDisplayName())
        .format(item.getFormat().name())
        .formatName(item.getFormat().getDisplayName())
        .estimatedMinutes(item.getEstimatedMinutes())
        .status(uai.getStatus().name())
        .createdAt(uai.getCreatedAt())
        .recoveryTypeDescription(item.getCategory().getDescription())
        .questId(questId)
        .build();
  }
}
