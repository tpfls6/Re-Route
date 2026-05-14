package com.reroute.domain.actionitem.controller;

import com.reroute.domain.actionitem.service.ActionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/action-items")
@RequiredArgsConstructor
public class ActionItemController {

  private final ActionItemService actionItemService;
}
