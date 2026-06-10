package com.reroute.domain.community.repository;

import com.reroute.domain.community.entity.CommunityCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityCategoryRepository extends JpaRepository<CommunityCategory, Long> {
  Optional<CommunityCategory> findByName(String name);
}
