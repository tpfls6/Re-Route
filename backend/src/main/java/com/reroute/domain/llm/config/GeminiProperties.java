package com.reroute.domain.llm.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "gemini")
public class GeminiProperties {

  private String apiKey;
  private String model = "gemini-2.0-flash";
  private String baseUrl = "https://generativelanguage.googleapis.com";
  private int timeoutMillis = 30000;
  private boolean fallbackEnabled = true;
}
