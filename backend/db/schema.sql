CREATE DATABASE IF NOT EXISTS reroute_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reroute_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  recovery_type VARCHAR(50) NULL,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_stats (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  quests_completed INT NOT NULL DEFAULT 0,
  total_quests INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  confidence_score INT NOT NULL DEFAULT 0,
  avoidance_index INT NOT NULL DEFAULT 0,
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_stats_user_id (user_id),
  CONSTRAINT fk_user_stats_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_verifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  purpose VARCHAR(30) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_email_verifications_email_purpose (email, purpose),
  KEY idx_email_verifications_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token_hash VARCHAR(128) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_refresh_tokens_token_hash (token_hash),
  KEY idx_refresh_tokens_user_id (user_id),
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS counseling_sessions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(200) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_counseling_sessions_user_created (user_id, created_at),
  CONSTRAINT fk_counseling_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS counseling_messages (
  id BIGINT NOT NULL AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_counseling_messages_session_created (session_id, created_at),
  CONSTRAINT fk_counseling_messages_session FOREIGN KEY (session_id) REFERENCES counseling_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS counseling_analyses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  summary TEXT NULL,
  recovery_type VARCHAR(50) NOT NULL,
  confidence DOUBLE NULL,
  reason TEXT NULL,
  emotion_keywords TEXT NULL,
  event_text TEXT NULL,
  emotion_text TEXT NULL,
  cause_text TEXT NULL,
  recommended_action_text TEXT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_counseling_analyses_session_id (session_id),
  CONSTRAINT fk_counseling_analyses_session FOREIGN KEY (session_id) REFERENCES counseling_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS counseling_analysis_emotions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  analysis_id BIGINT NOT NULL,
  emotion VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_analysis_emotions_analysis_id (analysis_id),
  CONSTRAINT fk_analysis_emotions_analysis FOREIGN KEY (analysis_id) REFERENCES counseling_analyses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS emotion_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  emotion VARCHAR(50) NOT NULL,
  intensity INT NOT NULL,
  note TEXT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_emotion_logs_user_created (user_id, created_at),
  CONSTRAINT fk_emotion_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS action_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  background TEXT NULL,
  why_text TEXT NULL,
  category VARCHAR(50) NOT NULL,
  format VARCHAR(50) NOT NULL DEFAULT 'MICRO_ACTION',
  difficulty_level INT NOT NULL DEFAULT 1,
  estimated_minutes INT NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_action_items_category_active (category, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS action_item_steps (
  id BIGINT NOT NULL AUTO_INCREMENT,
  action_item_id BIGINT NOT NULL,
  step_order INT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_action_item_steps_order (action_item_id, step_order),
  CONSTRAINT fk_action_item_steps_action_item FOREIGN KEY (action_item_id) REFERENCES action_items (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS action_item_tips (
  id BIGINT NOT NULL AUTO_INCREMENT,
  action_item_id BIGINT NOT NULL,
  tip_order INT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_action_item_tips_order (action_item_id, tip_order),
  CONSTRAINT fk_action_item_tips_action_item FOREIGN KEY (action_item_id) REFERENCES action_items (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_action_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  action_item_id BIGINT NOT NULL,
  source_session_id BIGINT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  assigned_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  completed_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_user_action_items_user_status (user_id, status),
  KEY idx_user_action_items_action_item_id (action_item_id),
  KEY idx_user_action_items_source_session_id (source_session_id),
  CONSTRAINT fk_user_action_items_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_action_items_action_item FOREIGN KEY (action_item_id) REFERENCES action_items (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_action_items_source_session FOREIGN KEY (source_session_id) REFERENCES counseling_sessions (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS action_item_reflections (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_action_item_id BIGINT NOT NULL,
  feeling VARCHAR(30) NULL,
  difficulty_score INT NULL,
  reflection TEXT NULL,
  next_step TEXT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_reflections_user_action_item_id (user_action_item_id),
  CONSTRAINT fk_reflections_user_action_item FOREIGN KEY (user_action_item_id) REFERENCES user_action_items (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS golden_cards (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  user_action_item_id BIGINT NULL,
  title VARCHAR(200) NOT NULL,
  detail VARCHAR(255) NULL,
  earned_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_golden_cards_user_earned (user_id, earned_at),
  KEY idx_golden_cards_user_action_item_id (user_action_item_id),
  CONSTRAINT fk_golden_cards_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_golden_cards_user_action_item FOREIGN KEY (user_action_item_id) REFERENCES user_action_items (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scenarios (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(80) NULL,
  difficulty_level INT NOT NULL DEFAULT 1,
  recovery_type VARCHAR(50) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_scenarios_active_difficulty (active, difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rehearsals (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  scenario_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
  started_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  completed_at DATETIME(6) NULL,
  feedback TEXT NULL,
  score INT NULL,
  PRIMARY KEY (id),
  KEY idx_rehearsals_user_started (user_id, started_at),
  KEY idx_rehearsals_scenario_id (scenario_id),
  CONSTRAINT fk_rehearsals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_rehearsals_scenario FOREIGN KEY (scenario_id) REFERENCES scenarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_community_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_posts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  anonymous_name VARCHAR(50) NOT NULL,
  anonymous_type VARCHAR(50) NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  view_count INT NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_community_posts_category_created (category_id, created_at),
  KEY idx_community_posts_user_id (user_id),
  CONSTRAINT fk_community_posts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_community_posts_category FOREIGN KEY (category_id) REFERENCES community_categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_post_tags (
  id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_community_post_tags_tag (tag),
  UNIQUE KEY uk_community_post_tags_post_tag (post_id, tag),
  CONSTRAINT fk_community_post_tags_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_comments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  anonymous_name VARCHAR(50) NOT NULL,
  anonymous_type VARCHAR(50) NULL,
  content TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_community_comments_post_created (post_id, created_at),
  KEY idx_community_comments_user_id (user_id),
  CONSTRAINT fk_community_comments_post FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE,
  CONSTRAINT fk_community_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_likes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  target_id BIGINT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_community_likes_user_target (user_id, target_type, target_id),
  KEY idx_community_likes_target (target_type, target_id),
  CONSTRAINT fk_community_likes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campfires (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  keyword VARCHAR(200) NULL,
  recovery_type VARCHAR(50) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_campfires_status_recovery_type (status, recovery_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campfire_participants (
  id BIGINT NOT NULL AUTO_INCREMENT,
  campfire_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  joined_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  left_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  KEY idx_campfire_participants_campfire_id (campfire_id),
  KEY idx_campfire_participants_user_id (user_id),
  CONSTRAINT fk_campfire_participants_campfire FOREIGN KEY (campfire_id) REFERENCES campfires (id) ON DELETE CASCADE,
  CONSTRAINT fk_campfire_participants_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NULL,
  read_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_notifications_user_read_created (user_id, read_at, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT NOT NULL AUTO_INCREMENT,
  reporter_id BIGINT NOT NULL,
  target_type VARCHAR(30) NOT NULL,
  target_id BIGINT NOT NULL,
  reason VARCHAR(100) NOT NULL,
  detail TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  resolved_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  KEY idx_reports_status_created (status, created_at),
  KEY idx_reports_target (target_type, target_id),
  CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
