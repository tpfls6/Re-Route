package com.reroute.global.ratelimit;

import com.reroute.global.exception.RateLimitException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RehearsalRateLimiter {

  private static final int MAX_TURNS_PER_MINUTE = 20;
  private static final long WINDOW_MS = 60_000L;

  private final ConcurrentHashMap<Long, Deque<Long>> callTimes = new ConcurrentHashMap<>();

  public void check(Long userId) {
    long now = System.currentTimeMillis();
    Deque<Long> times = callTimes.computeIfAbsent(userId, k -> new ArrayDeque<>());
    synchronized (times) {
      while (!times.isEmpty() && now - times.peekFirst() > WINDOW_MS) {
        times.pollFirst();
      }
      if (times.size() >= MAX_TURNS_PER_MINUTE) {
        throw new RateLimitException("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
      times.addLast(now);
    }
  }

  // 1시간마다 빈 항목 정리
  @Scheduled(fixedRate = 3_600_000)
  public void cleanup() {
    long cutoff = System.currentTimeMillis() - WINDOW_MS;
    callTimes.entrySet().removeIf(entry -> {
      Deque<Long> times = entry.getValue();
      synchronized (times) {
        while (!times.isEmpty() && times.peekFirst() < cutoff) {
          times.pollFirst();
        }
        return times.isEmpty();
      }
    });
  }
}
