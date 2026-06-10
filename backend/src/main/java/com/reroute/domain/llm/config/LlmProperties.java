package com.reroute.domain.llm.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "llm")
public class LlmProperties {
  private String provider = "gemini";
  private boolean fallbackEnabled = true;
}
