package com.reroute.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
  private String status;
  private String message;
  private T data;

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>("OK", "success", data);
  }

  public static ApiResponse<Void> success(String message) {
    return new ApiResponse<>("OK", message, null);
  }

  public static ApiResponse<Void> error(String message) {
    return new ApiResponse<>("ERROR", message, null);
  }

  public static <T> ApiResponse<T> error(String message, T data) {
    return new ApiResponse<>("ERROR", message, data);
  }
}
