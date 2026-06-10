package com.reroute.domain.llm.dto;

public record LlmCounselingReply(
    String content,
    String riskLevel,
    boolean fallback,
    boolean suggestClose
) {
}
