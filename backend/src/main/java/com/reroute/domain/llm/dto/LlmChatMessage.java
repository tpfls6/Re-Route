package com.reroute.domain.llm.dto;

public record LlmChatMessage(
    String role,
    String content
) {
}
