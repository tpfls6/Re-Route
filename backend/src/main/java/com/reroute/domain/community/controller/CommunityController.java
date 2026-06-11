package com.reroute.domain.community.controller;

import com.reroute.domain.community.dto.CommunityDto;
import com.reroute.domain.community.service.CommunityService;
import com.reroute.domain.user.entity.User;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Community", description = "게시판 및 캠프파이어 API")
public class CommunityController {

  private final CommunityService communityService;

  @Operation(summary = "커뮤니티 안전 검사 기록 조회", description = "관리자만 전체 판정 기록을 최신순으로 조회할 수 있습니다.")
  @GetMapping("/moderation-logs")
  public ApiResponse<List<CommunityDto.ModerationLogResponse>> getModerationLogs(
      @AuthenticationPrincipal User user
  ) {
    return ApiResponse.success(communityService.getModerationLogs(user.getId()));
  }

  @Operation(summary = "게시글 목록 조회")
  @GetMapping("/posts")
  public ApiResponse<List<CommunityDto.PostSummaryResponse>> getPosts(
      @AuthenticationPrincipal User user,
      @RequestParam(required = false) String category
  ) {
    return ApiResponse.success(communityService.getPosts(user.getId(), category));
  }

  @Operation(summary = "게시글 상세 조회")
  @GetMapping("/posts/{postId}")
  public ApiResponse<CommunityDto.PostDetailResponse> getPost(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId
  ) {
    return ApiResponse.success(communityService.getPost(user.getId(), postId));
  }

  @Operation(summary = "게시글 생성")
  @PostMapping("/posts")
  public ApiResponse<CommunityDto.PostDetailResponse> createPost(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody CommunityDto.PostRequest req
  ) {
    return ApiResponse.success(communityService.createPost(user.getId(), req));
  }

  @Operation(summary = "게시글 수정")
  @PatchMapping("/posts/{postId}")
  public ApiResponse<CommunityDto.PostDetailResponse> updatePost(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId,
      @Valid @RequestBody CommunityDto.PostRequest req
  ) {
    return ApiResponse.success(communityService.updatePost(user.getId(), postId, req));
  }

  @Operation(summary = "게시글 삭제")
  @DeleteMapping("/posts/{postId}")
  public ApiResponse<Void> deletePost(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId
  ) {
    communityService.deletePost(user.getId(), postId);
    return ApiResponse.success("게시글이 삭제되었습니다.");
  }

  @Operation(summary = "게시글 좋아요")
  @PostMapping("/posts/{postId}/likes")
  public ApiResponse<CommunityDto.PostDetailResponse> likePost(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId
  ) {
    return ApiResponse.success(communityService.likePost(user.getId(), postId));
  }

  @Operation(summary = "게시글 좋아요 취소")
  @DeleteMapping("/posts/{postId}/likes")
  public ApiResponse<CommunityDto.PostDetailResponse> unlikePost(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId
  ) {
    return ApiResponse.success(communityService.unlikePost(user.getId(), postId));
  }

  @Operation(summary = "댓글 생성")
  @PostMapping("/posts/{postId}/comments")
  public ApiResponse<CommunityDto.CommentResponse> createComment(
      @AuthenticationPrincipal User user,
      @PathVariable Long postId,
      @Valid @RequestBody CommunityDto.CommentRequest req
  ) {
    return ApiResponse.success(communityService.createComment(user.getId(), postId, req));
  }

  @Operation(summary = "댓글 수정")
  @PatchMapping("/comments/{commentId}")
  public ApiResponse<CommunityDto.CommentResponse> updateComment(
      @AuthenticationPrincipal User user,
      @PathVariable Long commentId,
      @Valid @RequestBody CommunityDto.CommentRequest req
  ) {
    return ApiResponse.success(communityService.updateComment(user.getId(), commentId, req));
  }

  @Operation(summary = "댓글 삭제")
  @DeleteMapping("/comments/{commentId}")
  public ApiResponse<Void> deleteComment(
      @AuthenticationPrincipal User user,
      @PathVariable Long commentId
  ) {
    communityService.deleteComment(user.getId(), commentId);
    return ApiResponse.success("댓글이 삭제되었습니다.");
  }

  @Operation(summary = "댓글 좋아요")
  @PostMapping("/comments/{commentId}/likes")
  public ApiResponse<CommunityDto.CommentResponse> likeComment(
      @AuthenticationPrincipal User user,
      @PathVariable Long commentId
  ) {
    return ApiResponse.success(communityService.likeComment(user.getId(), commentId));
  }

  @Operation(summary = "댓글 좋아요 취소")
  @DeleteMapping("/comments/{commentId}/likes")
  public ApiResponse<CommunityDto.CommentResponse> unlikeComment(
      @AuthenticationPrincipal User user,
      @PathVariable Long commentId
  ) {
    return ApiResponse.success(communityService.unlikeComment(user.getId(), commentId));
  }

  @Operation(summary = "캠프파이어 목록 조회")
  @GetMapping("/campfires")
  public ApiResponse<List<CommunityDto.CampfireResponse>> getCampfires(
      @AuthenticationPrincipal User user,
      @RequestParam(required = false, defaultValue = "false") Boolean openOnly
  ) {
    return ApiResponse.success(communityService.getCampfires(user.getId(), openOnly));
  }

  @Operation(summary = "캠프파이어 상세 조회")
  @GetMapping("/campfires/{campfireId}")
  public ApiResponse<CommunityDto.CampfireResponse> getCampfire(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId
  ) {
    return ApiResponse.success(communityService.getCampfire(user.getId(), campfireId));
  }

  @Operation(summary = "캠프파이어 생성")
  @PostMapping("/campfires")
  public ApiResponse<CommunityDto.CampfireResponse> createCampfire(
      @AuthenticationPrincipal User user,
      @Valid @RequestBody CommunityDto.CampfireRequest req
  ) {
    return ApiResponse.success(communityService.createCampfire(user.getId(), req));
  }

  @Operation(summary = "캠프파이어 수정")
  @PatchMapping("/campfires/{campfireId}")
  public ApiResponse<CommunityDto.CampfireResponse> updateCampfire(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId,
      @Valid @RequestBody CommunityDto.CampfireRequest req
  ) {
    return ApiResponse.success(communityService.updateCampfire(user.getId(), campfireId, req));
  }

  @Operation(summary = "캠프파이어 삭제")
  @DeleteMapping("/campfires/{campfireId}")
  public ApiResponse<Void> deleteCampfire(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId
  ) {
    communityService.deleteCampfire(user.getId(), campfireId);
    return ApiResponse.success("캠프파이어가 삭제되었습니다.");
  }

  @Operation(summary = "캠프파이어 참여")
  @PostMapping("/campfires/{campfireId}/join")
  public ApiResponse<CommunityDto.CampfireResponse> joinCampfire(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId
  ) {
    return ApiResponse.success(communityService.joinCampfire(user.getId(), campfireId));
  }

  @Operation(summary = "캠프파이어 나가기")
  @DeleteMapping("/campfires/{campfireId}/join")
  public ApiResponse<CommunityDto.CampfireResponse> leaveCampfire(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId
  ) {
    return ApiResponse.success(communityService.leaveCampfire(user.getId(), campfireId));
  }

  @Operation(summary = "캠프파이어 메시지 조회")
  @GetMapping("/campfires/{campfireId}/messages")
  public ApiResponse<List<CommunityDto.CampfireMessageResponse>> getCampfireMessages(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId,
      @RequestParam(required = false) Long afterId
  ) {
    return ApiResponse.success(communityService.getCampfireMessages(user.getId(), campfireId, afterId));
  }

  @Operation(summary = "캠프파이어 메시지 전송")
  @PostMapping("/campfires/{campfireId}/messages")
  public ApiResponse<CommunityDto.CampfireMessageResponse> sendCampfireMessage(
      @AuthenticationPrincipal User user,
      @PathVariable Long campfireId,
      @Valid @RequestBody CommunityDto.CampfireMessageRequest req
  ) {
    return ApiResponse.success(communityService.sendCampfireMessage(user.getId(), campfireId, req));
  }
}
