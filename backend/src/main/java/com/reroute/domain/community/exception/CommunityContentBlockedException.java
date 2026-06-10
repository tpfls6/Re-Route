package com.reroute.domain.community.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class CommunityContentBlockedException extends RuntimeException {

  private final List<String> categories;

  public CommunityContentBlockedException(String message, List<String> categories) {
    super(message);
    this.categories = categories;
  }
}
