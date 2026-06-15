package com.reroute.domain.community.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reroute.domain.community.dto.CommunityDto;
import com.reroute.domain.community.dto.CommunityModerationDecision;
import com.reroute.domain.community.entity.Campfire;
import com.reroute.domain.community.entity.CampfireMessage;
import com.reroute.domain.community.entity.CampfireMember;
import com.reroute.domain.community.entity.CommunityCategory;
import com.reroute.domain.community.entity.CommunityComment;
import com.reroute.domain.community.entity.CommunityCommentLike;
import com.reroute.domain.community.entity.CommunityModerationLog;
import com.reroute.domain.community.entity.CommunityPost;
import com.reroute.domain.community.entity.CommunityPostLike;
import com.reroute.domain.community.repository.CampfireMessageRepository;
import com.reroute.domain.community.repository.CampfireMemberRepository;
import com.reroute.domain.community.repository.CampfireRepository;
import com.reroute.domain.community.repository.CommunityCategoryRepository;
import com.reroute.domain.community.repository.CommunityCommentLikeRepository;
import com.reroute.domain.community.repository.CommunityCommentRepository;
import com.reroute.domain.community.repository.CommunityModerationLogRepository;
import com.reroute.domain.community.repository.CommunityPostLikeRepository;
import com.reroute.domain.community.repository.CommunityPostRepository;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.repository.UserRepository;
import com.reroute.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityService {

  private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  private final CommunityPostRepository postRepository;
  private final CommunityCategoryRepository categoryRepository;
  private final CommunityCommentRepository commentRepository;
  private final CommunityPostLikeRepository postLikeRepository;
  private final CommunityCommentLikeRepository commentLikeRepository;
  private final CommunityModerationLogRepository moderationLogRepository;
  private final CampfireRepository campfireRepository;
  private final CampfireMemberRepository campfireMemberRepository;
  private final CampfireMessageRepository campfireMessageRepository;
  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;
  private final CommunityModerationService moderationService;

  public List<CommunityDto.PostSummaryResponse> getPosts(Long userId, String category) {
    List<CommunityPost> posts = StringUtils.hasText(category) && !"전체".equals(category)
        ? postRepository.findByCategoryOrderByCreatedAtDesc(category)
        : postRepository.findAllByOrderByCreatedAtDesc();

    return posts.stream()
        .map(post -> toPostSummary(post, userId))
        .toList();
  }

  public CommunityDto.PostDetailResponse getPost(Long userId, Long postId) {
    CommunityPost post = getPostOrThrow(postId);
    return toPostDetail(post, userId);
  }

  @Transactional
  public CommunityDto.PostDetailResponse createPost(Long userId, CommunityDto.PostRequest req) {
    CommunityModerationDecision decision = moderationService.inspect(
        userId,
        "POST",
        buildPostModerationContent(req)
    );
    User user = getUser(userId);
    CommunityCategory category = getOrCreateCategory(req.getCategory().trim());
    CommunityPost post = postRepository.save(CommunityPost.builder()
        .author(user)
        .legacyAuthor(user)
        .categoryRef(category)
        .category(req.getCategory().trim())
        .anonymousName(user.getNickname())
        .anonymousType("익명 사용자")
        .title(req.getTitle().trim())
        .content(req.getContent().trim())
        .tagsJson(writeTags(req.getTags()))
        .build());
    return toPostDetail(post, userId, safetyNotice(decision));
  }

  @Transactional
  public CommunityDto.PostDetailResponse updatePost(Long userId, Long postId, CommunityDto.PostRequest req) {
    CommunityPost post = getPostOrThrow(postId);
    assertOwner(userId, post.getAuthor().getId(), "본인이 작성한 게시글만 수정할 수 있습니다.");
    CommunityModerationDecision decision = moderationService.inspect(
        userId,
        "POST",
        buildPostModerationContent(req)
    );
    post.update(
        getOrCreateCategory(req.getCategory().trim()),
        req.getCategory().trim(),
        req.getTitle().trim(),
        req.getContent().trim(),
        writeTags(req.getTags())
    );
    return toPostDetail(post, userId, safetyNotice(decision));
  }

  @Transactional
  public void deletePost(Long userId, Long postId) {
    CommunityPost post = getPostOrThrow(postId);
    assertOwner(userId, post.getAuthor().getId(), "본인이 작성한 게시글만 삭제할 수 있습니다.");
    commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
        .forEach(comment -> commentLikeRepository.deleteByCommentId(comment.getId()));
    commentRepository.deleteByPostId(postId);
    postLikeRepository.deleteByPostId(postId);
    postRepository.delete(post);
  }

  @Transactional
  public CommunityDto.PostDetailResponse likePost(Long userId, Long postId) {
    CommunityPost post = getPostOrThrow(postId);
    if (!postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
      postLikeRepository.save(CommunityPostLike.builder()
          .post(post)
          .user(getUser(userId))
          .build());
    }
    return toPostDetail(post, userId);
  }

  @Transactional
  public CommunityDto.PostDetailResponse unlikePost(Long userId, Long postId) {
    CommunityPost post = getPostOrThrow(postId);
    postLikeRepository.findByPostIdAndUserId(postId, userId).ifPresent(postLikeRepository::delete);
    return toPostDetail(post, userId);
  }

  @Transactional
  public CommunityDto.CommentResponse createComment(Long userId, Long postId, CommunityDto.CommentRequest req) {
    CommunityModerationDecision decision = moderationService.inspect(userId, "COMMENT", req.getContent());
    CommunityComment comment = commentRepository.save(CommunityComment.builder()
        .post(getPostOrThrow(postId))
        .author(getUser(userId))
        .content(req.getContent().trim())
        .build());
    return toCommentResponse(comment, userId, safetyNotice(decision));
  }

  @Transactional
  public CommunityDto.CommentResponse updateComment(Long userId, Long commentId, CommunityDto.CommentRequest req) {
    CommunityComment comment = getCommentOrThrow(commentId);
    assertOwner(userId, comment.getAuthor().getId(), "본인이 작성한 댓글만 수정할 수 있습니다.");
    CommunityModerationDecision decision = moderationService.inspect(userId, "COMMENT", req.getContent());
    comment.update(req.getContent().trim());
    return toCommentResponse(comment, userId, safetyNotice(decision));
  }

  @Transactional
  public void deleteComment(Long userId, Long commentId) {
    CommunityComment comment = getCommentOrThrow(commentId);
    assertOwner(userId, comment.getAuthor().getId(), "본인이 작성한 댓글만 삭제할 수 있습니다.");
    commentLikeRepository.deleteByCommentId(commentId);
    commentRepository.delete(comment);
  }

  @Transactional
  public CommunityDto.CommentResponse likeComment(Long userId, Long commentId) {
    CommunityComment comment = getCommentOrThrow(commentId);
    if (!commentLikeRepository.existsByCommentIdAndUserId(commentId, userId)) {
      commentLikeRepository.save(CommunityCommentLike.builder()
          .comment(comment)
          .user(getUser(userId))
          .build());
    }
    return toCommentResponse(comment, userId);
  }

  @Transactional
  public CommunityDto.CommentResponse unlikeComment(Long userId, Long commentId) {
    CommunityComment comment = getCommentOrThrow(commentId);
    commentLikeRepository.findByCommentIdAndUserId(commentId, userId).ifPresent(commentLikeRepository::delete);
    return toCommentResponse(comment, userId);
  }

  public List<CommunityDto.CampfireResponse> getCampfires(Long userId, Boolean openOnly) {
    List<Campfire> campfires = Boolean.TRUE.equals(openOnly)
        ? campfireRepository.findByOpenTrueOrderByCreatedAtDesc()
        : campfireRepository.findAllByOrderByCreatedAtDesc();
    return campfires.stream()
        .map(campfire -> toCampfireResponse(campfire, userId))
        .toList();
  }

  public CommunityDto.CampfireResponse getCampfire(Long userId, Long campfireId) {
    return toCampfireResponse(getCampfireOrThrow(campfireId), userId);
  }

  @Transactional
  public CommunityDto.CampfireResponse createCampfire(Long userId, CommunityDto.CampfireRequest req) {
    CommunityModerationDecision decision = moderationService.inspect(
        userId,
        "CAMPFIRE",
        buildCampfireModerationContent(req)
    );
    User user = getUser(userId);
    Campfire campfire = campfireRepository.save(Campfire.builder()
        .owner(user)
        .name(req.getName().trim())
        .description(req.getDescription().trim())
        .keyword(req.getKeyword().trim())
        .open(req.getOpen())
        .build());
    campfireMemberRepository.save(CampfireMember.builder()
        .campfire(campfire)
        .user(user)
        .build());
    return toCampfireResponse(campfire, userId, safetyNotice(decision));
  }

  @Transactional
  public CommunityDto.CampfireResponse updateCampfire(Long userId, Long campfireId, CommunityDto.CampfireRequest req) {
    Campfire campfire = getCampfireOrThrow(campfireId);
    assertOwner(userId, campfire.getOwner().getId(), "본인이 만든 캠프파이어만 수정할 수 있습니다.");
    CommunityModerationDecision decision = moderationService.inspect(
        userId,
        "CAMPFIRE",
        buildCampfireModerationContent(req)
    );
    campfire.update(req.getName().trim(), req.getDescription().trim(), req.getKeyword().trim(), req.getOpen());
    return toCampfireResponse(campfire, userId, safetyNotice(decision));
  }

  public List<CommunityDto.ModerationLogResponse> getModerationLogs(Long userId) {
    User user = getUser(userId);
    if (user.getRole() != User.UserRole.ADMIN) {
      throw new IllegalArgumentException("관리자만 커뮤니티 검사 기록을 조회할 수 있습니다.");
    }
    return moderationLogRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(this::toModerationLogResponse)
        .toList();
  }

  @Transactional
  public void deleteCampfire(Long userId, Long campfireId) {
    Campfire campfire = getCampfireOrThrow(campfireId);
    assertOwner(userId, campfire.getOwner().getId(), "본인이 만든 캠프파이어만 삭제할 수 있습니다.");
    campfireMessageRepository.deleteByCampfireId(campfireId);
    campfireMemberRepository.deleteByCampfireId(campfireId);
    campfireRepository.delete(campfire);
  }

  public List<CommunityDto.CampfireMessageResponse> getCampfireMessages(Long userId, Long campfireId, Long afterId) {
    if (!campfireMemberRepository.existsByCampfireIdAndUserId(campfireId, userId)) {
      throw new IllegalArgumentException("캠프파이어 멤버만 메시지를 조회할 수 있습니다.");
    }
    List<CampfireMessage> messages = afterId != null
        ? campfireMessageRepository.findByCampfireIdAndIdGreaterThanOrderByCreatedAtAsc(campfireId, afterId)
        : campfireMessageRepository.findByCampfireIdOrderByCreatedAtAsc(campfireId);
    return messages.stream()
        .map(m -> toCampfireMessageResponse(m, userId))
        .toList();
  }

  @Transactional
  public CommunityDto.CampfireMessageResponse sendCampfireMessage(Long userId, Long campfireId, CommunityDto.CampfireMessageRequest req) {
    if (!campfireMemberRepository.existsByCampfireIdAndUserId(campfireId, userId)) {
      throw new IllegalArgumentException("캠프파이어 멤버만 메시지를 보낼 수 있습니다.");
    }
    moderationService.inspect(userId, "CAMPFIRE_MESSAGE", req.getContent());
    Campfire campfire = getCampfireOrThrow(campfireId);
    CampfireMessage message = campfireMessageRepository.save(CampfireMessage.builder()
        .campfire(campfire)
        .sender(getUser(userId))
        .content(req.getContent().trim())
        .build());
    return toCampfireMessageResponse(message, userId);
  }

  private CommunityDto.CampfireMessageResponse toCampfireMessageResponse(CampfireMessage message, Long userId) {
    return CommunityDto.CampfireMessageResponse.builder()
        .id(message.getId())
        .sender(message.getSender().getNickname())
        .mine(message.getSender().getId().equals(userId))
        .content(message.getContent())
        .createdAt(formatDateTime(message.getCreatedAt()))
        .build();
  }

  @Transactional
  public CommunityDto.CampfireResponse joinCampfire(Long userId, Long campfireId) {
    Campfire campfire = getCampfireOrThrow(campfireId);
    if (!campfire.isOpen()) {
      throw new IllegalArgumentException("닫힌 캠프파이어에는 참여할 수 없습니다.");
    }
    if (!campfireMemberRepository.existsByCampfireIdAndUserId(campfireId, userId)) {
      campfireMemberRepository.save(CampfireMember.builder()
          .campfire(campfire)
          .user(getUser(userId))
          .build());
    }
    return toCampfireResponse(campfire, userId);
  }

  @Transactional
  public CommunityDto.CampfireResponse leaveCampfire(Long userId, Long campfireId) {
    Campfire campfire = getCampfireOrThrow(campfireId);
    if (campfire.getOwner().getId().equals(userId)) {
      throw new IllegalArgumentException("캠프파이어 만든 사람은 참여 해제할 수 없습니다. 삭제하거나 닫아주세요.");
    }
    campfireMemberRepository.findByCampfireIdAndUserId(campfireId, userId).ifPresent(campfireMemberRepository::delete);
    return toCampfireResponse(campfire, userId);
  }

  public List<CommunityDto.CampfireResponse> getAllCampfiresForAdmin() {
    return campfireRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(campfire -> toCampfireResponse(campfire, null))
        .toList();
  }

  @Transactional
  public void adminDeleteCampfire(Long campfireId) {
    Campfire campfire = getCampfireOrThrow(campfireId);
    campfireMessageRepository.deleteByCampfireId(campfireId);
    campfireMemberRepository.deleteByCampfireId(campfireId);
    campfireRepository.delete(campfire);
  }

  public List<CommunityDto.CampfireMessageResponse> adminGetCampfireMessages(Long campfireId) {
    getCampfireOrThrow(campfireId);
    return campfireMessageRepository.findByCampfireIdOrderByCreatedAtAsc(campfireId).stream()
        .map(m -> toCampfireMessageResponse(m, -1L))
        .toList();
  }

  @Transactional
  public void adminDeleteCampfireMessage(Long campfireId, Long messageId) {
    getCampfireOrThrow(campfireId);
    CampfireMessage message = campfireMessageRepository.findById(messageId)
        .orElseThrow(() -> new ResourceNotFoundException("메시지를 찾을 수 없습니다."));
    campfireMessageRepository.delete(message);
  }

  public List<CommunityDto.PostSummaryResponse> getAllPostsForAdmin() {
    return postRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(post -> toPostSummary(post, null))
        .toList();
  }

  @Transactional
  public void adminDeletePost(Long postId) {
    CommunityPost post = getPostOrThrow(postId);
    commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
        .forEach(comment -> commentLikeRepository.deleteByCommentId(comment.getId()));
    commentRepository.deleteByPostId(postId);
    postLikeRepository.deleteByPostId(postId);
    postRepository.delete(post);
  }

  public List<CommunityDto.CommentResponse> getAllCommentsForAdmin(Long postId) {
    getPostOrThrow(postId);
    return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
        .map(this::toCommentResponseForAdmin)
        .toList();
  }

  @Transactional
  public void adminDeleteComment(Long commentId) {
    CommunityComment comment = getCommentOrThrow(commentId);
    commentLikeRepository.deleteByCommentId(commentId);
    commentRepository.delete(comment);
  }

  private CommunityDto.CommentResponse toCommentResponseForAdmin(CommunityComment comment) {
    return CommunityDto.CommentResponse.builder()
        .id(comment.getId())
        .postId(comment.getPost().getId())
        .author(comment.getAuthor().getNickname())
        .authorType("익명 사용자")
        .content(comment.getContent())
        .createdAt(formatDateTime(comment.getCreatedAt()))
        .updatedAt(formatDateTime(comment.getUpdatedAt()))
        .likes(commentLikeRepository.countByCommentId(comment.getId()))
        .liked(false)
        .mine(false)
        .build();
  }

  private CommunityDto.PostSummaryResponse toPostSummary(CommunityPost post, Long userId) {
    return CommunityDto.PostSummaryResponse.builder()
        .id(post.getId())
        .category(post.getCategory())
        .title(post.getTitle())
        .preview(makePreview(post.getContent()))
        .author(post.getAuthor().getNickname())
        .authorType("익명 사용자")
        .createdAt(formatDateTime(post.getCreatedAt()))
        .updatedAt(formatDateTime(post.getUpdatedAt()))
        .likes(postLikeRepository.countByPostId(post.getId()))
        .commentCount(commentRepository.countByPostId(post.getId()))
        .liked(userId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), userId))
        .mine(userId != null && post.getAuthor().getId().equals(userId))
        .tags(readTags(post.getTagsJson()))
        .build();
  }

  private CommunityDto.PostDetailResponse toPostDetail(CommunityPost post, Long userId) {
    return toPostDetail(post, userId, null);
  }

  private CommunityDto.PostDetailResponse toPostDetail(CommunityPost post, Long userId, String safetyNotice) {
    List<CommunityDto.CommentResponse> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId()).stream()
        .map(comment -> toCommentResponse(comment, userId))
        .toList();
    return CommunityDto.PostDetailResponse.builder()
        .id(post.getId())
        .category(post.getCategory())
        .title(post.getTitle())
        .content(post.getContent())
        .preview(makePreview(post.getContent()))
        .author(post.getAuthor().getNickname())
        .authorType("익명 사용자")
        .createdAt(formatDateTime(post.getCreatedAt()))
        .updatedAt(formatDateTime(post.getUpdatedAt()))
        .likes(postLikeRepository.countByPostId(post.getId()))
        .liked(postLikeRepository.existsByPostIdAndUserId(post.getId(), userId))
        .mine(post.getAuthor().getId().equals(userId))
        .tags(readTags(post.getTagsJson()))
        .comments(comments)
        .safetyNotice(safetyNotice)
        .build();
  }

  private CommunityDto.CommentResponse toCommentResponse(CommunityComment comment, Long userId) {
    return toCommentResponse(comment, userId, null);
  }

  private CommunityDto.CommentResponse toCommentResponse(
      CommunityComment comment,
      Long userId,
      String safetyNotice
  ) {
    return CommunityDto.CommentResponse.builder()
        .id(comment.getId())
        .postId(comment.getPost().getId())
        .author(comment.getAuthor().getNickname())
        .authorType("익명 사용자")
        .content(comment.getContent())
        .createdAt(formatDateTime(comment.getCreatedAt()))
        .updatedAt(formatDateTime(comment.getUpdatedAt()))
        .likes(commentLikeRepository.countByCommentId(comment.getId()))
        .liked(commentLikeRepository.existsByCommentIdAndUserId(comment.getId(), userId))
        .mine(comment.getAuthor().getId().equals(userId))
        .safetyNotice(safetyNotice)
        .build();
  }

  private CommunityDto.CampfireResponse toCampfireResponse(Campfire campfire, Long userId) {
    return toCampfireResponse(campfire, userId, null);
  }

  private CommunityDto.CampfireResponse toCampfireResponse(Campfire campfire, Long userId, String safetyNotice) {
    return CommunityDto.CampfireResponse.builder()
        .id(campfire.getId())
        .name(campfire.getName())
        .desc(campfire.getDescription())
        .description(campfire.getDescription())
        .keyword(campfire.getKeyword())
        .owner(campfire.getOwner().getNickname())
        .open(campfire.isOpen())
        .members(campfireMemberRepository.countByCampfireId(campfire.getId()))
        .joined(campfireMemberRepository.existsByCampfireIdAndUserId(campfire.getId(), userId))
        .mine(campfire.getOwner().getId().equals(userId))
        .createdAt(formatDateTime(campfire.getCreatedAt()))
        .updatedAt(formatDateTime(campfire.getUpdatedAt()))
        .safetyNotice(safetyNotice)
        .build();
  }

  private CommunityDto.ModerationLogResponse toModerationLogResponse(CommunityModerationLog log) {
    return CommunityDto.ModerationLogResponse.builder()
        .id(log.getId())
        .userId(log.getUser().getId())
        .userEmail(log.getUser().getEmail())
        .targetType(log.getTargetType())
        .action(log.getAction())
        .submittedContent(log.getSubmittedContent())
        .reason(log.getReason())
        .categories(readTags(log.getCategoriesJson()))
        .selfHarmRisk(log.isSelfHarmRisk())
        .createdAt(formatDateTime(log.getCreatedAt()))
        .build();
  }

  private User getUser(Long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
  }

  private CommunityCategory getOrCreateCategory(String name) {
    return categoryRepository.findByName(name)
        .orElseGet(() -> categoryRepository.save(CommunityCategory.builder()
            .name(name)
            .displayOrder(0)
            .build()));
  }

  private CommunityPost getPostOrThrow(Long postId) {
    return postRepository.findById(postId)
        .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다."));
  }

  private CommunityComment getCommentOrThrow(Long commentId) {
    return commentRepository.findById(commentId)
        .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다."));
  }

  private Campfire getCampfireOrThrow(Long campfireId) {
    return campfireRepository.findById(campfireId)
        .orElseThrow(() -> new ResourceNotFoundException("캠프파이어를 찾을 수 없습니다."));
  }

  private void assertOwner(Long userId, Long ownerId, String message) {
    if (!ownerId.equals(userId)) {
      throw new IllegalArgumentException(message);
    }
  }

  private String writeTags(List<String> tags) {
    List<String> sanitized = tags == null ? List.of() : new LinkedHashSet<>(tags).stream()
        .filter(StringUtils::hasText)
        .map(tag -> tag.trim().replaceFirst("^#", ""))
        .filter(StringUtils::hasText)
        .limit(5)
        .toList();
    try {
      return objectMapper.writeValueAsString(sanitized);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("태그를 저장할 수 없습니다.", e);
    }
  }

  private String buildPostModerationContent(CommunityDto.PostRequest req) {
    String tags = req.getTags() == null ? "" : String.join(" ", req.getTags());
    return "제목: " + req.getTitle() + "\n내용: " + req.getContent() + "\n태그: " + tags;
  }

  private String buildCampfireModerationContent(CommunityDto.CampfireRequest req) {
    return "이름: " + req.getName()
        + "\n설명: " + req.getDescription()
        + "\n키워드: " + req.getKeyword();
  }

  private String safetyNotice(CommunityModerationDecision decision) {
    return decision.selfHarmRisk() ? CommunityModerationService.CRISIS_NOTICE : null;
  }

  private List<String> readTags(String tagsJson) {
    if (!StringUtils.hasText(tagsJson)) {
      return List.of();
    }
    try {
      return objectMapper.readValue(tagsJson, new TypeReference<>() {
      });
    } catch (JsonProcessingException e) {
      return List.of();
    }
  }

  private String makePreview(String content) {
    String normalized = content == null ? "" : content.replaceAll("\\s+", " ").trim();
    return normalized.length() <= 80 ? normalized : normalized.substring(0, 80) + "...";
  }

  private String formatDateTime(LocalDateTime dateTime) {
    return dateTime == null ? null : dateTime.format(DATE_TIME_FORMATTER);
  }
}
