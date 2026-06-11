package com.reroute.domain.admin;

import com.reroute.domain.community.dto.CommunityDto;
import com.reroute.domain.community.service.CommunityService;
import com.reroute.domain.user.dto.UserDto;
import com.reroute.domain.user.entity.User;
import com.reroute.domain.user.service.UserService;
import com.reroute.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "관리자 전용 API")
public class AdminController {

  private final UserService userService;
  private final CommunityService communityService;

  @Operation(summary = "전체 사용자 목록 조회")
  @GetMapping("/users")
  public ApiResponse<List<UserDto.AdminUserSummary>> getAllUsers() {
    return ApiResponse.success(userService.getAllUsersForAdmin());
  }

  @Operation(summary = "사용자 삭제")
  @DeleteMapping("/users/{userId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteUser(
      @AuthenticationPrincipal User admin,
      @PathVariable Long userId
  ) {
    userService.adminDeleteUser(admin.getId(), userId);
  }

  @Operation(summary = "전체 커뮤니티 게시글 목록 조회")
  @GetMapping("/community/posts")
  public ApiResponse<List<CommunityDto.PostSummaryResponse>> getAllPosts() {
    return ApiResponse.success(communityService.getAllPostsForAdmin());
  }

  @Operation(summary = "커뮤니티 게시글 강제 삭제")
  @DeleteMapping("/community/posts/{postId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletePost(@PathVariable Long postId) {
    communityService.adminDeletePost(postId);
  }

  @Operation(summary = "특정 게시글의 전체 댓글 목록 조회")
  @GetMapping("/community/posts/{postId}/comments")
  public ApiResponse<List<CommunityDto.CommentResponse>> getPostComments(@PathVariable Long postId) {
    return ApiResponse.success(communityService.getAllCommentsForAdmin(postId));
  }

  @Operation(summary = "커뮤니티 댓글 강제 삭제")
  @DeleteMapping("/community/comments/{commentId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteComment(@PathVariable Long commentId) {
    communityService.adminDeleteComment(commentId);
  }
}
