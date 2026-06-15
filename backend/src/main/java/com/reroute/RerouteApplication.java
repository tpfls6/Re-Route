package com.reroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RerouteApplication {
  public static void main(String[] args) {
    SpringApplication.run(RerouteApplication.class, args);
  }
}
  