package com.reroute.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HexFormat;

@Component
public class JwtUtil {

  private final SecretKey key;
  private final long accessExpiration;
  private final long refreshExpiration;

  public JwtUtil(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.expiration}") long accessExpiration,
      @Value("${jwt.refresh-expiration}") long refreshExpiration) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessExpiration = accessExpiration;
    this.refreshExpiration = refreshExpiration;
  }

  public String generateToken(Long userId) {
    return generateAccessToken(userId);
  }

  public String generateAccessToken(Long userId) {
    return generateToken(userId, "access", accessExpiration);
  }

  public String generateRefreshToken(Long userId) {
    return generateToken(userId, "refresh", refreshExpiration);
  }

  private String generateToken(Long userId, String type, long expiration) {
    return Jwts.builder()
        .subject(String.valueOf(userId))
        .claim("type", type)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(key)
        .compact();
  }

  public Long extractUserId(String token) {
    return extractClaims(token).getSubject() == null
        ? null
        : Long.parseLong(extractClaims(token).getSubject());
  }

  public Long extractUserIdFromAccessToken(String token) {
    Claims claims = extractClaims(token);
    validateTokenType(claims, "access");
    return Long.parseLong(claims.getSubject());
  }

  public Long extractUserIdFromRefreshToken(String token) {
    Claims claims = extractClaims(token);
    validateTokenType(claims, "refresh");
    return Long.parseLong(claims.getSubject());
  }

  public LocalDateTime getRefreshTokenExpiresAt() {
    return LocalDateTime.ofInstant(
        new Date(System.currentTimeMillis() + refreshExpiration).toInstant(),
        ZoneId.systemDefault()
    );
  }

  public String hashToken(String token) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 algorithm is not available", e);
    }
  }

  private Claims extractClaims(String token) {
    Claims claims = Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
    return claims;
  }

  public boolean isValid(String token) {
    try {
      extractUserId(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public boolean isValidAccessToken(String token) {
    try {
      extractUserIdFromAccessToken(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public boolean isValidRefreshToken(String token) {
    try {
      extractUserIdFromRefreshToken(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  private void validateTokenType(Claims claims, String expectedType) {
    String type = claims.get("type", String.class);
    if (!expectedType.equals(type)) {
      throw new IllegalArgumentException("Invalid token type");
    }
  }
}
