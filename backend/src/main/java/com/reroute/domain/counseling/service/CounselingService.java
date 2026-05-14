package com.reroute.domain.counseling.service;

import com.reroute.domain.counseling.repository.CounselingSessionRepository;
import com.reroute.domain.counseling.repository.CounselingMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CounselingService {

  private final CounselingSessionRepository counselingSessionRepository;
  private final CounselingMessageRepository counselingMessageRepository;
}
