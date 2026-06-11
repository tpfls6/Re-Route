package com.reroute.domain.llm.dto;

import com.reroute.domain.common.RecoveryType;

import java.util.List;

public record LlmAnalysisResult(
    RecoveryType recoveryType,
    double confidence,
    String summary,
    String reason,
    List<String> emotionKeywords,
    String sessionTitle
) {
}
