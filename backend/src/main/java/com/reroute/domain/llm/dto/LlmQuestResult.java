package com.reroute.domain.llm.dto;

import java.util.List;

public record LlmQuestResult(
    String title,
    String background,
    String why,
    List<String> steps,
    List<String> tips,
    int estimatedMinutes,
    int difficulty
) {}
