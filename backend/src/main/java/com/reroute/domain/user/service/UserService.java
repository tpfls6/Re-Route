package com.reroute.domain.user.service;

import com.reroute.domain.actionitem.entity.UserActionItem;
import com.reroute.domain.actionitem.repository.UserActionItemRepository;
import com.reroute.domain.quest.entity.UserQuest;
import com.reroute.domain.quest.repository.UserQuestRepository;
import com.reroute.domain.auth.entity.EmailVerification;
import com.reroute.domain.auth.repository.RefreshTokenRepository;
import com.reroute.domain.auth.service.EmailVerificationService;
import com.reroute.domain.common.RecoveryType;
import com.reroute.domain.counseling.entity.CounselingSession;
import com.reroute.domain.counseling.repository.CounselingAnalysisRepository;
import com.reroute.domain.counseling.repository.CounselingMessageRepository;
import com.reroute.domain.counseling.repository.CounselingSessionRepository;
import com.reroute.domain.counseling.repository.EmotionLogRepository;
import com.reroute.domain.user.dto.UserDto;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final UserActionItemRepository userActionItemRepository;
  private final UserQuestRepository userQuestRepository;
  private final CounselingSessionRepository counselingSessionRepository;
  private final CounselingMessageRepository counselingMessageRepository;
  private final CounselingAnalysisRepository counselingAnalysisRepository;
  private final EmotionLogRepository emotionLogRepository;
  private final PasswordEncoder passwordEncoder;
  private final EmailVerificationService emailVerificationService;

  private static final List<RecoveryType> QUESTION_TYPE_MAP = List.of(
      RecoveryType.AVOIDANT,
      RecoveryType.OVERFOCUSED,
      RecoveryType.LETHARGIC,
      RecoveryType.RELATION_ANXIOUS,
      RecoveryType.PERFECTIONIST,
      RecoveryType.AVOIDANT,
      RecoveryType.OVERFOCUSED,
      RecoveryType.LETHARGIC,
      RecoveryType.RELATION_ANXIOUS,
      RecoveryType.PERFECTIONIST
  );

  private static final List<String> QUESTION_TEXTS = List.of(
      "해야 할 일이 생기면 자꾸 미루게 되는 편인가요?",
      "한 가지 걱정이 머릿속에서 계속 맴돌 때가 많나요?",
      "뭔가 시작하는 것 자체가 특히 힘들게 느껴지나요?",
      "상대방의 반응이나 답장이 많이 신경 쓰이나요?",
      "실수할까봐 행동을 주저할 때가 많나요?",
      "불편한 감정이나 상황을 피하려는 경향이 있나요?",
      "특정 관계나 목표에 지나치게 집착하게 되는 편인가요?",
      "에너지나 의욕이 없어서 일상이 잘 안 돌아갈 때가 있나요?",
      "거절당하거나 무시당할까봐 두려울 때가 있나요?",
      "완벽하게 못 할 것 같아서 시작을 못 하는 경우가 있나요?"
  );

  public List<UserDto.OnboardingQuestionResponse> getOnboardingQuestions() {
    List<UserDto.OnboardingQuestionResponse> result = new ArrayList<>();
    for (int i = 0; i < QUESTION_TEXTS.size(); i++) {
      result.add(UserDto.OnboardingQuestionResponse.builder()
          .questionNumber(i + 1)
          .text(QUESTION_TEXTS.get(i))
          .recoveryType(QUESTION_TYPE_MAP.get(i))
          .build());
    }
    return result;
  }

  @Transactional
  public UserDto.Response completeOnboarding(Long userId, UserDto.OnboardingRequest req) {
    User user = findUser(userId);
    RecoveryType result = calculateRecoveryType(req.getAnswers());
    user.completeOnboarding(result);
    return toResponse(user);
  }

  public UserDto.Response getMyPage(Long userId) {
    return toResponse(findUser(userId));
  }

  public UserDto.StatsResponse getUserStats(Long userId) {
    int questsCompleted = userQuestRepository.countByUserIdAndStatus(userId, UserQuest.QuestStatus.COMPLETED);
    int actionItemsCompleted = userActionItemRepository.countByUserIdAndStatus(userId, UserActionItem.CompletionStatus.COMPLETED);
    int totalSessions = counselingSessionRepository.findByUserIdOrderByCreatedAtDesc(userId).size();

    Set<LocalDate> activeDates = new HashSet<>();
    userQuestRepository.findByUserIdAndStatus(userId, UserQuest.QuestStatus.COMPLETED)
        .forEach(q -> { if (q.getCompletedAt() != null) activeDates.add(q.getCompletedAt().toLocalDate()); });
    userActionItemRepository.findByUserIdAndStatus(userId, UserActionItem.CompletionStatus.COMPLETED)
        .forEach(a -> { if (a.getCompletedAt() != null) activeDates.add(a.getCompletedAt().toLocalDate()); });

    int streakDays = 0;
    LocalDate day = LocalDate.now();
    while (activeDates.contains(day)) {
      streakDays++;
      day = day.minusDays(1);
    }

    int confidenceScore = Math.min(100, questsCompleted * 10 + actionItemsCompleted * 2);

    return UserDto.StatsResponse.builder()
        .questsCompleted(questsCompleted)
        .actionItemsCompleted(actionItemsCompleted)
        .streakDays(streakDays)
        .confidenceScore(confidenceScore)
        .totalSessions(totalSessions)
        .build();
  }

  @Transactional
  public UserDto.Response updateMyPage(Long userId, UserDto.MyPageUpdateRequest req) {
    User user = findUser(userId);
    boolean nicknameRequested = StringUtils.hasText(req.getNickname());
    boolean passwordRequested = StringUtils.hasText(req.getNewPassword());

    if (!nicknameRequested && !passwordRequested) {
      throw new IllegalArgumentException("수정할 닉네임 또는 새 비밀번호를 입력해주세요.");
    }

    emailVerificationService.verifyAndConsume(
        user.getEmail(),
        req.getEmailVerificationCode(),
        EmailVerification.Purpose.PROFILE_UPDATE
    );

    if (nicknameRequested) {
      user.changeNickname(req.getNickname());
    }

    if (passwordRequested) {
      changePassword(user, req);
      refreshTokenRepository.findByUserIdAndRevokedFalse(userId)
          .forEach(token -> token.revoke());
    }

    return toResponse(user);
  }

  @Transactional
  public void deleteMyAccount(Long userId) {
    User user = findUser(userId);

    refreshTokenRepository.deleteByUserId(userId);
    userActionItemRepository.deleteByUserId(userId);
    userQuestRepository.deleteByUserId(userId);
    emotionLogRepository.deleteByUserId(userId);
    deleteCounselingData(userId);
    userRepository.delete(user);
  }

  public List<UserDto.AdminUserSummary> getAllUsersForAdmin() {
    return userRepository.findAll(org.springframework.data.domain.Sort.by(
        org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
        .stream()
        .map(this::toAdminUserSummary)
        .toList();
  }

  @Transactional
  public void adminDeleteUser(Long adminId, Long targetUserId) {
    if (adminId.equals(targetUserId)) {
      throw new IllegalArgumentException("본인 계정은 관리자 기능으로 삭제할 수 없습니다.");
    }
    User target = findUser(targetUserId);
    refreshTokenRepository.deleteByUserId(targetUserId);
    userActionItemRepository.deleteByUserId(targetUserId);
    userQuestRepository.deleteByUserId(targetUserId);
    emotionLogRepository.deleteByUserId(targetUserId);
    deleteCounselingData(targetUserId);
    userRepository.delete(target);
  }

  private UserDto.AdminUserSummary toAdminUserSummary(User user) {
    return UserDto.AdminUserSummary.builder()
        .id(user.getId())
        .email(user.getEmail())
        .nickname(user.getNickname())
        .role(user.getRole().name())
        .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate().toString() : null)
        .build();
  }

  private RecoveryType calculateRecoveryType(List<Integer> answers) {
    Map<RecoveryType, Integer> scores = new EnumMap<>(RecoveryType.class);
    for (RecoveryType type : RecoveryType.values()) {
      scores.put(type, 0);
    }
    for (int i = 0; i < answers.size(); i++) {
      RecoveryType type = QUESTION_TYPE_MAP.get(i);
      scores.merge(type, answers.get(i), Integer::sum);
    }
    return scores.entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse(RecoveryType.LETHARGIC);
  }

  private void changePassword(User user, UserDto.MyPageUpdateRequest req) {
    if (!StringUtils.hasText(req.getCurrentPassword())) {
      throw new IllegalArgumentException("현재 비밀번호를 입력해주세요.");
    }
    if (!StringUtils.hasText(req.getNewPasswordConfirm())) {
      throw new IllegalArgumentException("새 비밀번호 확인을 입력해주세요.");
    }
    if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
      throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
    }
    if (!req.getNewPassword().equals(req.getNewPasswordConfirm())) {
      throw new IllegalArgumentException("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
    }
    if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
      throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
    }
    user.changePassword(passwordEncoder.encode(req.getNewPassword()));
  }

  private void deleteCounselingData(Long userId) {
    List<CounselingSession> sessions = counselingSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    for (CounselingSession session : sessions) {
      counselingAnalysisRepository.deleteBySessionId(session.getId());
      counselingMessageRepository.deleteBySessionId(session.getId());
    }
    counselingSessionRepository.deleteAll(sessions);
  }

  private User findUser(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
  }

  private UserDto.Response toResponse(User user) {
    String typeName = user.getPrimaryRecoveryType() != null
        ? user.getPrimaryRecoveryType().getDisplayName()
        : null;
    return UserDto.Response.builder()
        .id(user.getId())
        .email(user.getEmail())
        .nickname(user.getNickname())
        .onboardingCompleted(user.isOnboardingCompleted())
        .primaryRecoveryType(user.getPrimaryRecoveryType())
        .primaryRecoveryTypeName(typeName)
        .build();
  }
}
