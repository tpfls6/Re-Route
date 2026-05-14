package com.reroute.domain.counseling.controller;

import com.reroute.domain.counseling.service.CounselingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/counseling")
@RequiredArgsConstructor
public class CounselingController {

  private final CounselingService counselingService;
}
