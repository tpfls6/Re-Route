package com.reroute.global.exception;

import com.reroute.global.response.ApiResponse;
import com.reroute.domain.community.dto.CommunityDto;
import com.reroute.domain.community.exception.CommunityContentBlockedException;
import com.reroute.domain.llm.exception.LlmException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CommunityContentBlockedException.class)
  @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
  public ApiResponse<CommunityDto.ModerationErrorResponse> handleCommunityContentBlocked(
      CommunityContentBlockedException e
  ) {
    return ApiResponse.error(
        e.getMessage(),
        CommunityDto.ModerationErrorResponse.builder()
            .code("COMMUNITY_CONTENT_BLOCKED")
            .categories(e.getCategories())
            .build()
    );
  }

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Void> handleIllegalArgument(IllegalArgumentException e) {
    return ApiResponse.error(e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
    String message = e.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return ApiResponse.error(message);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiResponse<Void> handleResourceNotFound(ResourceNotFoundException e) {
    return ApiResponse.error(e.getMessage());
  }

  @ExceptionHandler(LlmException.class)
  @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
  public ApiResponse<Void> handleLlmException(LlmException e) {
    return ApiResponse.error(e.getMessage());
  }

  @ExceptionHandler(RateLimitException.class)
  @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
  public ApiResponse<Void> handleRateLimit(RateLimitException e) {
    return ApiResponse.error(e.getMessage());
  }

  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiResponse<Void> handleRuntimeException(RuntimeException e) {
    return ApiResponse.error("Internal server error");
  }
}
