package com.reroute.domain.llm.service;

import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.llm.dto.LlmAnalysisResult;
import com.reroute.domain.llm.dto.LlmChatMessage;
import com.reroute.domain.llm.dto.LlmCounselingReply;
import com.reroute.domain.llm.dto.LlmQuestResult;

import java.util.List;

public interface LlmClient {
  LlmAnalysisResult analyzeRecoveryType(Long userId, List<LlmChatMessage> conversation);
  LlmCounselingReply generateCounselingReply(Long userId, List<LlmChatMessage> conversation, RecoveryType primaryType);
  LlmQuestResult generateQuest(List<LlmChatMessage> conversation, RecoveryType recoveryType, String analysisSummary);
  /** 리허설 대화를 기반으로 스킬 향상 퀘스트를 생성합니다. */
  LlmQuestResult generateRehearsalQuest(List<LlmChatMessage> conversation, String scenarioName, String scenarioGoal, String feedback);
  /** Single-turn JSON completion. Returns raw JSON string. */
  String complete(String systemPrompt, String userMessage, double temperature);
  /** Multi-turn JSON completion with conversation history. Returns raw JSON string. */
  String completeWithHistory(String systemPrompt, List<LlmChatMessage> history, double temperature);
}
