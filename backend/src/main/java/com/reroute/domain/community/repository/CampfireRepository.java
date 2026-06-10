package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.Campfire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampfireRepository extends JpaRepository<Campfire, Long> {
  List<Campfire> findAllByOrderByCreatedAtDesc();
  List<Campfire> findByOpenTrueOrderByCreatedAtDesc();
}
