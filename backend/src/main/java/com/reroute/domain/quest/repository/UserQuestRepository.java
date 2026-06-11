package com.reroute.domain.quest.repository;

import com.reroute.domain.quest.entity.UserQuest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserQuestRepository extends JpaRepository<UserQuest, Long> {
  List<UserQuest> findByUserIdOrderByCreatedAtDesc(Long userId);
  Optional<UserQuest> findByCounselingSessionId(Long sessionId);
  void deleteByUserId(Long userId);
  void deleteByCounselingSessionId(Long sessionId);
  int countByUserIdAndStatus(Long userId, UserQuest.QuestStatus status);
  List<UserQuest> findByUserIdAndStatus(Long userId, UserQuest.QuestStatus status);
}
