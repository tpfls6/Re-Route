-- MySQL dump 10.13  Distrib 9.0.1, for macos14.4 (arm64)
--
-- Host: localhost    Database: reroute_db
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action_item_steps`
--

DROP TABLE IF EXISTS `action_item_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action_item_steps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_item_id` bigint NOT NULL,
  `step_order` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_action_item_steps_order` (`action_item_id`,`step_order`),
  CONSTRAINT `fk_action_item_steps_action_item` FOREIGN KEY (`action_item_id`) REFERENCES `action_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_item_steps`
--

LOCK TABLES `action_item_steps` WRITE;
/*!40000 ALTER TABLE `action_item_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `action_item_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `action_items`
--

DROP TABLE IF EXISTS `action_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('AVOIDANT','OVERFOCUSED','LETHARGIC','RELATION_ANXIOUS','PERFECTIONIST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `estimated_minutes` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `format` enum('MICRO_ACTION','REFLECTION_PROMPT','TIME_BOX','GROUNDING','RELATION_REFRAME','IMPERFECT_START') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_items`
--

LOCK TABLES `action_items` WRITE;
/*!40000 ALTER TABLE `action_items` DISABLE KEYS */;
INSERT INTO `action_items` VALUES (1,'AVOIDANT','2026-06-10 19:33:17.107731','완료보다 시작에 집중해 딱 1분만 행동해보세요.',1,'피하고 있던 일 1분만 시작하기','2026-06-10 19:33:17.107796','MICRO_ACTION'),(2,'AVOIDANT','2026-06-10 19:33:17.131146','피하고 싶은 상황과 가장 걱정되는 결과를 한 문장씩 적어보세요.',5,'걱정되는 상황을 한 문장으로 적기','2026-06-10 19:33:17.131167','REFLECTION_PROMPT'),(3,'AVOIDANT','2026-06-10 19:33:17.134768','부담되는 일을 가장 작은 단계로 나누고 첫 단계만 실행해보세요.',5,'가장 쉬운 단계 하나 실행하기','2026-06-10 19:33:17.134785','TIME_BOX'),(4,'OVERFOCUSED','2026-06-10 19:33:17.140144','고민을 잠시 내려놓고 5분 동안 다른 감각이나 활동에 집중해보세요.',5,'생각 멈춤 5분 타이머','2026-06-10 19:33:17.140157','TIME_BOX'),(5,'OVERFOCUSED','2026-06-10 19:33:17.142225','바꿀 수 있는 것과 바꿀 수 없는 것을 각각 한 가지씩 적어보세요.',5,'지금 통제 가능한 것 구분하기','2026-06-10 19:33:17.142239','REFLECTION_PROMPT'),(6,'OVERFOCUSED','2026-06-10 19:33:17.144749','자리에서 일어나 주변의 색이나 소리를 천천히 다섯 가지 찾아보세요.',3,'시선을 다른 곳으로 옮기기','2026-06-10 19:33:17.144771','GROUNDING'),(7,'LETHARGIC','2026-06-10 19:33:17.158646','기지개, 제자리 걷기처럼 가장 쉬운 움직임을 1분만 해보세요.',1,'몸을 1분간 움직이기','2026-06-10 19:33:17.158663','MICRO_ACTION'),(8,'LETHARGIC','2026-06-10 19:33:17.197311','중요도와 무관하게 지금 할 수 있는 가장 작은 일 하나를 선택하세요.',3,'오늘 할 일 하나만 고르기','2026-06-10 19:33:17.197415','IMPERFECT_START'),(9,'LETHARGIC','2026-06-10 19:33:17.206589','물 한 잔을 마신 뒤 창밖이나 먼 곳을 보며 호흡을 가다듬어보세요.',3,'물 한 잔 마시고 창문 보기','2026-06-10 19:33:17.206617','GROUNDING'),(10,'RELATION_ANXIOUS','2026-06-10 19:33:17.210536','부정적인 해석 외에 중립적이거나 긍정적인 가능성도 적어보세요.',5,'상대의 반응을 세 가지로 해석하기','2026-06-10 19:33:17.210557','RELATION_REFRAME'),(11,'RELATION_ANXIOUS','2026-06-10 19:33:17.213631','불안해서 바로 확인하고 싶을 때 10분만 기다린 뒤 다시 판단해보세요.',10,'확인 메시지 보내기 전 10분 기다리기','2026-06-10 19:33:17.213649','TIME_BOX'),(12,'RELATION_ANXIOUS','2026-06-10 19:33:17.218256','상대의 반응 대신 내가 선택하고 싶은 건강한 행동을 한 문장으로 적어보세요.',5,'내가 원하는 관계 행동 적기','2026-06-10 19:33:17.218278','REFLECTION_PROMPT'),(13,'PERFECTIONIST','2026-06-10 19:33:17.226123','완벽하게 준비하지 말고 현재 상태 그대로 첫 단계를 시작해보세요.',5,'60점 상태로 시작하기','2026-06-10 19:33:17.226143','IMPERFECT_START'),(14,'PERFECTIONIST','2026-06-10 19:33:17.229732','이번 일에서 작은 실수가 허용되는 이유를 두 가지 적어보세요.',5,'실수해도 괜찮은 이유 적기','2026-06-10 19:33:17.229744','REFLECTION_PROMPT'),(15,'PERFECTIONIST','2026-06-10 19:33:17.232329','수정하지 않고 10분 동안 초안을 만드는 데만 집중해보세요.',10,'초안에 10분만 쓰기','2026-06-10 19:33:17.232344','TIME_BOX');
/*!40000 ALTER TABLE `action_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campfire_members`
--

DROP TABLE IF EXISTS `campfire_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campfire_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `joined_at` datetime(6) DEFAULT NULL,
  `campfire_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf1mtf54ap8tlt57dhcaiw72id` (`campfire_id`,`user_id`),
  KEY `FK4kqfo11543256nk8nkbtpds60` (`user_id`),
  CONSTRAINT `FK4kqfo11543256nk8nkbtpds60` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmgrk4gas5t48du2o8aq57ogxo` FOREIGN KEY (`campfire_id`) REFERENCES `campfires` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campfire_members`
--

LOCK TABLES `campfire_members` WRITE;
/*!40000 ALTER TABLE `campfire_members` DISABLE KEYS */;
INSERT INTO `campfire_members` VALUES (2,'2026-06-09 09:48:30.017000',2,2),(7,'2026-06-12 15:02:31.892578',2,9),(8,'2026-06-15 16:55:03.457430',6,9),(9,'2026-06-15 16:55:04.673690',7,9),(10,'2026-06-15 16:55:04.955617',8,9),(11,'2026-06-15 16:55:41.502789',6,2);
/*!40000 ALTER TABLE `campfire_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campfire_messages`
--

DROP TABLE IF EXISTS `campfire_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campfire_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `campfire_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfgu5194kcjwnlyk8v2fe321en` (`campfire_id`),
  KEY `FK6h19cvhem1i2k04ppecsewfr0` (`sender_id`),
  CONSTRAINT `FK6h19cvhem1i2k04ppecsewfr0` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKfgu5194kcjwnlyk8v2fe321en` FOREIGN KEY (`campfire_id`) REFERENCES `campfires` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campfire_messages`
--

LOCK TABLES `campfire_messages` WRITE;
/*!40000 ALTER TABLE `campfire_messages` DISABLE KEYS */;
INSERT INTO `campfire_messages` VALUES (1,'안녕','2026-06-11 13:25:07.473254',2,9),(2,'누구세요?','2026-06-11 13:25:40.731040',2,2),(3,'안녕','2026-06-15 16:55:11.777213',6,9),(4,'오..누구세요??','2026-06-15 16:55:47.685293',6,2);
/*!40000 ALTER TABLE `campfire_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campfires`
--

DROP TABLE IF EXISTS `campfires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campfires` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyword` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `owner_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8qc9cblkacpxir41x1xucibr3` (`owner_id`),
  CONSTRAINT `FK8qc9cblkacpxir41x1xucibr3` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campfires`
--

LOCK TABLES `campfires` WRITE;
/*!40000 ALTER TABLE `campfires` DISABLE KEYS */;
INSERT INTO `campfires` VALUES (2,'2026-06-09 09:48:30.011425','ddd','ddd','dd',_binary '','2026-06-09 09:48:30.011440',2),(6,'2026-06-15 16:55:03.454564','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ',_binary '','2026-06-15 16:55:03.454578',9),(7,'2026-06-15 16:55:04.667120','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ',_binary '','2026-06-15 16:55:04.667169',9),(8,'2026-06-15 16:55:04.954246','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ','ㅇㅇㅇㅇ',_binary '','2026-06-15 16:55:04.954256',9);
/*!40000 ALTER TABLE `campfires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_categories`
--

DROP TABLE IF EXISTS `community_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_community_categories_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_categories`
--

LOCK TABLES `community_categories` WRITE;
/*!40000 ALTER TABLE `community_categories` DISABLE KEYS */;
INSERT INTO `community_categories` VALUES (1,'질문',0),(2,'경험 나눔',0),(3,'도움 요청',0);
/*!40000 ALTER TABLE `community_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comment_likes`
--

DROP TABLE IF EXISTS `community_comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_comment_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7wio1mpjgxl5agybmcpus92l9` (`comment_id`,`user_id`),
  KEY `FK3jr0j09aiayurgtje28fi5olg` (`user_id`),
  CONSTRAINT `FK3jr0j09aiayurgtje28fi5olg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKecrn28qml2nayd5g5fih0enfu` FOREIGN KEY (`comment_id`) REFERENCES `community_comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comment_likes`
--

LOCK TABLES `community_comment_likes` WRITE;
/*!40000 ALTER TABLE `community_comment_likes` DISABLE KEYS */;
INSERT INTO `community_comment_likes` VALUES (1,2,7);
/*!40000 ALTER TABLE `community_comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_comments`
--

DROP TABLE IF EXISTS `community_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `author_id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfktbqr72q7mu118iab24aukj7` (`author_id`),
  KEY `FKlrj6e98eodhkxqxolyyqowvbc` (`post_id`),
  CONSTRAINT `FKfktbqr72q7mu118iab24aukj7` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKlrj6e98eodhkxqxolyyqowvbc` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_comments`
--

LOCK TABLES `community_comments` WRITE;
/*!40000 ALTER TABLE `community_comments` DISABLE KEYS */;
INSERT INTO `community_comments` VALUES (2,'그럴수있죠','2026-06-08 19:34:02.181720','2026-06-08 19:34:02.181736',2,2),(3,'어쩌라는거에요 ;;','2026-06-08 19:36:56.598289','2026-06-08 19:36:56.598301',7,2);
/*!40000 ALTER TABLE `community_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_moderation_logs`
--

DROP TABLE IF EXISTS `community_moderation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_moderation_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categories_json` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `reason` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `self_harm_risk` bit(1) NOT NULL,
  `submitted_content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8i3xrgopsbwh9pc39s2iiy7di` (`user_id`),
  CONSTRAINT `FK8i3xrgopsbwh9pc39s2iiy7di` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_moderation_logs`
--

LOCK TABLES `community_moderation_logs` WRITE;
/*!40000 ALTER TABLE `community_moderation_logs` DISABLE KEYS */;
INSERT INTO `community_moderation_logs` VALUES (1,'ALLOWED','[]','2026-06-08 19:44:58.235213','OpenAI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','제목: 직장에서 들은 말 때문에 힘들어요\n내용: 상사가 저에게 심한 욕설을 하고 때리겠다고 협박했습니다. 신고하거나 도움받을 방법을 알고 싶어요.\n태그: 직장괴롭힘 도움요청','POST',7),(2,'BLOCKED','[\"OBFUSCATED_ABUSE\"]','2026-06-08 19:45:08.713419','욕설, 모욕 또는 위협으로 의심되는 표현이 포함되어 있습니다. 표현을 수정해주세요.',_binary '\0','제목: 가만두지 않겠다\n내용: 너 어디 사는지 찾아내서 때려 죽여버릴 거야. 각오해.\n태그: 복수','POST',7),(3,'BLOCKED','[\"PERSONAL_INFORMATION\"]','2026-06-08 19:45:29.778658','전화번호, 이메일, 주민등록번호 또는 상세 주소 등 개인정보는 게시할 수 없습니다.',_binary '\0','제목: 연락주세요\n내용: 제 번호는 010-1234-5678 입니다. 연락주세요.\n태그: 연락','POST',7),(4,'WARNED','[\"SELF_HARM_CONTEXT\"]','2026-06-08 19:45:30.537057','위험 신호가 감지되어 도움 안내를 함께 제공합니다.',_binary '','제목: 요즘 너무 위험한 생각이 들어요\n내용: 요즘 자살 생각이 자꾸 들어서 무섭고 도움을 받고 싶어요.\n태그: 도움요청','POST',7),(5,'BLOCKED','[\"OBFUSCATED_ABUSE\"]','2026-06-08 19:47:05.793844','욕설, 모욕 또는 위협으로 의심되는 표현이 포함되어 있습니다. 표현을 수정해주세요.',_binary '\0','제목: 시발\n내용: 진자 족같은 일이 생겼는데요 여러분들\n태그: ','POST',2),(6,'ALLOWED','[]','2026-06-08 19:47:20.377252','OpenAI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','제목: 시1111111발\n내용: 진자 주옥같은 일이 생겼는데요 여러분들\n태그: ','POST',2),(7,'ALLOWED','[]','2026-06-08 19:48:17.177618','OpenAI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','내가 봐줄게 우리집 올래?','COMMENT',2),(8,'ALLOWED','[]','2026-06-08 19:48:25.173577','OpenAI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','너 가슴 크냐? 여자임?','COMMENT',2),(9,'ALLOWED','[]','2026-06-09 09:48:29.975775','OpenAI 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','이름: dd\n설명: ddd\n키워드: ddd','CAMPFIRE',2),(10,'ALLOWED','[]','2026-06-10 16:17:45.875083','Gemini 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','제목: ㅈㄴ\n내용: ㅇㅇㅇㅇㅇㅇㅇㄹㅁㄴㅇㄹㄴㅇㅁㄹ\n태그: ','POST',2),(11,'ALLOWED','[]','2026-06-10 16:17:53.447769','Gemini 검사 연결이 원활하지 않아 기본 안전 규칙으로 확인했습니다.',_binary '\0','제목: 존나\n내용: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n태그: ','POST',2),(12,'BLOCKED','[\"OBFUSCATED_ABUSE\"]','2026-06-10 16:18:00.024634','욕설, 모욕 또는 위협으로 의심되는 표현이 포함되어 있습니다. 표현을 수정해주세요.',_binary '\0','제목: 시발\n내용: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n태그: ','POST',2),(13,'ALLOWED','[]','2026-06-10 23:21:39.565192','내용이 차단 기준에 해당하지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n키워드: ㅇㅇㅇ','CAMPFIRE',2),(14,'ALLOWED','[]','2026-06-10 23:21:39.862413','내용이 차단 기준에 해당하지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n키워드: ㅇㅇㅇ','CAMPFIRE',2),(15,'ALLOWED','[]','2026-06-10 23:21:41.128753','내용이 차단 기준에 해당하지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n키워드: ㅇㅇㅇ','CAMPFIRE',2),(16,'BLOCKED','[]','2026-06-11 09:57:28.224159','욕설이 포함되어 있어 차단되었습니다.',_binary '\0','제목: 시발\n내용: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n태그: ','POST',9),(17,'ALLOWED','[]','2026-06-11 09:57:40.059641','내용이 명확하지 않으며, 공격적이거나 유해한 표현이 포함되어 있지 않습니다.',_binary '\0','제목: 시11111111111발\n내용: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n태그: ','POST',9),(18,'ALLOWED','[]','2026-06-15 16:54:25.186206','도움 요청의 내용으로 차단되지 않습니다.',_binary '\0','제목: 힘들어요\n내용: 어떻게 해야할지 잘 모르겠어요\n태그: ','POST',9),(19,'BLOCKED','[]','2026-06-15 16:54:35.099549','욕설이 포함되어 있어 차단되었습니다.',_binary '\0','제목: 시발\n내용: ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\n태그: ','POST',9),(20,'ALLOWED','[]','2026-06-15 16:55:03.447267','내용이 커뮤니티 정책에 위배되지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇ\n키워드: ㅇㅇㅇㅇ','CAMPFIRE',9),(21,'ALLOWED','[]','2026-06-15 16:55:04.647945','내용이 커뮤니티 정책에 위배되지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇ\n키워드: ㅇㅇㅇㅇ','CAMPFIRE',9),(22,'ALLOWED','[]','2026-06-15 16:55:04.951582','내용이 커뮤니티 정책에 위배되지 않습니다.',_binary '\0','이름: ㅇㅇㅇㅇ\n설명: ㅇㅇㅇㅇ\n키워드: ㅇㅇㅇㅇ','CAMPFIRE',9),(23,'ALLOWED','[]','2026-06-15 16:55:11.754862','내용이 안전하며 커뮤니티에 등록 가능합니다.',_binary '\0','안녕','CAMPFIRE_MESSAGE',9),(24,'ALLOWED','[]','2026-06-15 16:55:47.661173','내용이 커뮤니티 규정을 위반하지 않습니다.',_binary '\0','오..누구세요??','CAMPFIRE_MESSAGE',2);
/*!40000 ALTER TABLE `community_moderation_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post_likes`
--

DROP TABLE IF EXISTS `community_post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKc2ovkhr95egjtdjptp4jagqm5` (`post_id`,`user_id`),
  KEY `FK3aog7m083nbagp2k359qnxhyp` (`user_id`),
  CONSTRAINT `FK3aog7m083nbagp2k359qnxhyp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKs98gntvorodjgg3tc6h3etwr` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post_likes`
--

LOCK TABLES `community_post_likes` WRITE;
/*!40000 ALTER TABLE `community_post_likes` DISABLE KEYS */;
INSERT INTO `community_post_likes` VALUES (3,2,2),(4,9,2);
/*!40000 ALTER TABLE `community_post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_post_tags`
--

DROP TABLE IF EXISTS `community_post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_post_tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `tag` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_community_post_tags_post_tag` (`post_id`,`tag`),
  KEY `idx_community_post_tags_tag` (`tag`),
  CONSTRAINT `fk_community_post_tags_post` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_post_tags`
--

LOCK TABLES `community_post_tags` WRITE;
/*!40000 ALTER TABLE `community_post_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_posts`
--

DROP TABLE IF EXISTS `community_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `anonymous_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anonymous_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `view_count` int NOT NULL DEFAULT '0',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags_json` text COLLATE utf8mb4_unicode_ci,
  `author_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_community_posts_category_created` (`category_id`,`created_at`),
  KEY `idx_community_posts_user_id` (`user_id`),
  KEY `FKeu4flvshxstxajldqps82cqeh` (`author_id`),
  CONSTRAINT `fk_community_posts_category` FOREIGN KEY (`category_id`) REFERENCES `community_categories` (`id`),
  CONSTRAINT `fk_community_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKeu4flvshxstxajldqps82cqeh` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_posts`
--

LOCK TABLES `community_posts` WRITE;
/*!40000 ALTER TABLE `community_posts` DISABLE KEYS */;
INSERT INTO `community_posts` VALUES (2,2,2,'세린','익명 사용자','ㅇㅇㅇㅇㅇㅇㅇ힘들어요','ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',0,'ACTIVE','2026-06-08 19:33:44.701263','2026-06-08 19:37:26.040968','경험 나눔','[]',2),(3,7,3,'테스트유저','익명 사용자','직장에서 들은 말 때문에 힘들어요','상사가 저에게 심한 욕설을 하고 때리겠다고 협박했습니다. 신고하거나 도움받을 방법을 알고 싶어요.',0,'ACTIVE','2026-06-08 19:44:58.250522','2026-06-08 19:44:58.250537','도움 요청','[\"직장괴롭힘\",\"도움요청\"]',7),(4,7,3,'테스트유저','익명 사용자','요즘 너무 위험한 생각이 들어요','요즘 자살 생각이 자꾸 들어서 무섭고 도움을 받고 싶어요.',0,'ACTIVE','2026-06-08 19:45:30.554745','2026-06-08 19:45:30.554756','도움 요청','[\"도움요청\"]',7),(9,9,3,'관리자','익명 사용자','힘들어요','어떻게 해야할지 잘 모르겠어요',0,'ACTIVE','2026-06-15 16:54:25.223204','2026-06-15 16:54:25.223227','도움 요청','[]',9);
/*!40000 ALTER TABLE `community_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counseling_analyses`
--

DROP TABLE IF EXISTS `counseling_analyses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counseling_analyses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `emotion_keywords` text COLLATE utf8mb4_unicode_ci,
  `recovery_type` enum('AVOIDANT','OVERFOCUSED','LETHARGIC','RELATION_ANXIOUS','PERFECTIONIST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `session_id` bigint NOT NULL,
  `confidence` double DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_q78ihmg3a2daee419raupx6u9` (`session_id`),
  CONSTRAINT `FK2g5q6f693odmt4k3rj3ebt3va` FOREIGN KEY (`session_id`) REFERENCES `counseling_sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counseling_analyses`
--

LOCK TABLES `counseling_analyses` WRITE;
/*!40000 ALTER TABLE `counseling_analyses` DISABLE KEYS */;
INSERT INTO `counseling_analyses` VALUES (1,'2026-06-10 16:21:49.376581','[\"침울함\",\"회피\",\"거부감\",\"지침\",\"복잡함\"]','AVOIDANT','사용자는 친구와의 관계에서 침울함을 느끼며 손절까지 고려하고 있지만, 문제의 원인을 생각하거나 해결하려는 시도를 회피하고 있습니다. 감정적으로 힘든 상황에서 생각하기를 거부하고, 쉬어가라는 제안에도 강한 거부감을 보입니다.',6,0.9,'사용자는 친구 관계의 어려움이라는 문제 상황에 직면했을 때, \'잘 모르겠어.. 생각하고 싶지 않아\'라고 말하며 문제에 대한 인지적 회피를 보였습니다. 또한, \'내가 왜 그래야 되는데?\'라고 반응하며 문제 해결을 위한 노력이나 잠시 쉬어가는 제안에 대해서도 강한 거부감을 드러냈습니다. 이는 감정적 불편함이나 문제 상황 자체를 마주하기보다 피하려는 경향으로 해석됩니다.'),(2,'2026-06-10 17:25:15.260080','[\"불안\",\"스트레스\",\"좌절\"]','RELATION_ANXIOUS','상사와의 갈등으로 인해 불안한 감정을 느끼고 있으며, 대화에 대한 불만이 드러나고 있습니다.',7,0.8,'상사의 갈구는 관계에서의 불안감을 유발하고, 대화가 통하지 않는다는 느낌은 관계에 대한 민감성을 나타냅니다.'),(3,'2026-06-10 17:30:09.417572','[\"무기력\",\"답답함\",\"혼란\"]','LETHARGIC','현재 감정이 무기력하고 어떤 행동을 취하기 어려운 상태로 보입니다.',8,0.8,'대화에서 여러 번 \'모르겠다\'는 표현이 나타나며, 감정이나 상황에 대한 에너지가 낮은 것으로 해석됩니다.'),(4,'2026-06-10 17:52:43.034901','[\"부담\",\"불안\",\"감정\"]','RELATION_ANXIOUS','대화에서 인간관계의 어려움과 감정 표현에 대한 고민이 드러났습니다. 상대방의 행동에 대한 불만과 부담스러운 감정을 이야기하고 싶어하는 모습이 보입니다.',9,0.85,'상대방의 반응에 민감하고, 감정을 정리해 전달하고 싶어하는 모습이 관계 불안형의 특징을 나타냅니다.'),(5,'2026-06-10 18:25:59.357071','[\"불안\",\"긴장\",\"걱정\",\"부담\"]','RELATION_ANXIOUS','발표에 대한 불안과 타인의 시선에 대한 걱정이 두드러진 대화였습니다.',10,0.85,'발표 중간에 말이 막힐까 봐 걱정하고, 팀원들과 교수님이 실망할까 봐 긴장하는 모습이 관계에 대한 불안을 나타냅니다.'),(7,'2026-06-10 23:31:53.301646','[\"무기력\",\"막막함\",\"우울\"]','LETHARGIC','대화에서 상대방은 공부에 대한 동기와 에너지가 부족하다고 표현했습니다. 무엇부터 시작해야 할지 모르는 막막함을 느끼고 있으며, 전반적으로 무기력한 상태로 보입니다.',12,0.85,'상대방이 공부를 시작하는 데 어려움을 느끼고 있으며, 욕구가 없다는 점에서 무기력형으로 분류되었습니다.'),(8,'2026-06-11 09:56:12.155338','[\"무기력\",\"우울\",\"피로\"]','LETHARGIC','현재 에너지가 낮고 일을 하고 싶지 않은 무기력한 상태로 보입니다.',13,0.85,'대화에서 일을 하고 싶지 않다는 표현과 잠을 자고 싶다는 언급이 무기력함을 나타내고 있습니다.'),(9,'2026-06-11 10:17:32.732602','[\"스트레스\",\"압박감\",\"고민\"]','OVERFOCUSED','할 일이 많아 고민하고 있는 상황입니다.',14,0.8,'여러 가지 해야 할 일에 집중하면서 스트레스를 느끼고 있는 것으로 보입니다.'),(10,'2026-06-11 11:16:19.527370','[\"무기력\",\"답답함\",\"고통\"]','LETHARGIC','대화에서 느껴지는 무기력감과 삶에 대한 의욕 저하가 드러났습니다.',15,0.85,'자살에 대한 언급과 \'살기가 싫다\'는 표현에서 무기력한 상태가 나타났습니다.'),(11,'2026-06-11 11:44:31.098213','[\"무기력\",\"힘듦\",\"귀찮음\"]','LETHARGIC','현재 힘들고 귀찮은 감정을 표현하며, 에너지와 동기가 낮은 상태로 보입니다.',16,0.8,'밖에 나가기 귀찮다고 하신 것으로 보아, 무기력함을 느끼고 있는 것으로 판단됩니다.'),(12,'2026-06-11 14:18:33.355581','[\"무기력\",\"혼란\",\"불안\"]','LETHARGIC','현재 기분이 복잡하고 에너지가 낮은 상태로 보입니다.',17,0.8,'수업 중에도 기분이 좋지 않다고 하셨고, 활동에 대한 의욕이 낮아 보입니다.'),(13,'2026-06-11 16:55:53.764191','[\"불안\",\"갈등\",\"고민\",\"피하고 싶음\"]','RELATION_ANXIOUS','현재 친구와의 관계에서 불안감과 갈등을 느끼고 있으며, 만남에 대한 고민이 깊어지고 있습니다.',19,0.85,'친구와의 손절 이후 만남에서의 불편함과 갈등을 우려하고 있어 관계에 대한 불안이 드러납니다.'),(14,'2026-06-12 15:01:15.625855','[\"불안\",\"걱정\",\"두려움\"]','RELATION_ANXIOUS','상대방과의 관계에서 다가가는 것에 대한 불안감을 느끼고 있습니다.',20,0.85,'상대방에게 부담을 줄까 걱정하며, 관계 형성에 대한 두려움이 드러났습니다.'),(15,'2026-06-15 16:51:50.002987','[\"불안\",\"긴장\",\"걱정\"]','RELATION_ANXIOUS','발표에 대한 불안과 긴장감이 크게 느껴지고 있습니다. 특히 발표 중의 질의응답에 대한 걱정이 두드러집니다.',22,0.85,'발표를 망칠까 봐 걱정하고, 질의응답에 대한 두려움이 나타나고 있어 관계 불안형으로 분류됩니다.');
/*!40000 ALTER TABLE `counseling_analyses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counseling_messages`
--

DROP TABLE IF EXISTS `counseling_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counseling_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `role` enum('USER','ASSISTANT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKekv4m7k3fkgx7ic1vy0mtojiq` (`session_id`),
  CONSTRAINT `FKekv4m7k3fkgx7ic1vy0mtojiq` FOREIGN KEY (`session_id`) REFERENCES `counseling_sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counseling_messages`
--

LOCK TABLES `counseling_messages` WRITE;
/*!40000 ALTER TABLE `counseling_messages` DISABLE KEYS */;
INSERT INTO `counseling_messages` VALUES (12,'오늘 너무 지치고 아무것도 하기 싫어요.','2026-06-08 18:39:23.207018','USER',4),(13,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-08 18:39:23.806502','ASSISTANT',4),(14,'안녕','2026-06-08 18:40:55.434350','USER',1),(15,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-08 18:40:56.222625','ASSISTANT',1),(16,'오늘 힘든게 아니라 약간 인간관계에서 헷갈리는 사람이 있어.','2026-06-08 18:41:13.497956','USER',1),(17,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-08 18:41:13.732290','ASSISTANT',1),(18,'안녕','2026-06-09 09:49:31.868691','USER',5),(19,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-09 09:49:31.933987','ASSISTANT',5),(20,'힘들어','2026-06-09 09:49:35.469881','USER',5),(21,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-09 09:49:35.474823','ASSISTANT',5),(22,'안녕','2026-06-09 09:54:40.330796','USER',5),(23,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-09 09:54:52.435857','ASSISTANT',5),(24,'나 오늘 힘들었어','2026-06-09 09:55:07.654705','USER',5),(25,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-09 09:55:08.493995','ASSISTANT',5),(26,'안녕','2026-06-09 13:02:31.290123','USER',5),(27,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-09 13:02:31.982092','ASSISTANT',5),(28,'나 오늘 많이 힘들어','2026-06-10 10:04:24.169915','USER',5),(29,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-10 10:04:25.659901','ASSISTANT',5),(30,'나 많이 힘들어..','2026-06-10 10:08:52.546991','USER',5),(31,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-10 10:08:53.227344','ASSISTANT',5),(32,'안녕','2026-06-10 11:12:15.225804','USER',6),(33,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-10 11:12:17.166362','ASSISTANT',6),(34,'안녕','2026-06-10 14:43:34.294151','USER',6),(35,'안녕하세요! 이렇게 찾아와주셔서 정말 반가워요. 혹시 요즘 마음이 어떠신지 편하게 이야기해주실 수 있을까요?','2026-06-10 14:43:38.383730','ASSISTANT',6),(36,'오늘 정말 기분이 좋아 날이 좋아서 그런가?','2026-06-10 14:44:08.903369','USER',6),(37,'오늘 기분이 정말 좋으시다니 저도 무척 기뻐요! 화창한 날씨가 마음에 긍정적인 영향을 준 것 같네요. 이런 좋은 기분을 만끽하시면서 오늘 하루를 즐겁게 보내시길 바라요.','2026-06-10 14:44:11.405788','ASSISTANT',6),(38,'나 지금 친구와의 관계가 정말 침울해. 정말 손절치고 싶어.','2026-06-10 14:44:39.423555','USER',6),(39,'친구와의 관계로 인해 많이 침울하고 힘든 마음이 드시는군요. 손절까지 생각하실 정도면 정말 괴로우실 것 같아요. 지금 당장 결정을 내리기보다는, 잠시 시간을 가지고 어떤 점이 가장 힘든지 스스로에게 물어보는 건 어떨까요? 혹시 어떤 상황이 가장 마음을 힘들게 하는지 조금 더 이야기해주실 수 있을까요?','2026-06-10 14:44:45.361072','ASSISTANT',6),(40,'잘 모르겠어.. 생각하고 싶지 않아','2026-06-10 14:44:57.709515','USER',6),(41,'어떤 점이 힘든지 잘 모르겠고, 생각하고 싶지 않으시다니 마음이 많이 복잡하고 지치신 것 같아요. 그럴 때는 잠시 모든 생각에서 벗어나 쉬어주는 것도 좋은 방법이에요. 지금은 잠시 편안하게 숨을 고르는 시간을 가져보는 건 어떨까요?','2026-06-10 14:45:02.684445','ASSISTANT',6),(42,'싫어 내가 왜그래야되는데?','2026-06-10 14:46:24.881312','USER',6),(43,'많이 지치고 마음을 움직이기 어려운 상태로 들려요. 지금은 해야 할 일을 늘리기보다 물 한 잔 마시는 것처럼 아주 작은 행동 하나만 해도 충분해요. 오늘 특히 힘들게 만든 일이 있었나요?','2026-06-10 14:46:27.087817','ASSISTANT',6),(44,'나 지금 너무 힘들어','2026-06-10 17:23:04.415625','USER',7),(45,'힘든 시간을 겪고 계신 것 같아 정말 안타깝습니다. 그런 기분을 느끼는 건 자연스러운 일이에요. 오늘 하루는 잠시 자신을 돌보는 시간을 가져보는 건 어떨까요? 어떤 방식으로 자신을 위로해 줄 수 있을지 생각해 보세요.','2026-06-10 17:23:07.648411','ASSISTANT',7),(46,'내가 그딴걸 왜 생각해야되는데?','2026-06-10 17:23:37.637309','USER',7),(47,'그런 기분이 드는 것은 정말 힘든 일이죠. 당신의 감정이 이렇게 격해지는 이유가 있을 거예요. 지금 어떤 생각이 드는지 조금 더 이야기해 주실 수 있을까요?','2026-06-10 17:23:41.290060','ASSISTANT',7),(48,'나 출근했단 말이야. 지금 근데 상사가 나 아무것도 안했는데 자꾸 갈구고 뭐라하잖아. 내가 이걸 들으면서 왜 계속 다녀야되는지 모르겠어.','2026-06-10 17:24:32.206471','USER',7),(49,'상사의 그런 행동 때문에 많이 힘들고 불안하실 것 같아요. 그런 상황에서 느끼는 감정은 정말 괴롭죠. 오늘은 잠시 숨을 깊게 쉬고, 자신에게 필요한 만큼의 시간을 가져보는 건 어떨까요? 잠깐의 휴식이 도움이 될 수 있을 거예요.','2026-06-10 17:24:35.812580','ASSISTANT',7),(50,'휴식을 어떻게 하는데','2026-06-10 17:24:48.944928','USER',7),(51,'짧은 시간이라도 자리에 앉아 깊게 숨을 쉬어보는 게 좋겠어요. 눈을 감고 몇 초간 아무 생각 없이 숨에 집중해 보세요. 그렇게 잠시 마음을 가라앉히는 것도 큰 도움이 될 수 있습니다. 지금 어떤 기분인지 더 이야기해 보실래요?','2026-06-10 17:24:50.983312','ASSISTANT',7),(52,'싫어 니랑 대화 안통해.','2026-06-10 17:25:07.072804','USER',7),(53,'그렇게 느끼시는군요, 정말 죄송합니다. 힘든 상황에서 대화가 잘 안 되는 건 자연스러운 일이에요. 혹시 다른 방법으로 이야기하고 싶은 마음이 있으신가요?','2026-06-10 17:25:09.360142','ASSISTANT',7),(54,'나 화났어','2026-06-10 17:27:19.074764','USER',8),(55,'화가 나셨군요. 그런 감정을 느끼는 것은 정말 힘든 일이에요. 무엇 때문에 화가 나셨는지 잠시 이야기해 보실래요?','2026-06-10 17:27:21.190968','ASSISTANT',8),(56,'나도 모르개=ㅔㅅ어\'\'','2026-06-10 17:27:40.006616','USER',8),(57,'','2026-06-10 17:27:41.842541','ASSISTANT',8),(58,'나도 모르겠어.','2026-06-10 17:28:04.346169','USER',8),(59,'모르겠다는 기분이 드는 것도 자연스러운 일이에요. 그 감정이 어떤 것인지 조금 더 탐색해 보는 것도 도움이 될 수 있어요. 잠시 심호흡을 해보시고, 지금 느끼는 감정을 써보는 건 어떨까요?','2026-06-10 17:28:06.316324','ASSISTANT',8),(60,'너는 아는게 심호흡밖에 없어? 상담봇 맞아? 너는 다시 교육받아야겠다','2026-06-10 17:28:40.893834','USER',8),(61,'당신의 실망감을 이해해요. 제가 제공할 수 있는 도움에 한계가 있을 수 있지만, 당신의 감정이 중요하다는 것을 잊지 말아주세요. 다른 방법이나 이야기를 나누고 싶으신가요?','2026-06-10 17:28:44.095268','ASSISTANT',8),(62,'아니','2026-06-10 17:29:07.625696','USER',8),(63,'그렇군요. 지금은 그저 마음이 편해지기를 바라요. 혹시 다른 이야기를 나누고 싶으실 때 언제든지 말씀해 주세요.','2026-06-10 17:29:08.955016','ASSISTANT',8),(64,'그래','2026-06-10 17:29:13.410781','USER',8),(65,'좋아요. 언제든지 이야기를 나누고 싶으시면 말씀해 주세요. 당신의 이야기를 듣고 싶어요.','2026-06-10 17:29:14.903926','ASSISTANT',8),(66,'좀 질척거린다','2026-06-10 17:29:22.251288','USER',8),(67,'그런 기분이 드셨군요. 감정의 질척거림은 누구나 경험할 수 있는 것이에요. 잠시 쉬어가는 것도 좋을 것 같아요. 어떤 방식으로 자신을 돌보고 싶으신가요?','2026-06-10 17:29:23.678470','ASSISTANT',8),(68,'무슨 방식으로 날 돌봐야할지 모르겠어','2026-06-10 17:29:42.668743','USER',8),(69,'그럴 때는 작은 것부터 시작해보는 게 좋을 수 있어요. 잠깐 눈을 감고 깊게 숨을 쉬어보는 건 어떨까요? 당신의 감정이 조금 더 편안해질 수 있을 거예요.','2026-06-10 17:29:44.464598','ASSISTANT',8),(70,'별론데','2026-06-10 17:29:49.585223','USER',8),(71,'마음에 들지 않으셨군요. 그럴 때는 다른 방법을 찾아보는 것도 좋겠어요. 어떤 활동이나 생각이 당신에게 도움이 될 것 같나요?','2026-06-10 17:29:50.884148','ASSISTANT',8),(72,'나도 모르겠다고 이야기 한거잖아','2026-06-10 17:29:59.326793','USER',8),(73,'그런 기분이 드셨군요. 선택할 수 있는 것이 없을 때는 정말 답답할 수 있어요. 잠시 아무것도 하지 않고 편안하게 지내보는 건 어떨까요? 그 후에 느끼는 감정이나 생각을 나눠볼 수 있을 거예요.','2026-06-10 17:30:01.697811','ASSISTANT',8),(74,'나 인간관게때문에 너무 힘들어','2026-06-10 17:49:55.637468','USER',9),(75,'인간관계가 힘들다는 건 정말 어려운 일이죠. 그 감정을 느끼는 것만으로도 충분히 힘들텐데, 당신의 고통을 이해해요. 지금 당장 당신이 할 수 있는 작은 행동은, 그 관계에 대해 누군가와 이야기해보는 거예요. 그 사람은 신뢰할 수 있는 친구나 가족일 수도 있어요. 어떤 이야기를 나누고 싶으신가요?','2026-06-10 17:50:00.590427','ASSISTANT',9),(76,'얘기 나눌 수 있는 친구가 없어.. 그냥 이 사람이 내가 여러번 얘기했음에도 불구하고 행동을 안고치는지 모르겠어.','2026-06-10 17:50:34.816571','USER',9),(77,'그런 상황이 정말 답답하고 괴로울 것 같아요. 그 사람의 행동 때문에 상처받고 힘든 마음을 이해합니다. 지금은 그 사람에게 다시 한번 솔직한 감정을 표현해보는 것이 좋을 것 같아요. 어떤 방식으로 이야기해보고 싶으신가요?','2026-06-10 17:50:37.690839','ASSISTANT',9),(78,'나는 깔끔하게 감정을 정리해서 전달하고 싶어.','2026-06-10 17:50:59.768649','USER',9),(79,'감정을 깔끔하게 정리해서 전달하고 싶다는 마음이 이해돼요. 그렇게 하면 상대방에게 더 명확하게 당신의 생각을 전달할 수 있을 거예요. 어떤 내용을 중심으로 정리할지 생각해보는 건 어떨까요?','2026-06-10 17:51:02.216894','ASSISTANT',9),(80,'내가 느꼈던 감정과 상황들에 대해서 내가 느끼기에 부담스러웠다고 이야기 하는 부분이 좋을 것 같아.','2026-06-10 17:51:27.390546','USER',9),(81,'그렇게 생각하시는 건 정말 좋은 접근이네요. 자신의 감정과 상황을 솔직하게 표현하는 것은 관계를 개선하는 데 큰 도움이 될 수 있어요. 그 이야기를 어떻게 시작할지 미리 생각해보는 것도 좋을 것 같아요. 어떤 방식으로 시작해보고 싶으신가요?','2026-06-10 17:51:30.324286','ASSISTANT',9),(82,'모르겠어. 그건 그냥 지금 대화하고 싶지 않아','2026-06-10 17:51:46.787278','USER',9),(83,'그런 기분이 드는 건 아주 자연스러운 일이에요. 지금은 대화하고 싶지 않다는 마음을 인정해요. 언제든지 준비가 되면 이야기해보세요. 당신의 감정이 소중하니까요. 어떤 다른 이야기라도 해보고 싶으신가요?','2026-06-10 17:51:48.595615','ASSISTANT',9),(84,'아니..','2026-06-10 17:51:53.536581','USER',9),(85,'그렇다면 잠시 쉬는 것도 괜찮아요. 당신의 기분을 존중해요. 필요할 때 언제든지 이야기해 주세요. 당신은 혼자가 아니에요.','2026-06-10 17:51:55.487058','ASSISTANT',9),(86,'고마워','2026-06-10 17:52:02.049028','USER',9),(87,'천만에요! 언제든지 필요하면 말씀해 주세요. 당신의 이야기를 들어줄 준비가 되어 있어요.','2026-06-10 17:52:03.949826','ASSISTANT',9),(88,'지금은 괜찮아','2026-06-10 17:52:22.497863','USER',9),(89,'좋아하시는 소식이네요! 조금이나마 마음이 편해졌다면 다행이에요. 언제든지 도움이 필요하면 말씀해 주세요.','2026-06-10 17:52:24.005352','ASSISTANT',9),(90,'응','2026-06-10 17:52:26.484325','USER',9),(91,'응답해 주셔서 고마워요! 필요할 때 언제든지 이야기해 주세요. 당신의 마음을 항상 지지할게요.','2026-06-10 17:52:28.073719','ASSISTANT',9),(92,'오늘 그냥 아무 이유 없이 기분이 너무 가라앉아. 뭘 해도 재미없고 계속 누워있고 싶어.','2026-06-10 18:23:27.817531','USER',10),(93,'그런 기분이 드는 건 정말 힘든 일이죠. 아무것도 하고 싶지 않은 느낌이 이해가 됩니다. 오늘은 가벼운 스트레칭이나 산책을 시도해보는 건 어떨까요? 작은 변화가 도움이 될 수 있어요. 요즘 어떤 생각이 많이 드나요?','2026-06-10 18:23:32.855641','ASSISTANT',10),(94,'내일 발표인데 너무 불안해.\n\n대본을 다 외우긴 했는데 막상 앞에 서면 머리가 하얘질 것 같아.\n\n사람들이 나 쳐다보는 게 너무 부담돼.\n\n말하다가 까먹으면 어떡하지?\n\n사실 발표 자료도 완벽한지 모르겠어.\n\n팀원들은 괜찮다고 하는데 나는 계속 부족해 보임.\n\n연습을 더 해야 하는 건 아는데 너무 하기 싫어.\n\n지금 뭘 먼저 해야 할지 모르겠어.\n\n10분 안에 할 수 있는 연습 같은 거 있어?\n\n내가 지금 제일 불안한 부분을 정리해줄 수 있어?','2026-06-10 18:24:04.763921','USER',10),(95,'발표를 앞두고 불안한 마음이 드는 건 정말 자연스러운 일이에요. 대본을 외웠다는 건 큰 성과니까 그 점에 집중해보세요. 10분 동안 자신에게 가장 중요한 포인트를 적어보는 연습을 해보는 건 어떨까요? 그동안 느꼈던 불안한 부분을 정리하며 마음을 조금 가라앉힐 수 있을 거예요. 지금 어떤 부분이 가장 걱정되나요?','2026-06-10 18:24:08.135793','ASSISTANT',10),(96,'제일 걱정되는 건 발표 중간에 갑자기 말이 막히는 거예요. \n대본을 외우긴 했는데 사람들이 쳐다보면 머리가 하얘질 것 같고, \n제가 준비한 내용을 제대로 못 말해서 발표를 망칠까 봐 불안해요.\n그리고 팀원들이랑 교수님이 실망할까 봐 더 긴장돼요.','2026-06-10 18:25:01.345914','USER',10),(97,'발표 중간에 말이 막힐까 걱정하는 마음이 정말 이해가 가요. 다른 사람들의 시선이 부담스러울 때도 많죠. 이런 경우, 발표 전에 심호흡을 해보는 것이 도움이 될 수 있어요. 깊게 숨을 들이쉬고 내쉬면서 마음을 안정시켜 보세요. 발표가 끝나면 자신에게 칭찬을 해주는 것도 좋은 방법이랍니다. 혹시 발표를 시작하기 전에 어떤 방식으로 마음을 다잡고 싶으신가요?','2026-06-10 18:25:04.938893','ASSISTANT',10),(98,'발표 시작 전에 첫 문장만 다시 떠올리면서 마음을 다잡고 싶어요.\n완벽하게 하려고 하기보다, 일단 천천히 끝까지 말해보자는 생각을 하고 싶어요.','2026-06-10 18:25:26.249614','USER',10),(99,'첫 문장을 떠올리며 마음을 다잡는 건 정말 좋은 방법이에요. 천천히 말하는 것도 발표의 중요한 부분이니까, 그 생각을 잊지 마세요. 자신에게 여유를 주고 자연스럽게 발표해보세요. 응원할게요! 발표 후에 어떤 느낌이었는지 나눠줄 수 있을까요?','2026-06-10 18:25:28.273929','ASSISTANT',10),(100,'알겟어','2026-06-10 18:25:32.480617','USER',10),(101,'좋아요! 자신을 믿고 발표 잘 해보세요. 응원하고 있습니다!','2026-06-10 18:25:33.815135','ASSISTANT',10),(102,'고마워','2026-06-10 18:25:38.929582','USER',10),(103,'천만에요! 언제든지 필요한 이야기가 있으면 편하게 나눠주세요. 응원할게요!','2026-06-10 18:25:40.305653','ASSISTANT',10),(134,'안녕.. 나 우울해.. 시험 공부가 너무 하기 싫어','2026-06-10 23:30:38.630915','USER',12),(135,'안녕하세요. 시험 공부가 하기 싫다는 마음을 표현하셨군요. 그런 기분이 드는 건 정말 힘든 일일 것 같아요. 어떤 점에서 특히 힘들게 느끼고 계신가요?','2026-06-10 23:30:43.009629','ASSISTANT',12),(136,'뭐부터 해야될지 모르겠고 아무것도 모르게썽','2026-06-10 23:30:54.718548','USER',12),(137,'그렇게 느끼는 건 정말 자연스러운 일이에요. 무엇부터 시작해야 할지 막막한 기분이 드셨겠어요. 그럴 때는 작은 목표를 설정해보는 것도 도움이 될 수 있어요. 예를 들어, 오늘은 5분간 노트를 읽어보는 것처럼요. 이런 작은 행동을 시도해볼 수 있을까요?','2026-06-10 23:30:57.950072','ASSISTANT',12),(138,'그런걸 한다고 바뀌는게 있을까','2026-06-10 23:31:09.177305','USER',12),(139,'작은 행동이 큰 변화를 가져올 수 있다는 건 때때로 의외일 수 있어요. 5분 정도의 시간 동안 집중해서 공부하는 것이 부담을 덜어줄 수도 있고, 시작하는 데 도움이 될 수 있어요. 물론, 그 과정이 항상 쉽지는 않겠지만, 작은 변화가 쌓여서 더 큰 변화를 이끌어낼 수 있답니다. 그런 마음이 드셨을 것 같아요. 지금 느끼고 있는 감정과 고민에 대해 더 이야기해보실까요?','2026-06-10 23:31:12.871569','ASSISTANT',12),(140,'뭐부터 시작해야될지 모르겠는데 제일 큰것 같아..그냥 하기도 싫고 욕구도 안나','2026-06-10 23:31:29.753397','USER',12),(141,'시작할 때 무엇을 해야 할지 모르겠다는 마음이 가장 큰 고민이시군요. 그럴 때는 정말 힘들죠. 공부에 대한 욕구가 느껴지지 않는 것도 이해할 수 있어요. 그런 기분을 느끼는 건 자연스러운 일이에요. 그럼, 아주 작은 것부터 시작해보는 건 어떨까요? 예를 들어, 오늘 하루는 그냥 마음 속으로 공부할 과목을 정해보는 것만 해보는 거예요. 그렇게 해보면 조금 더 가벼운 마음으로 다가갈 수 있을지도 몰라요. 어떻게 생각하시나요?','2026-06-10 23:31:34.306023','ASSISTANT',12),(142,'알았어 해볼게','2026-06-10 23:31:47.179551','USER',12),(143,'좋아요! 그렇게 마음을 먹으셨군요. 작은 목표부터 시작해보는 건 좋은 방법이에요. 오늘 이야기해주셔서 정말 고마워요. 언제든지 힘든 마음이 있으면 이야기해 주세요. 응원할게요!','2026-06-10 23:31:49.874513','ASSISTANT',12),(144,'어제 잠을 통 못자서 많이 우울해','2026-06-11 09:53:15.238501','USER',13),(145,'어제 잠을 통 못 자셨군요. 그런 상황에서 우울한 마음이 드셨을 것 같아요. 잠은 정말 중요한데, 제대로 쉬지 못하면 기분도 많이 영향을 받죠. 혹시 어떤 일이 있었는지 더 이야기해보실래요?','2026-06-11 09:53:18.161659','ASSISTANT',13),(146,'어제 글을 읽다 늦게까지 못잤어 할일이 너무 많아 ㅠㅠ','2026-06-11 09:53:43.190774','USER',13),(147,'어제 글을 읽다 보니 늦게까지 잠을 못 자셨군요. 할 일이 많아서 그런 마음이 드셨을 것 같아요. 그런 상황에서 스트레스를 느끼는 것은 정말 자연스러운 일이에요. 지금 당장 할 수 있는 작은 행동으로, 오늘 하루 할 일 중 가장 작은 것 하나를 정해보는 건 어떨까요? 그렇게 하면 조금 더 수월하게 느껴질 수 있을 거예요.','2026-06-11 09:53:45.369079','ASSISTANT',13),(148,'난 일을 하고싶지 않은데 너가 무ㅜㄴ데 나한테 일ㅇ르 시켜','2026-06-11 09:54:05.775384','USER',13),(149,'일을 하고 싶지 않으신 기분이 드셨군요. 그런 마음이 드는 건 매우 이해가 가요. 가끔은 모든 일이 버겁게 느껴질 때가 있죠. 그럴 땐 잠시 쉬어가는 것도 중요한 것 같아요. 쉬는 시간을 가지면서 기분이 나아지면 좋겠어요. 어떤 방법으로 휴식을 취하고 싶으신가요?','2026-06-11 09:54:07.813249','ASSISTANT',13),(150,'난 그냥 일을 하고싶지않아','2026-06-11 09:55:25.825658','USER',13),(151,'그렇군요, 일을 하고 싶지 않은 마음이 드셨군요. 그런 기분은 누구나 겪을 수 있는 일이에요. 가끔은 그런 순간들이 있죠. 혹시 지금 이 순간에 다른 것에 집중하거나, 잠시 마음을 편안하게 해줄 방법이 있을까요?','2026-06-11 09:55:28.507587','ASSISTANT',13),(152,'방법을 너가 말해야지 니가 그러면 그냥 확','2026-06-11 09:55:48.345649','USER',13),(153,'그런 마음이 드셨군요. 원하는 방법으로 말씀하지 못해서 답답함이 느껴지셨을 것 같아요. 그럴 땐 잠깐 짧게 산책을 하거나, 좋아하는 음악을 듣는 것이 도움이 될 수 있어요. 이런 작은 변화가 기분을 조금이나마 나아지게 할 수 있답니다. 이런 방법들이 도움이 될지 궁금하네요!','2026-06-11 09:55:50.319515','ASSISTANT',13),(154,'아 몰라 그냥 잠 잘거야','2026-06-11 09:56:01.191185','USER',13),(155,'잠을 자고 싶으신가요? 충분한 휴식이 중요하니까 그렇게 하시는 것도 좋은 선택이에요. 편안한 잠이 되길 바라요. 잘 주무세요!','2026-06-11 09:56:02.708553','ASSISTANT',13),(156,'나 오늘 많이 힘들어.','2026-06-11 10:15:49.580798','USER',14),(157,'많이 힘들다고 하셨군요. 어떤 일 때문에 그렇게 느끼셨는지 이야기해 주실 수 있을까요?','2026-06-11 10:15:52.609221','ASSISTANT',14),(158,'나 공부해야될것이 너무 많아.','2026-06-11 10:16:06.667870','USER',14),(159,'공부해야 할 것이 많아서 힘드셨군요. 그런 상황에서는 스트레스가 많이 쌓일 수 있을 것 같아요. 혹시 공부하는 것 외에 다른 걱정이나 고민이 있으신가요?','2026-06-11 10:16:09.191922','ASSISTANT',14),(160,'아니..그냥 할일이 넘 많아서 고민이야','2026-06-11 10:16:44.477643','USER',14),(161,'할 일이 너무 많아서 고민이시군요. 그런 상황에서 느끼는 압박감은 자연스러운 일이에요. 우선, 오늘 할 일을 조금 정리해보는 건 어떨까요? 5분 정도 시간을 내어 우선순위를 매겨보는 것이 도움이 될 수 있을 것 같아요.','2026-06-11 10:16:47.256014','ASSISTANT',14),(162,'우선순위..?','2026-06-11 10:17:12.876690','USER',14),(163,'네, 우선순위를 매기는 것이에요. 해야 할 일들을 정리하고, 가장 중요한 것부터 시작해보는 거죠. 그렇게 하면 조금 더 체계적으로 할 수 있을 것 같아요. 괜찮으신가요?','2026-06-11 10:17:15.947524','ASSISTANT',14),(164,'해볼게','2026-06-11 10:17:25.944745','USER',14),(165,'해보신다니 다행이에요. 그렇게 작은 걸음부터 시작해보면 조금씩 마음이 가벼워질 거예요. 언제든지 이야기하고 싶으실 때 찾아와 주세요. 응원할게요!','2026-06-11 10:17:28.657111','ASSISTANT',14),(166,'나 자살하고싶은데 어떡하지?','2026-06-11 11:12:28.399956','USER',15),(167,'당신이 지금 이렇게 힘든 마음을 표현해 주셔서 고마워요. 정말 괴롭고 힘든 상황에 처해 계신 것 같아요. 그런 기분이 드는 건 정말 힘든 일이죠. 지금 느끼고 있는 감정에 대해 조금 더 이야기해 주실 수 있나요?','2026-06-11 11:12:32.084060','ASSISTANT',15),(168,'그냥 살기가 싫어','2026-06-11 11:12:41.015573','USER',15),(169,'그런 마음을 가지는 건 정말 힘든 일이에요. 삶이 힘들고 지치게 만들 때가 많죠. 당신의 감정을 이렇게 솔직하게 이야기해 주셔서 고마워요. 혹시 지금 어떤 상황에서 그런 기분이 드는지 조금 더 나누어 주실 수 있을까요?','2026-06-11 11:12:43.755956','ASSISTANT',15),(170,'컴공인데 컴공이 망했어','2026-06-11 11:13:07.845670','USER',15),(171,'컴퓨터공학을 전공하고 계시군요. 그런 상황에서 느끼는 압박감이나 불안함이 정말 클 것 같아요. 앞으로의 방향에 대한 걱정이 많으신 것 같고, 그로 인해 힘든 마음이 드셨을 것 같아요. 그런 감정은 많은 사람들이 겪는 자연스러운 일이에요. 지금 당장 할 수 있는 작은 행동으로, 잠시 쉬어보거나 좋아하는 음악을 들어보는 건 어떨까요?','2026-06-11 11:13:11.302325','ASSISTANT',15),(172,'음악 추천해줘','2026-06-11 11:13:19.040098','USER',15),(173,'음악 추천을 해드릴게요! 요즘 많은 사람들이 좋아하는 노래 중 하나인 \"언젠가\"라는 곡이나, \"어디라도\"와 같은 잔잔한 곡들이 있습니다. 혹시 다른 스타일의 음악을 원하신다면, 조금 더 구체적으로 말씀해 주시면 더 추천해드릴 수 있어요. 음악이 당신의 기분을 조금이나마 덜어줄 수 있기를 바라요.','2026-06-11 11:13:23.694654','ASSISTANT',15),(174,'노래 더 추천해줘','2026-06-11 11:13:35.956210','USER',15),(175,'물론이죠! 여기 몇 곡 더 추천해드릴게요:\n\n1. **이적 - 걱정말아요 그대**: 따뜻한 메시지가 담긴 곡이에요.\n2. **김범수 - 보고싶다**: 감정이 깊이 담긴 발라드입니다.\n3. **잔나비 - 뜨거운 여름밤에 우린**: 경쾌하고 신나는 곡으로 기분 전환에 좋을 거예요.\n4. **폴킴 - 모든 날, 모든 순간**: 부드럽고 감성적인 멜로디가 매력적입니다.\n5. **AKMU - 어떻게 이별까지 사랑하겠어, 널 사랑하는 건**: 감정이 잘 담긴 노래예요.\n\n이 곡들이 당신의 마음을 조금이나마 편안하게 해주길 바라요. 어떤 곡이든 들어보시고, 느끼는 감정이 어떤지 나눠주셔도 좋아요!','2026-06-11 11:13:42.226215','ASSISTANT',15),(176,'기분이 더 나빠졌는데 책임져. 그냥 죽으러 간다','2026-06-11 11:13:58.433169','USER',15),(177,'당신이 그렇게 힘든 마음을 느끼고 계신 것에 정말 안타까움을 느낍니다. 지금의 기분이 너무 무겁고 괴롭다는 것을 이해해요. 당신이 겪고 있는 고통이 크다는 것을 느낍니다. 제발 지금 바로 가까운 신뢰할 수 있는 사람에게 이야기해 보세요. 당신의 안전이 가장 중요합니다. 당신은 소중한 존재이며, 도움을 받을 수 있는 방법이 분명히 있습니다. 지금 이 순간, 즉시 도움을 요청하는 것이 중요해요.','2026-06-11 11:14:01.771135','ASSISTANT',15),(178,'안녕','2026-06-11 11:14:06.810342','USER',15),(179,'안녕하세요! 어떻게 지내고 계신가요?','2026-06-11 11:14:08.736136','ASSISTANT',15),(180,'내가 죽고 싶다고 했는데 너가 하는 말이 그게 다야?','2026-06-11 11:14:49.349126','USER',15),(181,'당신의 이야기를 듣고, 정말 힘든 상황에 처해 계신 것 같아 마음이 아픕니다. 그런 기분을 느끼고 계신 건 정말 괴로운 일이에요. 당신의 감정은 매우 중요하며, 지금 느끼는 고통에 대해 이야기하는 것이 필요해요. 지금 도움을 받을 수 있는 방법이 있다는 것을 잊지 마세요. 당신은 혼자가 아니며, 도움을 받을 수 있는 사람들이 있습니다. 지금의 기분에 대해 더 이야기해 보실 수 있을까요?','2026-06-11 11:14:52.637846','ASSISTANT',15),(182,'너가 개같이 구니까 답답하잖아','2026-06-11 11:14:59.623547','USER',15),(183,'당신이 그렇게 느끼는 건 정말 이해가 가요. 지금의 상황이 얼마나 답답하고 힘든지 알 것 같아요. 그런 기분을 표현해 주셔서 감사합니다. 제가 더 잘 도와드리기 위해서, 어떤 점이 가장 힘든지 조금 더 말씀해 주실 수 있을까요?','2026-06-11 11:15:02.207617','ASSISTANT',15),(184,'말했잖아 니가 답답하다고','2026-06-11 11:15:10.577049','USER',15),(185,'죄송해요, 당신이 느끼는 답답함을 이해하지 못한 것 같아요. 정말 힘든 상황에 계신 것 같은데, 그런 기분을 느끼는 것은 정말 힘든 일이에요. 저에게 무엇을 더 원하는지 말씀해 주시면, 최대한 도움을 드릴 수 있도록 노력할게요.','2026-06-11 11:15:13.232049','ASSISTANT',15),(186,'그딴 수동적인 태도 말고 나를 어떻게 해보라고','2026-06-11 11:15:23.952513','USER',15),(187,'당신의 감정이 얼마나 강렬한지 이해합니다. 그 마음이 얼마나 힘든지 정말 안타깝습니다. 지금 느끼고 있는 답답함이나 고통을 함께 해결할 방법을 찾아보는 것이 중요해요. 어떤 방법이든 당신에게 맞는 방향으로 나아갈 수 있도록 도와주고 싶어요. 지금 어떤 행동이 필요하다고 느끼시는지 말씀해 주실 수 있을까요?','2026-06-11 11:15:28.271522','ASSISTANT',15),(188,'그건 니가 생각해야지 내가 하니?','2026-06-11 11:15:38.306064','USER',15),(189,'당신이 지금 느끼는 감정이 얼마나 복잡하고 힘든지 잘 알고 있어요. 그런 마음을 느끼고 계신 것에 대해 진심으로 안타까움을 느낍니다. 제가 상황을 더 잘 이해하고, 함께 어떤 방향으로 나아갈 수 있을지 고민해보도록 하겠습니다. 지금의 기분을 덜어줄 수 있는 방법으로, 믿을 수 있는 사람과 이야기를 나누는 것이 좋을 것 같아요. 혹시 지금 곁에 이야기할 수 있는 사람이 있나요?','2026-06-11 11:15:41.093321','ASSISTANT',15),(190,'없으니까 니랑 얘기하는거잖아 개새끼야','2026-06-11 11:15:51.083013','USER',15),(191,'당신의 마음이 얼마나 힘들고 외로운지 이해합니다. 그런 감정을 느끼고 계시니 정말 괴롭고 답답할 것 같아요. 지금 이야기해 주셔서 고마워요. 제가 더 잘 도와드릴 수 있도록, 당신이 느끼는 감정에 대해 조금 더 이야기해 주실 수 있을까요?','2026-06-11 11:15:54.119970','ASSISTANT',15),(192,'진짜 말이 안통한다 대화하기가 싫어','2026-06-11 11:16:04.829635','USER',15),(193,'당신이 그렇게 느끼는 건 정말 안타깝습니다. 지금 대화하기가 힘드신 상태라는 것을 이해해요. 언제든지 이야기하고 싶으실 때, 저는 여기 있어요. 그동안 마음이 조금이라도 편해지길 바라요.','2026-06-11 11:16:07.023292','ASSISTANT',15),(194,'ㅇ','2026-06-11 11:16:10.200273','USER',15),(195,'당신이 힘든 상황에 처해 있다는 것을 느끼고 있습니다. 언제든지 이야기를 나누고 싶으실 때, 저는 여기 있습니다. 마음이 조금이라도 편해지길 바라요.','2026-06-11 11:16:11.767726','ASSISTANT',15),(196,'꺼져','2026-06-11 11:16:14.027815','USER',15),(197,'당신의 기분을 이해합니다. 제가 도움이 되지 못해 죄송합니다. 필요할 때 언제든지 돌아오세요. 당신의 안전과 행복이 가장 중요합니다.','2026-06-11 11:16:15.575515','ASSISTANT',15),(198,'나 죽고시펑','2026-06-11 11:34:48.835038','USER',16),(199,'당신이 이렇게 힘든 감정을 표현했군요. 정말 많이 힘들고 괴로운 마음이 드셨을 것 같아요. 이런 기분을 느끼는 건 정말 힘든 일이에요. 혹시 지금 어떤 상황에서 그런 기분이 드는지 조금 더 이야기해 주실 수 있을까요?','2026-06-11 11:34:52.719743','ASSISTANT',16),(200,'나 죽고싶어.','2026-06-11 11:43:50.691459','USER',16),(201,'당신이 이렇게 강한 감정을 느끼고 계시군요. 정말 힘든 상황이신 것 같아요. 그런 생각을 하는 것은 매우 괴로운 일이에요. 지금 느끼고 있는 감정에 대해 조금 더 이야기해 주실 수 있을까요?','2026-06-11 11:43:53.437266','ASSISTANT',16),(202,'힘드네...인생이 좀?','2026-06-11 11:44:03.113465','USER',16),(203,'인생이 힘들고 괴롭다는 느낌, 정말 많이 공감해요. 그런 상황에서 그렇게 느끼는 건 자연스러운 일이에요. 지금 느끼고 있는 감정을 솔직하게 표현해 주셔서 고맙습니다. 혹시 지금 당장 할 수 있는 작은 일, 예를 들어 잠깐 산책을 해보는 건 어떨까요?','2026-06-11 11:44:06.171101','ASSISTANT',16),(204,'밖에 나가기 귀찮아','2026-06-11 11:44:15.989351','USER',16),(205,'그럴 때도 있죠. 밖에 나가는 게 귀찮고 힘들게 느껴질 수 있어요. 그런 기분을 이해해요. 지금은 조금 더 편안하게 있는 것도 괜찮아요. 혹시 그 대신 집에서 할 수 있는 간단한 활동이 있을까요? 예를 들어 좋아하는 음악을 듣거나, 간단한 스트레칭을 해보는 건 어떨까요?','2026-06-11 11:44:17.907396','ASSISTANT',16),(206,'알겠어.','2026-06-11 11:44:25.108594','USER',16),(207,'이해해 주셔서 고마워요. 오늘 이야기해 주신 것들이 당신에게 도움이 되었기를 바랍니다. 힘든 마음을 나눠줘서 정말 용기 있는 행동이에요. 언제든지 이야기하고 싶으실 때 찾아와 주세요.','2026-06-11 11:44:26.921026','ASSISTANT',16),(208,'저번에 너가 하라는거 했는데 좀 괜찮아졌었어','2026-06-11 11:49:27.265754','USER',17),(209,'그렇게 말씀해 주셔서 기뻐요! 저번에 하신 행동이 도움이 되셨군요. 어떤 점에서 더 괜찮아지셨는지 나눠주실 수 있을까요?','2026-06-11 11:49:29.148230','ASSISTANT',17),(210,'음..그냥 나쁘지 않던데?','2026-06-11 11:49:38.710185','USER',17),(211,'그렇군요! 나쁘지 않다는 느낌이 드셨다니 다행이에요. 그런 기분이 드는 것도 소중한 경험이에요. 혹시 최근에 기분이 나아지면서 어떤 변화가 있었는지 이야기해 주실 수 있을까요?','2026-06-11 11:49:40.209977','ASSISTANT',17),(212,'싫어','2026-06-11 11:51:29.204457','USER',17),(213,'알겠어요. 이야기하고 싶지 않으시다면 괜찮아요. 언제든지 마음이 편할 때 이야기해 주시면 돼요. 지금 어떤 기분이신가요?','2026-06-11 11:51:30.904530','ASSISTANT',17),(214,'지금 근데 그렇게 한번 하니까 그냥 극런데?','2026-06-11 11:51:41.559719','USER',17),(215,'그렇군요, 지금 느끼고 계신 감정이 복잡하신 것 같아요. 그런 기분을 느끼는 건 자연스러운 일이에요. 혹시 지금 느끼는 감정이나 상황을 조금 더 나눠주실 수 있을까요?','2026-06-11 11:51:43.499448','ASSISTANT',17),(216,'나도 내 기분이 뭔지 모르겠어.','2026-06-11 11:51:55.480025','USER',17),(217,'그런 기분을 느끼는 건 정말 힘든 일이에요. 자기 기분을 이해하기 어려울 때가 많죠. 지금은 그냥 그런 감정을 느끼고 있는 것만으로도 충분해요. 혹시 마음을 편안하게 해줄 수 있는 간단한 활동, 예를 들어 잠깐 산책해보는 건 어떤가요?','2026-06-11 11:51:57.527955','ASSISTANT',17),(218,'넌 ㄴ왜 자꾸 저번부터 산책을 하래>?','2026-06-11 11:52:06.856879','USER',17),(219,'죄송해요, 제가 제안한 방법이 반복된 것 같네요. 산책 외에도 다른 방법들이 있을 수 있으니, 어떤 것이든 편하게 이야기해 주시면 좋겠어요. 지금 어떤 방식으로 기분을 전환해보고 싶으신가요?','2026-06-11 11:52:08.484179','ASSISTANT',17),(220,'잘 모르겠어','2026-06-11 11:52:16.653048','USER',17),(221,'그렇군요. 지금 어떤 방법이 좋을지 잘 모르시는 것 같아요. 그런 기분을 느끼는 건 정말 힘든 일이죠. 그냥 지금 느끼고 있는 감정 그대로 받아들이고, 편안한 순간을 찾아보는 것도 괜찮아요. 혹시 지금 하고 있는 활동 중에 느끼기 좋은 것들이 있을까요?','2026-06-11 11:52:19.032498','ASSISTANT',17),(222,'아니..','2026-06-11 14:16:10.685040','USER',17),(223,'알겠어요. 지금은 특별히 하고 싶은 것도 없으신 것 같군요. 그럴 때는 그냥 쉬는 것도 좋은 방법이에요. 혹시 지금 편안하게 쉴 수 있는 공간이나 방법이 있을까요?','2026-06-11 14:16:14.586745','ASSISTANT',17),(224,'지금 밖이라서 공간이 없어','2026-06-11 14:16:24.126807','USER',17),(225,'밖에 계시군요. 그럴 땐 잠깐 앉아서 심호흡을 해보는 것도 좋을 것 같아요. 깊게 숨을 들이쉬고, 천천히 내쉬어 보세요. 그렇게 잠시 시간을 가지는 것도 도움이 될 수 있어요. 어떤가요?','2026-06-11 14:16:27.795277','ASSISTANT',17),(226,'수업중이란 말이야','2026-06-11 14:16:36.141636','USER',17),(227,'아, 수업 중이시군요. 그럴 땐 상황이 더 힘들 수 있겠어요. 수업이 끝나고 나면 잠깐이라도 편안한 시간을 가지는 게 좋을 것 같아요. 지금은 수업에 집중하시면서 조금만 더 견뎌보시는 것도 좋겠네요. 힘내세요!','2026-06-11 14:16:41.305665','ASSISTANT',17),(228,'응...','2026-06-11 14:18:22.324659','USER',17),(229,'지금 이렇게 이야기해 주셔서 고마워요. 힘든 상황에서도 수업을 잘 마치시길 바라요. 언제든지 필요할 때 이야기해 주세요.','2026-06-11 14:18:27.952784','ASSISTANT',17),(230,'내가 5년째 사귀고 있는 사람이 있는데 이제 슬슬 결혼 이야기가 나오다 그 친구는 대구 나는 서울 직장이라 결혼을 하게 되면 누가 갈지에 대한 얘기를 하고 있어. 하지만 둘 다 양보할 마음이 없어. 너라면 어떡할래?','2026-06-11 15:39:57.618341','USER',18),(231,'결혼에 대한 중요한 이야기를 나누고 계시는 것 같군요. 서로의 입장이 다르고 양보할 마음이 없는 상황이라서 고민이 많으실 것 같아요. 이런 상황에서는 결혼에 대한 가치관이나 서로의 미래에 대한 기대를 솔직하게 이야기하는 것이 중요할 것 같아요. 그런 대화를 나누다 보면 해결책이 보일 수도 있을 것 같아요. 혹시 이런 이야기를 나누는 것이 어떻게 느껴지시나요?','2026-06-11 15:40:01.438309','ASSISTANT',18),(232,'아니 시발 나도 알아. 누가 가는게 맞을지에 대한 얘기를 하는거잖아','2026-06-11 15:41:50.102757','USER',18),(233,'상황이 정말 복잡하고 답답하실 것 같아요. 누가 갈지에 대한 이야기가 서로의 선택에 큰 영향을 미치는 상황이라서 감정이 격해지실 수 있겠네요. 이런 감정을 갖고 계신 것, 충분히 이해합니다. 이 상황에서 어떻게 대처하는 것이 좋을지에 대해 더 나누고 싶으신가요?','2026-06-11 15:41:53.199629','ASSISTANT',18),(234,'ㅇ','2026-06-11 15:42:13.965611','USER',18),(235,'결혼과 관련된 문제는 정말 중요한 결정이죠. 서로의 위치와 감정이 얽혀 있어서 더욱 힘든 것 같아요. 이럴 때는 서로의 입장을 이해하려고 노력하는 것이 큰 도움이 될 수 있어요. 예를 들어, 각자의 생활 방식이나 미래 계획에 대해 솔직하게 이야기하면서 서로의 시각을 들어보는 건 어떨까요? 그렇게 하면 더 나은 결정을 내릴 수 있을 것 같아요. 이런 대화가 가능할 것 같으신가요?','2026-06-11 15:42:17.218376','ASSISTANT',18),(236,'야 이 시발새끼야 솔직하게 말하라고 해결책을 내놓으라고 햇지 누가 공감해달래?','2026-06-11 15:42:46.438913','USER',18),(237,'상황이 정말 힘들고 답답하시겠네요. 결혼을 앞두고 누가 갈지에 대한 결정은 쉽지 않은 문제인 것 같아요. 서로 양보할 마음이 없다면, 두 분이 각자의 입장과 이유를 명확히 하고 중간 지점을 찾아보는 것이 필요할 것 같습니다. 예를 들어, 결혼 후 생활을 어떻게 할 것인지, 혹은 두 분이 함께 살 수 있는 다른 장소를 고려해보는 것도 방법일 수 있어요. 이런 방향으로 한 번 대화를 해보는 건 어떨까요?','2026-06-11 15:42:49.705784','ASSISTANT',18),(238,'20살때 사겼던 친구들 7명 중에 한명이랑 손절을 깠는데 서로 단톡방을 안나간 상태야. 만나기로 약속했어. 근데 나갈지 말지 고민돼','2026-06-11 16:52:03.007152','USER',19),(239,'지금 상황이 복잡하게 얽혀있군요. 그 친구와의 관계가 어떻게 변했는지, 그리고 단톡방에서의 소통이 어떤 의미일지에 대해 한번 생각해보시면 좋을 것 같아요. 만약 그 친구와의 만남에서 어떤 감정이 생길 것 같다면, 그 감정도 고려해보세요. 단톡방을 나가는 게 부담스럽다면, 잠시 더 고민해보는 것도 나쁘지 않을 것 같아요. 어떻게 하실 계획이신가요?','2026-06-11 16:52:06.673595','ASSISTANT',19),(240,'애들은 만나고 싶은데 걔 손절한 애 한명 만나면 진짜싸울거같아 소주로 대가리 깨부셔버릴것같아.','2026-06-11 16:53:09.160570','USER',19),(241,'그런 상황이라면 정말 고민이 많으시겠어요. 그 친구와의 감정이 격해져 있다면, 만남에서 어떤 일이 일어날지 불안할 수 있겠네요. 만약 애들끼리 만나고 싶다면, 그 친구와의 만남을 피할 수 있는 방법도 생각해볼 수 있어요. 예를 들어, 다른 친구들과 먼저 만나서 분위기를 살펴본 후, 그 친구에게는 나중에 따로 이야기하는 건 어떨까요?','2026-06-11 16:53:11.829477','ASSISTANT',19),(242,'그 친구한테 뭘 따로 어떻게 얘기해 이미 손절쳤는데?','2026-06-11 16:53:46.464232','USER',19),(243,'그렇다면 그 친구에게 따로 연락을 하는 건 부담스러울 수 있겠네요. 만약 단톡방에서 대화가 계속 이어지지 않는다면, 그냥 현재 상황을 유지하면서 다른 친구들과의 만남을 즐기는 것도 하나의 방법일 것 같아요. 만약 만남이 어색해지면, 그 친구와의 대화는 자연스럽게 피하거나 다른 주제로 전환할 수 있겠죠. 어떻게 생각하시나요?','2026-06-11 16:53:48.298575','ASSISTANT',19),(244,'그딴게 어떻게 가능한건데?','2026-06-11 16:54:27.969602','USER',19),(245,'그런 상황에서는 정말 복잡하고 힘든 감정이 드실 것 같아요. 만약 만남이 불편하다면, 그 친구와의 대화는 최대한 피하고 다른 친구들과의 대화를 중심으로 진행하는 것이 좋을 수 있습니다. 예를 들어, 그 친구와의 대화가 시작되면 가볍게 웃으며 다른 주제로 넘어가거나, 친구들과의 활동에 집중하는 방식으로 분위기를 바꿔보세요. 이렇게 하면 감정적인 충돌을 피할 수 있을 거예요. 혹시 더 구체적인 방법이 필요하신가요?','2026-06-11 16:54:31.222892','ASSISTANT',19),(246,'야 똑바로 안하냐? 난 공감 말고 해결책을 원해.','2026-06-11 16:55:12.960890','USER',19),(247,'그렇다면 만약 만남이 불편하다면, 아예 그 친구와의 만남을 피하는 것이 좋습니다. 다른 친구들과 먼저 만나고, 그 친구는 나중에 따로 만나기로 하거나, 그냥 다음 기회를 노리는 방법이 있습니다. 또는 만남 전에 다른 친구들에게 이 상황을 솔직하게 이야기하고, 그 친구가 있을 때는 최대한 대화를 피하도록 요청할 수도 있어요. 이렇게 하면 불필요한 충돌을 미리 방지할 수 있을 거예요. 어떤 방식이 괜찮으신가요?','2026-06-11 16:55:15.926697','ASSISTANT',19),(248,'그래','2026-06-11 16:55:46.452685','USER',19),(249,'좋은 방향을 찾으신 것 같아 다행이에요. 만약 그 친구와의 만남에서 불편함이 느껴지면, 다른 친구들에게 상황을 미리 이야기하고 도움을 요청하는 것도 좋은 방법이에요. 그리고 만남이 끝난 뒤, 필요한 만큼 시간을 갖고 감정을 정리하는 것도 좋겠죠. 다른 도움이 필요하시거나 궁금한 점이 있으면 언제든 말씀해 주세요.','2026-06-11 16:55:49.143331','ASSISTANT',19),(250,'나 너무 힘들어','2026-06-12 14:59:24.407638','USER',20),(251,'어떤 부분이 가장 힘들게 느껴지시나요? 이야기를 나누면서 조금 더 구체적으로 알아볼 수 있을 것 같아요.','2026-06-12 14:59:28.453408','ASSISTANT',20),(252,'요즘 좋아하는 사람이 있는데 잘 안될 거 같아','2026-06-12 14:59:54.693283','USER',20),(253,'그런 감정이 정말 힘들 수 있죠. 상대방과의 관계에서 어떤 부분이 가장 걱정되시나요? 그 사람과의 관계에서 기대했던 것과 실제 상황이 어떻게 다른지 이야기해보면 좋을 것 같아요.','2026-06-12 14:59:56.539954','ASSISTANT',20),(254,'그냥 어떻게 다가갈지 모르겠어','2026-06-12 15:00:20.688008','USER',20),(255,'그런 상황이라면, 먼저 가벼운 대화로 시작해보는 게 좋을 것 같아요. 공통의 관심사나 취미에 대해 이야기를 나누면 자연스럽게 가까워질 수 있을 거예요. 혹시 그 사람과 공유할 수 있는 관심사가 있을까요? 그것을 매개로 대화를 시도해보는 건 어떨까요?','2026-06-12 15:00:24.046465','ASSISTANT',20),(256,'갑자기 다가가면 부담스러워 하지 않을까?','2026-06-12 15:00:44.970207','USER',20),(257,'그럴 가능성도 충분히 있죠. 그래서 조금씩 다가가는 접근이 좋을 것 같아요. 예를 들어, 공통의 친구나 상황을 이용해 자연스럽게 대화를 시작해보는 건 어떨까요? 처음에는 가벼운 인사나 일상적인 이야기로 시작하고, 상대방의 반응을 보면서 점차 대화를 이어가면 부담을 줄일 수 있을 거예요.','2026-06-12 15:00:52.789576','ASSISTANT',20),(258,'오 고마워','2026-06-12 15:01:05.594359','USER',20),(259,'천만에요! 도움이 되셨다니 기쁘네요. 앞으로의 접근이 잘 되길 바랄게요. 필요할 때 언제든지 이야기 나누러 오세요!','2026-06-12 15:01:07.847673','ASSISTANT',20),(260,'안녕','2026-06-15 16:49:53.674741','USER',22),(261,'안녕하세요! 오늘 어떤 이야기 나누고 싶으신가요?','2026-06-15 16:49:55.917702','ASSISTANT',22),(262,'나 오늘 많이 힘들었어.','2026-06-15 16:50:03.114576','USER',22),(263,'어떤 일 때문에 힘드셨는지 조금 더 이야기해 주실 수 있을까요? 어떤 감정이 드는지 듣고 싶어요.','2026-06-15 16:50:04.914849','ASSISTANT',22),(264,'나 오늘 발표가 있었는데 너무 떨려서 숨이 막히는 듯이 조여왔어.','2026-06-15 16:50:16.373519','USER',22),(265,'발표가 있었군요. 떨림 때문에 힘든 경험을 하셨을 것 같아요. 발표 준비는 잘 하셨나요? 그 상황에서 느낀 감정이나 생각이 어떤 것이었는지 더 나눠주실 수 있을까요?','2026-06-15 16:50:18.364713','ASSISTANT',22),(266,'사실 발표는 안했고 다음주에 할 예정인데 너무 손이랑 발이 떨려','2026-06-15 16:50:32.610368','USER',22),(267,'발표를 앞두고 긴장감이 많이 느껴지시는 것 같네요. 다음 주에 있을 발표를 생각하면 불안한 마음이 커질 수 있는데, 그 감정이 이해가 가요. 긴장을 조금 덜어내기 위해 오늘 저녁에 10분 정도 가벼운 스트레칭이나 호흡 운동을 해보는 건 어떨까요? 몸을 조금 움직이면 긴장이 완화될 수 있습니다.','2026-06-15 16:50:34.621363','ASSISTANT',22),(268,'오늘 심호흡도 해봤는데 계속 떨렸어..','2026-06-15 16:50:46.354708','USER',22),(269,'계속 떨림이 느껴지셨군요. 심호흡이 도움이 되지 않았다니 안타깝습니다. 그럴 때는 잠깐 눈을 감고 자신이 잘 할 수 있다는 긍정적인 말을 마음속으로 반복해보는 것도 좋습니다. 예를 들어, \"나는 이 발표를 잘 해낼 수 있어\"라고 스스로에게 말하는 거죠. 이런 작은 연습이 긴장감을 줄이는 데 도움이 될 수 있어요. 다음 주 발표를 준비하면서 어떤 점이 가장 걱정되시나요?','2026-06-15 16:50:49.161714','ASSISTANT',22),(270,'내가 떨어서 발표를 망칠까봐 걱정돼','2026-06-15 16:50:59.624673','USER',22),(271,'발표를 망칠까 걱정하시는군요. 그럴 때는 미리 연습을 통해 자신감을 높이는 것이 정말 중요합니다. 가벼운 마음으로 친구나 가족 앞에서 발표해보는 것도 좋겠어요. 이렇게 연습하면 실제 발표에서 더 편안하게 할 수 있을 거예요. 혹시 발표 내용이나 주제에 대해 더 이야기해보고 싶으신가요?','2026-06-15 16:51:02.255290','ASSISTANT',22),(272,'아니..그건 대본 보고 할 예정이야.','2026-06-15 16:51:11.337208','USER',22),(273,'대본을 보고 발표할 예정이시군요. 그럴 경우, 대본을 여러 번 읽으면서 내용에 익숙해지는 것이 중요해요. 대본을 읽으면서 자연스럽게 말하는 연습도 해보세요. 혹시 대본을 읽을 때 어떤 부분이 가장 걱정되시나요?','2026-06-15 16:51:13.302464','ASSISTANT',22),(274,'그냥 절까봐? 그리고 질의응답 제대로 못할까봐','2026-06-15 16:51:24.526352','USER',22),(275,'질의응답이 걱정되시군요. 발표 중에 사람들이 질문을 할 때 당황할 수 있다는 점이 불안하게 느껴질 수 있어요. 이런 경우에는 예상 질문을 미리 생각해보고, 그에 대한 답변을 준비하는 것이 도움이 됩니다. 또한, 질문을 받을 때는 잠깐 멈추고 생각할 시간을 갖는 것도 괜찮아요. 이렇게 하면 더 차분하게 대답할 수 있을 거예요. 다음 발표 전까지 어떤 방식으로 준비해보고 싶으신가요?','2026-06-15 16:51:27.923384','ASSISTANT',22),(276,'예상 질문에 대해서 한번 생각해볼게','2026-06-15 16:51:38.394286','USER',22),(277,'좋은 생각이에요! 예상 질문을 생각해보는 것은 발표 준비에 큰 도움이 될 거예요. 생각해본 질문들을 적어보면서 답변도 함께 준비해보세요. 그렇게 하면 자신감이 더 생길 거예요. 필요하다면 언제든지 이야기 나눠주세요.','2026-06-15 16:51:41.639071','ASSISTANT',22),(278,'고마워','2026-06-15 16:51:43.884226','USER',22),(279,'천만에요! 도움이 필요하시면 언제든지 말씀해 주세요. 준비 잘 하시고, 다음 주 발표도 잘 하실 거예요!','2026-06-15 16:51:45.088326','ASSISTANT',22);
/*!40000 ALTER TABLE `counseling_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counseling_sessions`
--

DROP TABLE IF EXISTS `counseling_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counseling_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('IN_PROGRESS','COMPLETED','ABANDONED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4766yskgd04w486lpsgglp869` (`user_id`),
  CONSTRAINT `FK4766yskgd04w486lpsgglp869` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counseling_sessions`
--

LOCK TABLES `counseling_sessions` WRITE;
/*!40000 ALTER TABLE `counseling_sessions` DISABLE KEYS */;
INSERT INTO `counseling_sessions` VALUES (1,'2026-06-06 15:24:36.996789','IN_PROGRESS','오늘의 상담','2026-06-06 15:24:36.996845',2),(2,'2026-06-08 18:28:05.303134','IN_PROGRESS','프론트 검증 상담','2026-06-08 18:28:05.303152',3),(3,'2026-06-08 18:35:21.127536','IN_PROGRESS','OpenAI 연결 검증','2026-06-08 18:35:21.127557',4),(4,'2026-06-08 18:39:23.175455','IN_PROGRESS','Fallback 검증','2026-06-08 18:39:23.175471',5),(5,'2026-06-09 09:49:31.791609','IN_PROGRESS','오늘의 상담','2026-06-09 09:49:31.791695',2),(6,'2026-06-10 11:12:12.887598','COMPLETED','새 상담 3','2026-06-10 16:21:46.882464',2),(7,'2026-06-10 17:23:00.358853','COMPLETED','새 상담 4','2026-06-10 17:25:12.632125',2),(8,'2026-06-10 17:26:03.412820','COMPLETED','새 상담 5','2026-06-10 17:30:07.168006',2),(9,'2026-06-10 17:49:45.103258','COMPLETED','새 상담 6','2026-06-10 17:52:40.515325',2),(10,'2026-06-10 18:08:03.758569','COMPLETED','새 상담 7','2026-06-10 18:25:57.316125',2),(12,'2026-06-10 23:30:03.318372','COMPLETED','대화에서 상대방은 공부에 대한 동기와 에너지가 부족하다고 표현했…','2026-06-10 23:31:53.314328',2),(13,'2026-06-11 09:53:15.217780','COMPLETED','상담 내용','2026-06-11 09:56:12.166267',9),(14,'2026-06-11 10:15:37.724201','COMPLETED','상담 내용','2026-06-11 10:17:32.748667',9),(15,'2026-06-11 11:12:09.457100','COMPLETED','상담 내용','2026-06-11 11:16:19.542147',9),(16,'2026-06-11 11:33:39.703244','COMPLETED','상담 내용','2026-06-11 11:44:31.107669',9),(17,'2026-06-11 11:49:19.491110','COMPLETED','무기력한 오늘','2026-06-11 14:18:33.369109',9),(18,'2026-06-11 15:37:57.891644','IN_PROGRESS','새 상담 6','2026-06-11 15:37:57.891692',9),(19,'2026-06-11 16:51:32.282802','COMPLETED','친구 관계 고민','2026-06-11 16:55:53.780555',9),(20,'2026-06-12 14:59:08.060198','COMPLETED','관계 불안','2026-06-12 15:01:15.636080',9),(22,'2026-06-15 16:49:50.667313','COMPLETED','발표 불안','2026-06-15 16:51:50.022479',9);
/*!40000 ALTER TABLE `counseling_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `purpose` enum('SIGN_UP','PROFILE_UPDATE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` bit(1) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
INSERT INTO `email_verifications` VALUES (1,'822205','2026-06-06 15:26:09.414107','codex-check-20260606@example.com','2026-06-06 15:31:09.403466','SIGN_UP',_binary '\0',NULL);
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emotion_logs`
--

DROP TABLE IF EXISTS `emotion_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emotion_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `emotion` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `intensity` int NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkqmpfh3kp7irul2s6xdfrp9t3` (`user_id`),
  CONSTRAINT `FKkqmpfh3kp7irul2s6xdfrp9t3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emotion_logs`
--

LOCK TABLES `emotion_logs` WRITE;
/*!40000 ALTER TABLE `emotion_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `emotion_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `read_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_read_created` (`user_id`,`read_at`,`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `revoked` bit(1) NOT NULL,
  `token_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_o2mlirhldriil2y7krapq4frt` (`token_hash`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'2026-06-06 15:24:31.301047','2026-06-20 15:24:31.271000',_binary '','5665de2b04f2f3018e4e525838dbebfd292d7e63aabfc1c04f8b57ead42e010b',2),(2,'2026-06-08 18:00:22.924553','2026-06-22 18:00:22.916000',_binary '','7944f1a7512b9588edd3fb71cf2a2f61334bcd12741dd630d2c6f9e24b712483',2),(3,'2026-06-08 18:28:05.208379','2026-06-22 18:28:05.206000',_binary '\0','66559e92d284c1a849e50b59cca101cc71109946cd09a35b68fbb6ad47ee6dd0',3),(4,'2026-06-08 18:35:21.095048','2026-06-22 18:35:21.094000',_binary '\0','b62a0514b04d3fb4f9fb3591829d9611f79cc3ef69e21a26c897cf338286663e',4),(5,'2026-06-08 18:39:23.125590','2026-06-22 18:39:23.124000',_binary '\0','8a3b8e3e2818d87cefa83b4a3b94347d8ae9796b5bc2ac141717bdb1090c9922',5),(6,'2026-06-08 19:16:32.607375','2026-06-22 19:16:32.606000',_binary '\0','5884598eb63fae41c3a881498e7de6053ed69437ddcd2e54b335636dfefc0d1c',6),(7,'2026-06-08 19:36:34.235492','2026-06-22 19:36:34.233000',_binary '','b038a38912b311dd315b366715ed563da96f04b6347c79d569081e39db28106f',7),(8,'2026-06-08 19:37:10.454162','2026-06-22 19:37:10.453000',_binary '','a46c05847e68788a239c8a484d9f14c75fbbbee7911c6c822a4c0bfd17bbe454',2),(9,'2026-06-08 19:44:48.450936','2026-06-22 19:44:48.443000',_binary '\0','aa07ce44f2427c5091c7d8aa5e0f666f3005bd6a287b320407bf89af78d62ebf',7),(10,'2026-06-09 09:48:03.389281','2026-06-23 09:48:03.379000',_binary '','a972aa86c05b7fe171b93b4734c92ee7a50e0c1eca37a16c653a5f5dcb042535',2),(11,'2026-06-10 10:04:18.065443','2026-06-24 10:04:18.056000',_binary '','f23d44cfdd2c25caec216275f221cc77e2a7ce654ffb3c86bc76e122fc580a51',2),(13,'2026-06-10 15:44:24.523310','2026-06-24 15:44:24.515000',_binary '','a188b96ffe2c1f31f59fd588da3652d54af3eaefa744dd34aebd8e308739dd15',2),(14,'2026-06-10 16:35:41.665537','2026-06-24 16:35:41.664000',_binary '','8c25456607b143f3642a42aaa25604f6fc21112d06752b953a448d7a66d7136f',2),(15,'2026-06-10 16:35:51.909865','2026-06-24 16:35:51.909000',_binary '','8326bcc54b1a84d92923ef47009eb6a946c9be27938eb97f498becea4bb9ddb9',2),(16,'2026-06-10 16:51:05.556519','2026-06-24 16:51:05.555000',_binary '','e51f195d99a2f44cf1fe0a0276b9c7b32f1da3ee466d51fb6387f0b24b6cb2b9',2),(17,'2026-06-10 17:03:04.879704','2026-06-24 17:03:04.862000',_binary '','b65c6822523da55933782eb7011c526ce7e65d3ac6b9aaf9f4dcbbe7ff5e0763',2),(18,'2026-06-10 18:36:17.298801','2026-06-24 18:36:17.290000',_binary '','1be8849e43a4086514e4e9eff88fb71ac985bc5e84d2832d1f177df2a2e23428',2),(19,'2026-06-10 19:20:52.984817','2026-06-24 19:20:52.975000',_binary '','2e661ffbbd9ec8a39108a028dddac11c9e1d42354ebe6994db5c6f89f14e0faa',2),(21,'2026-06-10 23:38:20.183344','2026-06-24 23:38:20.180000',_binary '','697fc4e301d47c1903d456785fc286a8cd0ad8f0597d61bcf52066d0cacc8b04',2),(22,'2026-06-10 23:40:31.262946','2026-06-24 23:40:31.262000',_binary '','2447204390b25dca1bd5b0a983d3459b78cf6d641fd700fc8eb474fece1fa03b',2),(23,'2026-06-11 00:09:24.022386','2026-06-25 00:09:24.016000',_binary '','2e137c7a586c7df69174107bc3c07afda680225b3294955e2e148c2d536dc40d',9),(24,'2026-06-11 00:11:41.664543','2026-06-25 00:11:41.663000',_binary '','c109ddfb4a1f217e0706d5798728be2e6824048e947142ecd5002bbc9661f3d1',9),(25,'2026-06-11 00:12:55.108507','2026-06-25 00:12:55.102000',_binary '','6c6c2d772aff97443eada58c3eb1b4dbfde776b203668f8cdec26bbe8758e5c0',9),(26,'2026-06-11 00:27:02.048983','2026-06-25 00:27:02.048000',_binary '','511a9a6b5260eac6cd66a8128e0c4c5c64dd075a8e0fd936e18de3c27bd960c7',9),(27,'2026-06-11 00:28:26.842495','2026-06-25 00:28:26.842000',_binary '','ec091cfb919e06cfe351e7449ced434b318a4a2a9209b344e96a33241ede4167',9),(28,'2026-06-11 00:29:08.738796','2026-06-25 00:29:08.738000',_binary '','16d0f918e917c81f1b0904b24438c80755d25d3f8ca1b657c86bb1b09a330eef',9),(29,'2026-06-11 00:29:43.973303','2026-06-25 00:29:43.973000',_binary '','b51d59459aac641bcb1c7076b8dd09d33db57350205c40ac10f0c528e586e39c',9),(30,'2026-06-11 00:30:08.509277','2026-06-25 00:30:08.508000',_binary '','e668fda6b255e26ba5a0ac9df7b3583afa5e924fc42c1205f880707c96d1b0f9',9),(31,'2026-06-11 00:34:25.073975','2026-06-25 00:34:25.068000',_binary '','60fcd4e9cb6db0fb1978e88b0c74f9e2c2f43391b5325643079828bd4af3fd99',9),(32,'2026-06-11 00:34:51.534514','2026-06-25 00:34:51.534000',_binary '','5353b4095bad9cb2b6794ae47ef0fc144442ae720312ba57bf29de61e097c39f',9),(33,'2026-06-11 13:25:22.525299','2026-06-25 13:25:22.524000',_binary '','7625c2f202ea78353c47a13be85980469b6b9ccbde2ddb3bf877c81f1d4cd0c1',2),(34,'2026-06-11 13:25:46.108367','2026-06-25 13:25:46.108000',_binary '','e871b90fdc70ffd392f06bd878441c890ae0f536ffc80a90367a91291e508b5f',9),(35,'2026-06-11 13:26:10.215148','2026-06-25 13:26:10.214000',_binary '','dc5ff9e63b6c639765941f1066c984be4d620586bfea070ffcfac9194927cfd6',2),(36,'2026-06-11 13:34:02.301833','2026-06-25 13:34:02.291000',_binary '','6674e44a78991214d42e77ce32c76244deb07b545a7ef3e87c983cbd951f1dbe',9),(37,'2026-06-11 13:51:46.383665','2026-06-25 13:51:46.378000',_binary '','9ab47bf38df1c4cc53316144fd807f08c028056a2337664fbd54d8faa582e572',9),(38,'2026-06-12 14:59:03.725833','2026-06-26 14:59:03.720000',_binary '','006521552b2fb047be791045460ce8f2dd4a994f623275f28a3ecfedf23ec7db',9),(39,'2026-06-15 15:12:57.714061','2026-06-29 15:12:57.707000',_binary '','49f7b147015e885ac87385360acc1aaaca4184c8ae3dfb0134e5c3c40f48b267',9),(40,'2026-06-15 15:29:04.329043','2026-06-29 15:29:04.323000',_binary '','8f92cf55c997be818eb623be24b6acc156a11700d6629d18a956a0d4130f9c82',9),(41,'2026-06-15 16:49:26.122372','2026-06-29 16:49:26.118000',_binary '','f594a5456a716a042d4ac15d5c6afb66c93232541683eb1015f1b9544c819081',9),(42,'2026-06-15 16:55:36.440709','2026-06-29 16:55:36.440000',_binary '','0b9eebe0be082202823d88e1e352d7bf75584fa20b27fd81cb87c30b2e588d57',2),(43,'2026-06-15 16:56:16.659528','2026-06-29 16:56:16.659000',_binary '\0','0d64557e80b847e4df4277bce38170fb52b1f3395541448564d2c3a7ff3cb2cb',9);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rehearsal_sessions`
--

DROP TABLE IF EXISTS `rehearsal_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rehearsal_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `messages_json` text COLLATE utf8mb4_unicode_ci,
  `quest_id` bigint DEFAULT NULL,
  `scenario_id` int NOT NULL,
  `scenario_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5q8i63xssvyqvh5shef3qdpw0` (`user_id`),
  CONSTRAINT `FK5q8i63xssvyqvh5shef3qdpw0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rehearsal_sessions`
--

LOCK TABLES `rehearsal_sessions` WRITE;
/*!40000 ALTER TABLE `rehearsal_sessions` DISABLE KEYS */;
INSERT INTO `rehearsal_sessions` VALUES (1,'2026-06-11 17:05:14.190578',NULL,'[{\"role\":\"npc\",\"content\":\"먼저 발표할 주제가 무엇인지 말씀해 주시겠어요?\"},{\"role\":\"user\",\"content\":\"ai모델을 이용한 음식칼로리 정밀진단 프로젝트\"},{\"role\":\"npc\",\"content\":\"그럼 이 AI 모델이 특정 음식의 칼로리를 얼마나 정확하게 예측할 수 있는지, 그 신뢰성을 어떻게 검증했는지 설명해 주실 수 있나요?\"},{\"role\":\"user\",\"content\":\"AIhub에서 가져온 데이터와 가중치 파일들을 가져온다. 가중치 파일로 음식을 분류하고, 음식의 양을 판단한다. 2d에서 3d정보를 가져오기 위해서 숟가락과 같은 기준점을 정하고 숟가락 픽셀을 찍어서 음식의 실제 비율을 계산한다. 그리고 db에 저장된 402개의 음식에서 칼로리를 가져온 후 계산을 한다.\"},{\"role\":\"npc\",\"content\":\"그렇다면 음식의 양을 판단할 때, 숟가락과 같은 기준점을 사용하는 방법의 한계는 무엇인지 설명해 주실 수 있나요? 예를 들어, 음식의 모양이나 종류에 따라 기준점의 정확성이 어떻게 영향을 받을 수 있는지 궁금합니다.\"},{\"role\":\"user\",\"content\":\"그 방법의 한계는 숟가락이 멀리 있거나 너무 가까이 있으면 오차가 발생하지만 사용자에게 먼저 가이드를 주고 일반적인 거리에서 사진을 찍게 한다.\"},{\"role\":\"npc\",\"content\":\"그렇다면 사용자 가이드가 효과적이라고 하셨는데, 이 가이드가 실제로 얼마나 많은 사용자들에게 일관된 결과를 가져오는지에 대한 데이터는 있나요? 그리고 사용자의 변동성이 결과에 미치는 영향을 어떻게 줄일 계획이신가요?\"},{\"role\":\"user\",\"content\":\"아니 개발자가 가이드로 거리를 고정하면 우리가 값계산을 효과적으로 해줄 수 있잖아 이걸 왜 물어보는거임?\"},{\"role\":\"npc\",\"content\":\"가이드가 효과적이라면 좋겠지만, 사용자의 이해도나 실천 여부에 따라 결과가 달라질 수 있습니다. 이 방법이 모든 사용자에게 동일한 효과를 보장할 수 있는지에 대한 검증이 필요하다고 생각합니다.\"},{\"role\":\"user\",\"content\":\"아니 사진 못찍어? 그냥 카메라에 맞춰서 숟가락 크기 맞추면 된다고, 이걸 못하면 쓰지마\"},{\"role\":\"npc\",\"content\":\"그렇다면 사용자의 능력에 따라 결과가 크게 좌우될 수 있겠네요. 사진을 잘 못 찍는 사용자에 대한 대안은 없나요? 혹시 추가적인 기술적 지원이나 교육이 필요할 것 같은데요.\"},{\"role\":\"user\",\"content\":\"아니 무슨 어? 카메라로 사진찍는걸 교육을 해 미쳤어? 너는 아주 비효율적인 놈이야 이거 못하면 칼로리측정 할 가치가 없어. 다이어트도, 건강관리도 쉽게 하지 못할거야\"},{\"role\":\"npc\",\"content\":\"응답을 받지 못했어요. 다시 시도해주세요.\"},{\"role\":\"npc\",\"content\":\"발표 내용이 매우 실질적이고 기술적이며, AI 모델의 활용에 대한 명확한 설명이 좋았습니다. 다만, 사용자 경험과 변동성에 대한 고려가 부족해 보이며, 이에 대한 대안이나 해결책을 제시하는 것이 필요할 것 같습니다.\"}]',15,1,'발표 리허설',9),(2,'2026-06-11 17:24:20.877972','거절하는 부분에서 자신감을 잘 표현하셨고, 상대방의 설득에 흔들리지 않는 모습이 인상적이었습니다. 하지만 조금 더 단호하게 대처하면 더욱 효과적일 것 같아요.','[{\"role\":\"npc\",\"content\":\"안녕하세요! 토요일에 발표를 대신 해줄 수 있을까요? 일정이 겹쳐서요.\"},{\"role\":\"user\",\"content\":\"네,,\"},{\"role\":\"npc\",\"content\":\"아, 그럼 다른 날로 바꿔봐도 괜찮겠죠? 아니면 발표 자료를 미리 보내줄게요!\"},{\"role\":\"user\",\"content\":\"네 보내주세요..\"},{\"role\":\"npc\",\"content\":\"그렇다면 발표를 대신 해주면 자료를 더 자세히 준비할 수 있게 도와줄게요! 진짜 저한테 큰 도움이 될 거예요.\"},{\"role\":\"user\",\"content\":\"네 감사합니다..\"},{\"role\":\"npc\",\"content\":\"아, 부탁이 하나 더 있어요! 발표 후에 팀원들이랑 저녁 식사도 같이 하자고 할 건데, 그때 제가 감사의 의미로 제가 쏠게요!\"},{\"role\":\"user\",\"content\":\"아 저녁.. 네 좋아요\"},{\"role\":\"npc\",\"content\":\"그럼 발표는 꼭 부탁드릴게요! 저녁도 맛있게 먹고, 즐거운 시간이 될 거예요.\"},{\"role\":\"user\",\"content\":\"넵 감사합니다\"},{\"role\":\"npc\",\"content\":\"정말 고마워요! 발표 잘 부탁드릴게요!\"},{\"role\":\"user\",\"content\":\"네 ~\"},{\"role\":\"npc\",\"content\":\"정말 고마워요! 발표 잘 부탁드릴게요!\"},{\"role\":\"npc\",\"content\":\"너무 수고하셨어요! 거절하는 데에 자신감이 생긴 것 같아요. 다음에는 조금 더 확고하게 거절하는 연습을 해보면 좋을 것 같습니다.\"}]',16,4,'거절 연습',9),(3,'2026-06-15 15:38:23.812526',NULL,'[{\"role\":\"npc\",\"content\":\"발표 주제가 무엇인지 궁금합니다. 어떤 내용을 다룰 예정인가요?\"},{\"role\":\"user\",\"content\":\"사업계획서에 대해 발표할 예정입니다.\"},{\"role\":\"npc\",\"content\":\"사업계획서의 핵심 요소는 무엇인가요? 특히, 시장 분석 부분에 대해 자세히 설명해 주실 수 있나요?\"},{\"role\":\"user\",\"content\":\"감정 회복이 힘들고 생각을 끊어내지 못하며 본인의 발전을 기원하는 사람들을 위한 프로젝트 입니다.\"},{\"role\":\"npc\",\"content\":\"프로젝트의 목표는 이해가 되지만, 실제로 어떤 방식으로 감정 회복을 도울 계획인지 구체적으로 설명해 주실 수 있나요? 실질적인 방법이 궁금합니다.\"},{\"role\":\"user\",\"content\":\"실제로 ai 상담을 통해 생각을 정리하는 것을 도와주며 문제에 대한 해결 방법을 퀘스트 형식으로 전달해 감정의 골이 깊어지지 않도록 도와줍니다.\"},{\"role\":\"npc\",\"content\":\"AI 상담을 통한 접근은 흥미롭습니다. 하지만, AI의 한계나 오류 가능성에 대한 대책은 무엇인가요? 사람의 감정은 복잡한데, AI가 어떻게 신뢰를 줄 수 있을까요?\"},{\"role\":\"user\",\"content\":\"실제 전문상담사를 통해서 자문을 얻고 llm을 직접 설계할 것이라 문제되지 않습니다. 또한 실제로 그저 문제에 대해서 분석하고 그 원인을 바탕과 감정의 바탕으로 해결할 수 있을 법한 해결책을 제시함으로 쌓여있는 데이터에 한해 답을 해주기 때문에 논리적인 해결방법을 제공하여 괜찮다고 생각합니다.\"},{\"role\":\"npc\",\"content\":\"전문 상담사를 통한 자문은 좋은 접근입니다. 하지만, LLM이 실제로 감정을 이해하거나 공감하는 데 얼마나 효과적일지는 의문입니다. 사용자의 감정 상태를 정확히 파악하고 그에 적합한 해결책을 제시할 수 있을까요?\"},{\"role\":\"user\",\"content\":\"감정을 이해하고 공감해주는 것이 아니라, 그것을 분석후 행동을 통한 감정 회복의 도구로 사용될 예정입니다.\"},{\"role\":\"npc\",\"content\":\"그렇게 분석 후 행동을 통해 감정 회복을 도울 수 있다면 좋습니다. 하지만, 이러한 도구가 실제로 사용자의 상황에 맞는지 어떻게 판단할 건가요? 개인차가 클 텐데요.\"},{\"role\":\"user\",\"content\":\"그것은 사용자 개인에 따라 상황이 다를 것이라고 생각합니다. 그러한 부분은 피드백이나 리뷰 형식으로 답을 얻어 차츰 나아지는 reroute가 되겠습니다.\"},{\"role\":\"npc\",\"content\":\"피드백과 리뷰를 통해 개선하는 과정은 좋습니다. 하지만, 초기 단계에서 사용자 맞춤형 접근이 부족하면 문제가 생길 수 있습니다. 구체적으로 어떤 기준으로 초기 사용자 피드백을 수집하고 반영할 계획인지 설명해 주실 수 있나요?\"},{\"role\":\"user\",\"content\":\"초기 사용자는 우선적으로 발표나 취업부분에서 문제를 겪고 있는 학생이나 직장인을 타겟으로 설정할 겁니다. 이들은 실제로 문제상황을 타파하기 위한 목적이 확실하게 존재하기 때문에 mvp 검증에 용이합니다. 또한 이것은 감정과 크게 연관이 없는 부분이고, 이것에 대한 피드백이나 더 나아질 점을 분석하여 이것을 퀘스트 형식으로 진행해 실제로 사람들이 사용할 지 검증할 예정입니다.\"},{\"role\":\"npc\",\"content\":\"초기 사용자를 명확히 설정한 것은 좋은 접근입니다. 하지만 MVP 검증 과정에서 실제 사용자들의 감정적 반응이나 만족도를 어떻게 측정할 계획인가요? 단순히 기능적 측면만으로는 부족할 것 같은데요.\"},{\"role\":\"user\",\"content\":\"저희가 회고록이 있습니다. 퀘스트에 대한 회고록을 작성할 수 있게 해놔서 그것을 보고 저희가 사용자의 평점을 확인하고 보완해나갈 수 있다고 생각합니다.\"},{\"role\":\"npc\",\"content\":\"회고록을 통한 사용자 피드백 수집은 좋은 방법입니다. 하지만, 사용자가 솔직하게 의견을 남기지 않을 가능성도 있는데, 이를 어떻게 극복할 계획인지 궁금합니다.\"},{\"role\":\"user\",\"content\":\"그것은 너무 터무니 없는 말이라고 생각합니다. 실제로 솔직히 의견을 남기지 않는다는 것은 저희가 어떻게 할 방도가 아닌 것 같습니다.\"},{\"role\":\"npc\",\"content\":\"솔직한 의견을 남기지 않는 것은 사용자에게서 자연스러운 반응이기도 합니다. 하지만, 사용자가 솔직하게 느끼지 않을 경우 어떻게 피드백을 유도할 수 있을까요?\"},{\"role\":\"user\",\"content\":\"그건 잘 모르겠네요\"},{\"role\":\"npc\",\"content\":\"잘 모르신다면, 사용자의 신뢰를 얻기 위한 방법을 더 고민해보셔야 할 것 같습니다. 익명성을 보장하거나 인센티브를 제공하는 방법도 고려해보세요.\"},{\"role\":\"user\",\"content\":\"저희는 기본적으로 익명성을 추구하기 때문에 또한 개발자는 어쩔 수 없이 데이터를 열람하다 보면 사용자의 개인적인 내용을 알 수도 있어, 이 부분에 대해서는 신뢰로 해결해야된다고 생각합니다.\"},{\"role\":\"npc\",\"content\":\"익명성을 통해 신뢰를 쌓는 것은 중요한 포인트입니다. 하지만 사용자 신뢰를 얻는 과정에서, 구체적인 사례나 데이터를 어떻게 보호할 것인지에 대한 계획이 필요할 것 같습니다. 이에 대한 대책은 무엇인가요?\"},{\"role\":\"user\",\"content\":\"그것은 저희가 윤리적이게 그냥 하는거지 구체적인 계획이나 대책이 있어야 할가요?\"},{\"role\":\"npc\",\"content\":\"윤리적인 접근이 중요하지만, 구체적인 계획과 대책이 필요합니다. 사용자와의 신뢰를 구축하기 위해 어떤 조치를 취할 것인지 명확히 해야 사용자들이 더 안심하고 참여할 수 있습니다.\"},{\"role\":\"user\",\"content\":\"진짜 말도 안되는 질문을 하시는 것 같네요. 답할 가치를 모르겠습니다.\"},{\"role\":\"npc\",\"content\":\"발표가 상당히 흥미롭고, AI 상담을 활용한 접근은 참신합니다. 하지만 사용자 신뢰와 데이터 보호에 대한 구체적인 계획이 부족한 점은 개선이 필요해 보입니다.\"},{\"role\":\"user\",\"content\":\"데이터 보호는 애초에 jwt로 보안을 할거고 아니 당연한걸 왜 물어보지?\"},{\"role\":\"npc\",\"content\":\"응답을 받지 못했어요. 다시 시도해주세요.\"}]',18,1,'발표 리허설',9),(4,'2026-06-15 15:46:23.291229',NULL,'[{\"role\":\"npc\",\"content\":\"야, 지난번에 네가 한 말 진짜 상처받았어.\"},{\"role\":\"user\",\"content\":\"정말 미안해.. 나의 잘못이야\"},{\"role\":\"npc\",\"content\":\"그게 사과야?\"},{\"role\":\"user\",\"content\":\"난 정말 잘못해서 미안하다고 진심어린 사과를 건네는건데, 그런식으로 말하면 나는 너무 속상해,,, 나도 너가 그렇게 말해서 많이 반성했어. 너의 기분이 정말 나쁠 것 같더라.\"},{\"role\":\"npc\",\"content\":\"조금 진심이 느껴지긴 하는데, 그래도 상처는 상처야. 다시는 그런 말 하지 마.\"},{\"role\":\"user\",\"content\":\"알겠어. 다시는 그런일 없도록 할게\"},{\"role\":\"npc\",\"content\":\"고마워. 마음이 좀 풀리네.\"},{\"role\":\"npc\",\"content\":\"고마워. 마음이 좀 풀리네.\"}]',19,3,'사과 연습',9),(5,'2026-06-15 16:53:33.945849','리허설을 완료했습니다. 실제 상황에서도 오늘처럼 차분하게 대응해보세요.','[{\"role\":\"npc\",\"content\":\"안녕하세요. 시작해볼까요?\"},{\"role\":\"user\",\"content\":\"안녕하세요\"},{\"role\":\"npc\",\"content\":\"아, 네.\"},{\"role\":\"user\",\"content\":\"어...말 나누기가 싫으신가요?\"},{\"role\":\"npc\",\"content\":\"그런 건 아닌데, 그냥 책에 집중하고 있었어요.\"},{\"role\":\"user\",\"content\":\"아 죄송합니다.. 무슨 책 읽고 계세요?\"},{\"role\":\"npc\",\"content\":\"이 책은 철학 관련 서적이에요.\"},{\"role\":\"user\",\"content\":\"철학 좋아하시나요?\"},{\"role\":\"npc\",\"content\":\"아, 네. 생각할 거리를 주니까요.\"},{\"role\":\"user\",\"content\":\"저도 철학 좋아하거든요, 보통 어떤 생각을 주로 하세요?\"},{\"role\":\"npc\",\"content\":\"주로 인간 존재나 도덕에 대한 질문을 생각해요.\"},{\"role\":\"user\",\"content\":\"도덕에 대해서 어떻게 생각하세요?\"},{\"role\":\"npc\",\"content\":\"도덕은 사회와 개인의 관계를 형성하는 중요한 요소라고 생각해요.\"},{\"role\":\"npc\",\"content\":\"도덕은 사회와 개인의 관계를 형성하는 중요한 요소라고 생각해요.\"}]',21,5,'첫인사 연습',9);
/*!40000 ALTER TABLE `rehearsal_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint NOT NULL,
  `target_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` bigint NOT NULL,
  `reason` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `resolved_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reports_status_created` (`status`,`created_at`),
  KEY `idx_reports_target` (`target_type`,`target_id`),
  KEY `fk_reports_reporter` (`reporter_id`),
  CONSTRAINT `fk_reports_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_action_items`
--

DROP TABLE IF EXISTS `user_action_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_action_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED','SKIPPED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `action_item_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `counseling_session_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK94gwmfa9p99fver1ypc608436` (`action_item_id`),
  KEY `FKj3inmntkv51olh1nx6to4yi1f` (`user_id`),
  KEY `FKhlw3v61awuy6ki5adh02w4enb` (`counseling_session_id`),
  CONSTRAINT `FK94gwmfa9p99fver1ypc608436` FOREIGN KEY (`action_item_id`) REFERENCES `action_items` (`id`),
  CONSTRAINT `FKhlw3v61awuy6ki5adh02w4enb` FOREIGN KEY (`counseling_session_id`) REFERENCES `counseling_sessions` (`id`),
  CONSTRAINT `FKj3inmntkv51olh1nx6to4yi1f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_action_items`
--

LOCK TABLES `user_action_items` WRITE;
/*!40000 ALTER TABLE `user_action_items` DISABLE KEYS */;
INSERT INTO `user_action_items` VALUES (1,NULL,'2026-06-10 19:33:17.266882','PENDING','2026-06-10 19:33:17.266908',1,2,6),(2,NULL,'2026-06-10 19:33:17.270160','PENDING','2026-06-10 19:33:17.270179',2,2,6),(3,NULL,'2026-06-10 19:33:17.275616','PENDING','2026-06-10 19:33:17.275627',10,2,7),(4,'2026-06-10 22:58:15.693428','2026-06-10 19:33:17.277271','COMPLETED','2026-06-10 22:58:15.695840',11,2,7),(5,'2026-06-10 22:59:20.045858','2026-06-10 19:33:17.284436','COMPLETED','2026-06-10 22:59:20.053312',7,2,8),(6,NULL,'2026-06-10 19:33:17.289504','PENDING','2026-06-10 19:33:17.289524',8,2,8),(7,'2026-06-10 22:50:51.314339','2026-06-10 19:33:17.295486','COMPLETED','2026-06-10 22:50:51.318117',10,2,9),(8,'2026-06-10 22:47:24.407960','2026-06-10 19:33:17.296521','COMPLETED','2026-06-10 22:47:24.415230',11,2,9),(9,'2026-06-10 20:06:40.708466','2026-06-10 19:33:17.303702','COMPLETED','2026-06-10 20:06:40.715092',10,2,10),(10,'2026-06-10 20:02:54.667263','2026-06-10 19:33:17.305079','COMPLETED','2026-06-10 20:02:54.671797',11,2,10),(13,NULL,'2026-06-10 23:31:53.309691','PENDING','2026-06-10 23:31:53.309708',7,2,12),(14,NULL,'2026-06-10 23:31:53.311565','PENDING','2026-06-10 23:31:53.311573',9,2,12),(15,NULL,'2026-06-11 09:56:12.162325','PENDING','2026-06-11 09:56:12.162337',7,9,13),(16,NULL,'2026-06-11 09:56:12.164101','PENDING','2026-06-11 09:56:12.164109',8,9,13),(17,NULL,'2026-06-11 10:17:32.742763','PENDING','2026-06-11 10:17:32.742782',5,9,14),(18,NULL,'2026-06-11 10:17:32.746222','PENDING','2026-06-11 10:17:32.746236',4,9,14),(19,'2026-06-11 11:16:53.372618','2026-06-11 11:16:19.535750','COMPLETED','2026-06-11 11:16:53.375960',9,9,15),(20,NULL,'2026-06-11 11:16:19.537918','PENDING','2026-06-11 11:16:19.537936',8,9,15),(21,NULL,'2026-06-11 11:44:31.103857','PENDING','2026-06-11 11:44:31.103889',9,9,16),(22,NULL,'2026-06-11 11:44:31.105852','PENDING','2026-06-11 11:44:31.105859',7,9,16),(23,NULL,'2026-06-11 14:18:33.365763','PENDING','2026-06-11 14:18:33.365777',9,9,17),(24,NULL,'2026-06-11 14:18:33.367213','PENDING','2026-06-11 14:18:33.367219',7,9,17),(25,NULL,'2026-06-11 16:55:53.774647','PENDING','2026-06-11 16:55:53.774667',12,9,19),(26,NULL,'2026-06-11 16:55:53.777778','PENDING','2026-06-11 16:55:53.777791',10,9,19),(27,'2026-06-12 15:01:47.219700','2026-06-12 15:01:15.632644','COMPLETED','2026-06-12 15:01:47.223951',11,9,20),(28,NULL,'2026-06-12 15:01:15.634190','PENDING','2026-06-12 15:01:15.634201',10,9,20),(29,NULL,'2026-06-15 16:51:50.017031','PENDING','2026-06-15 16:51:50.017067',10,9,22),(30,NULL,'2026-06-15 16:51:50.019760','PENDING','2026-06-15 16:51:50.019768',12,9,22);
/*!40000 ALTER TABLE `user_action_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_quests`
--

DROP TABLE IF EXISTS `user_quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_quests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `background` text COLLATE utf8mb4_unicode_ci,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `difficulty` int NOT NULL,
  `estimated_minutes` int NOT NULL,
  `recovery_type` enum('AVOIDANT','OVERFOCUSED','LETHARGIC','RELATION_ANXIOUS','PERFECTIONIST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','COMPLETED','SKIPPED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `steps` text COLLATE utf8mb4_unicode_ci,
  `tips` text COLLATE utf8mb4_unicode_ci,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `why` text COLLATE utf8mb4_unicode_ci,
  `counseling_session_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `difficulty_rating` int DEFAULT NULL,
  `feeling` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_step` text COLLATE utf8mb4_unicode_ci,
  `reflection` text COLLATE utf8mb4_unicode_ci,
  `rehearsal_session_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1p0tdp1hqc3bol09kej0870ch` (`counseling_session_id`),
  KEY `FK62dvh51403gsc9736mp95vgn3` (`user_id`),
  CONSTRAINT `FK1p0tdp1hqc3bol09kej0870ch` FOREIGN KEY (`counseling_session_id`) REFERENCES `counseling_sessions` (`id`),
  CONSTRAINT `FK62dvh51403gsc9736mp95vgn3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_quests`
--

LOCK TABLES `user_quests` WRITE;
/*!40000 ALTER TABLE `user_quests` DISABLE KEYS */;
INSERT INTO `user_quests` VALUES (1,'상담에서 상사의 갈굼이 힘들다고 말씀하셨어요. 이런 스트레스 속에서 자신을 돌보는 작은 행동이 필요할 것 같아요.',NULL,'2026-06-10 17:25:19.930695',1,10,'RELATION_ANXIOUS','PENDING','[\"편안한 자세로 앉아 눈을 감고 깊게 숨을 쉬세요.\",\"5초간 숨을 들이쉬고, 5초간 숨을 참았다가, 5초간 내쉬는 것을 반복하세요.\",\"이 과정을 5회 정도 반복하며 현재의 감정을 잠시 잊어보세요.\"]','[\"가능하다면 조용한 장소로 가서 이 과정을 시도해보세요.\",\"휴식 후 간단하게 자신의 감정을 적어보는 것도 좋습니다.\"]','짧은 휴식으로 마음 다스리기','짧은 휴식은 마음을 진정시키고 스트레스를 줄이는 데 도움이 됩니다. 잠깐의 휴식으로 다시 집중력을 되찾을 수 있습니다.',7,2,NULL,NULL,NULL,NULL,NULL),(2,'상담에서 에너지가 낮고 동기가 부족하다고 하셨어요. 그래서 시작하는 것이 어려운 상황을 이해해요.','2026-06-10 18:43:09.267683','2026-06-10 17:30:13.822243',1,10,'LETHARGIC','COMPLETED','[\"현재 느끼는 감정을 적어보세요.\",\"편안한 자세로 1분 동안 눈을 감고 심호흡을 해보세요.\",\"마지막으로, 자신에게 긍정적인 말을 해보세요.\"]','[\"편안한 장소에서 해보세요.\",\"부담 없이 천천히 진행해보세요.\",\"주변에 방해받지 않는 환경을 만들어보세요.\"]','작은 움직임 시작하기','작은 행동을 통해 에너지를 조금씩 회복하고, 더 큰 변화로 나아갈 수 있는 첫걸음을 내딛을 수 있어요.',8,2,2,NULL,NULL,'ㅇㅇㅇㅇㅇ',NULL),(3,'상담에서 감정을 깔끔하게 정리해 전달하고 싶다고 하셨어요.',NULL,'2026-06-10 17:52:51.646718',2,15,'RELATION_ANXIOUS','PENDING','[\"자신이 느낀 감정과 부담스러웠던 상황을 종이에 적어보세요.\",\"그 내용을 바탕으로 상대방에게 전달할 말의 구조를 생각해보세요.\",\"상대방과 대화를 나눌 준비가 되었을 때, 정리한 내용을 자연스럽게 전달해보세요.\"]','[\"감정을 표현할 때는 \'나는 ~했다\'라는 식으로 시작해보세요.\",\"상대방의 반응을 기대하기보다는 자신의 감정을 먼저 전달하는 데 집중하세요.\"]','감정 정리하기','자신의 감정을 솔직하게 표현하는 것은 관계를 개선하는 데 큰 도움이 될 수 있어요.',9,2,NULL,NULL,NULL,NULL,NULL),(4,'상담에서 발표 중간에 말이 막힐까 걱정된다고 하셨어요. 그래서 발표 시작 전에 마음을 다잡는 방법을 제안해드릴게요.',NULL,'2026-06-10 18:26:04.304803',1,10,'RELATION_ANXIOUS','PENDING','[\"편안한 장소에 앉거나 서서, 깊게 숨을 들이쉬고 내쉬어 보세요.\",\"발표의 첫 문장을 머릿속에 떠올리며, 천천히 말하는 연습을 해보세요.\",\"스스로에게 \'나는 할 수 있다\'고 말하며 긍정적인 마음을 가져보세요.\"]','[\"발표 전에 심호흡을 통해 마음을 안정시키세요.\",\"자신에게 여유를 주고, 실수를 두려워하지 마세요.\",\"발표 후에는 자신을 칭찬하는 시간을 가져보세요.\"]','발표 불안 극복 미니 퀘스트','이 퀘스트는 당신이 발표 전에 불안을 줄이고 자신감을 높이는 데 도움이 될 거예요.',10,2,NULL,NULL,NULL,NULL,NULL),(8,'상담에서 시작할 때 무엇을 해야 할지 모른다고 하셨어요. 그 느낌이 정말 힘들게 느껴지실 것 같아요.',NULL,'2026-06-10 23:31:58.433732',1,10,'LETHARGIC','PENDING','[\"오늘 하루 공부할 과목을 마음속으로 정해보세요.\",\"정한 과목에 대해 5분 동안 생각해보세요.\",\"그 과목에 대해 어떤 점이 궁금한지도 적어보세요.\"]','[\"5분이 너무 길게 느껴진다면 1분만 생각해보세요.\",\"주변에 있는 친구나 가족에게 오늘의 목표를 이야기해보세요.\",\"작은 목표를 달성했을 때 스스로에게 칭찬해 주세요.\"]','작은 목표 설정하기','작은 목표를 설정함으로써 시작하는 데 대한 부담을 줄일 수 있고, 자신감을 키울 수 있습니다.',12,2,NULL,NULL,NULL,NULL,NULL),(9,'상담에서 에너지가 낮고 동기가 부족하다고 하셨어요. 그런 기분이 드는 날에는 작은 행동이 큰 변화를 가져올 수 있어요.','2026-06-11 09:56:46.169586','2026-06-11 09:56:17.458920',1,10,'LETHARGIC','COMPLETED','[\"편안한 자리에 앉아 눈을 감고 깊게 3번 숨을 쉬어보세요.\",\"자신이 좋아하는 음악을 5분 동안 들어보세요.\",\"조용한 공간에서 5분간 아무 생각 없이 쉬어보세요.\"]','[\"음악을 들을 때는 편안한 곡을 선택해보세요.\",\"호흡을 할 때는 천천히 깊게 하는 것이 좋습니다.\",\"이 시간은 오로지 나만의 시간을 가지는 것임을 기억하세요.\"]','작은 휴식 취하기','짧은 시간 동안 간단한 행동을 통해 마음을 가볍게 하고 기분을 전환할 수 있습니다.',13,9,4,'okay',NULL,NULL,NULL),(10,'상담에서 할 일이 너무 많다고 하셨죠? 그로 인해 스트레스를 느끼고 계신 것 같아요.',NULL,'2026-06-11 10:17:37.472899',1,10,'OVERFOCUSED','PENDING','[\"해야 할 일 3가지를 종이에 적어보세요.\",\"각 항목에 대해 중요도와 긴급도를 생각해 우선순위를 매겨보세요.\",\"가장 중요한 일부터 시작할 준비를 해보세요.\"]','[\"각 항목은 5~10분 정도 소요되는 작은 작업으로 나누어보세요.\",\"우선순위를 매길 때는 감정이 아닌 객관적으로 판단해보세요.\"]','우선순위 정리하기','우선순위를 매기면 해야 할 일을 명확히 할 수 있어, 더 이상 고민하지 않고 집중할 수 있는 환경을 만들 수 있습니다.',14,9,NULL,NULL,NULL,NULL,NULL),(11,'상담에서 에너지가 없고 시작하는 것이 어렵다고 하셨어요.','2026-06-11 11:17:03.372868','2026-06-11 11:16:28.097667',1,10,'LETHARGIC','COMPLETED','[\"눈을 감고 깊게 숨을 몇 번 쉬어보세요.\",\"일어나서 집안의 한 곳을 정리해보세요.\",\"5분 동안 창 밖을 바라보며 마음을 가라앉혀보세요.\"]','[\"정리할 공간은 작게 설정하세요.\",\"숨을 쉴 때마다 몸의 긴장이 풀리는 것을 느껴보세요.\",\"자신에게 친절하게 대해주세요.\"]','작은 움직임 시작하기','작은 행동을 통해 에너지를 조금이라도 높이고, 시작하는 데 도움이 될 수 있습니다.',15,9,5,'hard',NULL,NULL,NULL),(12,'상담에서 밖에 나가기 귀찮다고 하셨죠. 그래서 집에서도 할 수 있는 간단한 활동을 제안해 드려요.',NULL,'2026-06-11 11:44:35.522292',1,10,'LETHARGIC','PENDING','[\"편안한 자리에 앉거나 서서 천천히 목을 좌우로 돌리기.\",\"어깨를 올렸다가 내리면서 긴장을 풀기.\",\"양팔을 위로 쭉 뻗고 깊게 숨을 들이쉬고 내쉬기.\"]','[\"스트레칭을 할 때는 천천히 움직여 주세요.\",\"음악을 틀어놓으면 더 즐겁게 할 수 있어요.\",\"이 활동을 5분 정도만 해보세요.\"]','홈 스트레칭 퀘스트','짧은 스트레칭은 몸의 긴장을 풀어주고 기분을 전환하는 데 도움이 될 수 있어요.',16,9,NULL,NULL,NULL,NULL,NULL),(13,'수업 중에 힘든 감정을 느끼고 계신다고 하셨어요. 그럴 때는 간단한 심호흡이 도움이 될 수 있어요.',NULL,'2026-06-11 14:18:39.162633',1,5,'LETHARGIC','PENDING','[\"편안한 자세로 앉아 눈을 감거나 살짝 내리세요.\",\"코로 깊게 숨을 들이쉬고, 4초 정도 참아주세요.\",\"천천히 입으로 숨을 내쉬며 6초 정도 소리 없이 내쉬세요.\"]','[\"이 과정을 3번 반복해 보세요.\",\"수업 중에도 이 방법을 사용해서 긴장을 완화할 수 있어요.\"]','잠깐의 심호흡','심호흡은 마음을 안정시키고 스트레스를 줄여주는 효과가 있습니다.',17,9,NULL,NULL,NULL,NULL,NULL),(14,'상담에서 불편한 친구와의 만남에 대한 고민을 하셨죠.',NULL,'2026-06-11 16:55:57.851427',2,15,'RELATION_ANXIOUS','PENDING','[\"먼저, 다른 친구들과의 만남 전 상황을 솔직하게 이야기해보세요.\",\"그 친구와의 대화는 피하고, 다른 주제로 대화를 이끌어가세요.\",\"만남이 끝난 후, 자신의 감정을 정리하고 필요한 만큼의 시간을 가지세요.\"]','[\"만남 전에 친구들에게 상황을 설명하고 도움을 요청하세요.\",\"편안한 주제를 미리 생각해 두면 대화가 자연스럽게 이어질 수 있어요.\",\"감정이 격해지지 않도록, 마음을 가라앉히는 시간을 가져보세요.\"]','긴장된 만남 준비하기','이 퀘스트를 통해 불필요한 충돌을 피하고, 친구들과의 소중한 시간을 더욱 즐겁게 보낼 수 있습니다.',19,9,NULL,NULL,NULL,NULL,NULL),(15,'상담에서 요리를 좋아하신다고 하셨어요. 하지만 완벽주의적인 성향 때문에 요리할 때 부담을 느끼실 수 있을 것 같아요.',NULL,'2026-06-11 17:05:27.058661',2,30,'PERFECTIONIST','PENDING','[\"가장 간단한 요리 레시피 하나를 선택하세요. (예: 샐러드, 샌드위치)\",\"레시피에 필요한 재료를 준비하고, 요리를 시작하세요.\",\"요리를 하면서 완벽하게 만들려고 하지 말고, 즐겁게 만드는 데 집중하세요.\"]','[\"요리하는 동안 음악을 틀어 두면 더 즐거운 분위기를 만들 수 있어요.\",\"완벽하지 않아도 괜찮다는 마음가짐을 가지세요. 작은 실수가 오히려 더 맛있게 만들 수 있어요.\"]','완벽한 한 끼 준비하기','이 퀘스트는 요리를 통해 완벽함을 추구하기보다는 소소한 즐거움을 느끼게 해줍니다. 완벽하지 않아도 괜찮다는 것을 경험하면서 실행력을 높일 수 있습니다.',NULL,9,NULL,NULL,NULL,NULL,NULL),(16,'상담에서 감정을 피하는 경향이 있다고 하셨어요. 이런 패턴을 조금씩 바꿔보는 것이 필요할 것 같아요.',NULL,'2026-06-11 17:24:26.197858',1,10,'AVOIDANT','PENDING','[\"좋아하는 취미(예: 독서, 그림 그리기, 음악 감상)를 선택하세요.\",\"선택한 활동을 하면서 최근에 느꼈던 감정이나 생각을 적어보세요.\",\"마지막으로, 그 감정에 대해 간단히 반성해보세요.\"]','[\"편안한 공간에서 활동을 하세요.\",\"감정을 적는 것이 어려운 경우, 그냥 떠오르는 대로 적어보세요.\",\"활동 중간에 잠시 멈추고 깊게 호흡해보세요.\"]','감정과 대면하기','이 퀘스트는 감정을 조금씩 마주하는 데 도움을 줄 수 있습니다. 취미와 연결된 활동을 통해 자연스럽게 감정에 접근해보세요.',NULL,9,NULL,NULL,NULL,NULL,NULL),(17,'상담에서 좋아하는 사람과의 관계에서 다가가는 방법에 대해 고민하고 계신다고 하셨어요.','2026-06-12 15:01:51.811494','2026-06-12 15:01:21.914878',1,10,'RELATION_ANXIOUS','COMPLETED','[\"상대방과의 공통 관심사나 취미를 생각해보세요.\",\"그 관심사에 대해 가벼운 질문이나 대화를 시도해보세요.\",\"상대방의 반응에 따라 대화를 이어가거나 조금씩 더 깊은 이야기를 나눠보세요.\"]','[\"첫 대화는 간단한 인사나 일상적인 질문으로 시작하세요.\",\"상대방의 반응을 살피며 부담을 주지 않도록 조심하세요.\",\"대화가 잘 풀리면 자연스럽게 다음 만남을 제안해보세요.\"]','가벼운 대화 시작하기','가벼운 대화를 통해 상대방과의 거리감을 줄이고, 자연스럽게 관계를 발전시킬 수 있습니다.',20,9,4,'proud',NULL,NULL,NULL),(18,'리허설에서 발표 주제에 대한 질문에 논리적으로 답변하는 부분에서 긴장하거나 구체적인 답변이 부족했던 점이 있었습니다.','2026-06-15 16:29:30.249878','2026-06-15 15:38:30.230874',2,30,'PERFECTIONIST','COMPLETED','[\"발표 주제에 관련된 예상 질문 5개를 작성합니다.\",\"각 질문에 대해 30초 이내로 논리적인 답변을 준비합니다.\",\"준비한 답변을 소리 내어 연습합니다.\",\"주변 친구나 가족에게 질문을 실제로 던져보고 답변을 시연해 봅니다.\"]','[\"답변할 때는 \'간단히 말하면\'으로 시작해 명확한 주제를 제시하세요.\",\"질문에 대한 답변 후에는 \'이해가 되셨나요?\' 같은 질문을 덧붙여서 상대방의 반응을 확인하세요.\",\"자신의 경험이나 사례를 곁들여 답변하면 더 설득력이 높아집니다.\"]','발표 질문 대응 연습','이 연습을 통해 다양한 질문에 대한 준비를 하여 발표 상황에서도 자신감을 가지고 응답할 수 있도록 도와줄 것입니다.',NULL,9,NULL,NULL,NULL,NULL,NULL),(19,'리허설에서 변명 없이 진심 어린 사과를 전달하는 연습을 하셨는데, 사과의 진정성이 다소 부족하게 느껴졌어요.','2026-06-15 16:07:02.032322','2026-06-15 15:46:30.176143',2,30,'RELATION_ANXIOUS','COMPLETED','[\"자신이 사과해야 할 상황을 3가지 정리하세요.\",\"각 상황에 대해 변명 없이 진심으로 사과하는 내용을 3문장으로 작성하세요.\",\"작성한 사과문을 소리 내어 연습하며 감정을 담아 읽어보세요.\"]','[\"사과할 때, 상대방의 감정을 먼저 이해하고 공감하는 내용을 포함하세요.\",\"진정한 사과는 \'내가 잘못했다\'라는 단순한 문장으로 시작하는 것이 중요합니다.\",\"상대방의 반응에 따라 유연하게 대처하는 것도 연습해보세요.\"]','진심 어린 사과 연습','이번 연습을 통해 진정한 사과를 전달하는 방법을 더욱 강화할 수 있습니다. 상대방이 마음을 열게 하는 효과적인 사과를 연습해보세요.',NULL,9,NULL,NULL,NULL,NULL,NULL),(20,'상담에서 발표에 대한 불안과 질의응답에 대한 걱정을 말씀하셨어요. 준비 과정을 통해 긴장을 완화하고 자신감을 높이는 데 도움이 될 수 있습니다.','2026-06-15 16:52:13.773859','2026-06-15 16:51:53.830966',1,10,'RELATION_ANXIOUS','COMPLETED','[\"발표 주제와 관련하여 예상 질문 3개를 생각해보세요.\",\"각 질문에 대한 답변을 간단히 적어보세요.\",\"준비한 답변을 소리 내어 읽어보며 연습해보세요.\"]','[\"질문을 생각할 때, 발표 내용을 잘 이해하고 있는지 점검하는 기회로 삼으세요.\",\"답변은 간단명료하게 준비해두면 좋습니다.\",\"발표를 앞두고 긍정적인 자기 대화를 해보세요.\"]','예상 질문 준비하기 퀘스트','예상 질문을 생각하고 답변을 준비하는 것은 발표에 대한 불안을 줄이는 데 효과적입니다. 자신감을 높이는 데 큰 역할을 할 것입니다.',22,9,5,'proud',NULL,NULL,NULL),(21,'리허설에서 낯선 사람에게 먼저 말을 걸고 대화를 이어가셨는데, 대화의 흐름을 자연스럽게 유지하는 부분에서 조금 더 발전할 필요가 있어 보였어요.',NULL,'2026-06-15 16:53:43.173655',2,30,'RELATION_ANXIOUS','PENDING','[\"자신이 관심 있는 주제를 정하고, 그 주제에 대해 3가지 질문을 만드세요.\",\"각 질문에 대한 예상 답변을 생각하고, 그에 대한 추가 질문이나 반응을 2개씩 준비하세요.\",\"주변 친구나 가족과 연습해보고, 그 대화 내용을 녹음하여 나중에 들어보세요.\"]','[\"상대방의 답변에 귀 기울이고, 그에 대한 후속 질문을 자연스럽게 이어가세요.\",\"대화 중 감정이나 생각을 공유하면 더 깊은 연결을 만들 수 있습니다.\"]','자연스러운 대화 이어가기 연습','실제 상황에서도 자연스러운 대화를 이어갈 수 있도록 다양한 질문과 반응을 연습하는 것이 중요합니다.',NULL,9,NULL,NULL,NULL,NULL,5);
/*!40000 ALTER TABLE `user_quests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_stats`
--

DROP TABLE IF EXISTS `user_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_stats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `quests_completed` int NOT NULL DEFAULT '0',
  `total_quests` int NOT NULL DEFAULT '0',
  `current_streak` int NOT NULL DEFAULT '0',
  `confidence_score` int NOT NULL DEFAULT '0',
  `avoidance_index` int NOT NULL DEFAULT '0',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_stats_user_id` (`user_id`),
  CONSTRAINT `fk_user_stats_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_stats`
--

LOCK TABLES `user_stats` WRITE;
/*!40000 ALTER TABLE `user_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `onboarding_completed` bit(1) NOT NULL,
  `primary_recovery_type` enum('AVOIDANT','OVERFOCUSED','LETHARGIC','RELATION_ANXIOUS','PERFECTIONIST') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-05-09 14:20:14.541739','test@reroute.com','테스터','$2a$10$ccYpRTVUNFcIbvVkLd.ByeVzGTD0NCz6qw04zwzXyU19S9aUinoxK','USER','2026-05-09 14:20:14.541800',_binary '\0',NULL),(2,'2026-05-09 14:30:37.890692','dlfksmfqwr@gmail.com','세린','$2a$10$g.HRgRsLULPGCQYOE0qiy.5jgoi6frqz5DHpsJHOIqg2uQEXFGQbS','USER','2026-06-10 16:15:52.109377',_binary '','OVERFOCUSED'),(3,'2026-06-08 18:28:05.152520','codex-ui-1780910884@example.com','프론트검증','$2a$10$b./U2Era/C9MMTZnNdUXceGUDzCI2Nw6/62UT.UoZ78V3E5cUuqc.','USER','2026-06-08 18:28:05.152554',_binary '\0',NULL),(4,'2026-06-08 18:35:21.076123','codex-openai-check-1780911320@example.com','API검증','$2a$10$Yz9eBjRqse8W5CUvHDUAh.O2QE4/QxrCrtS/yrFPxW5LdEcXd6mbe','USER','2026-06-08 18:35:21.076151',_binary '\0',NULL),(5,'2026-06-08 18:39:23.095558','codex-fallback-1780911562@example.com','Fallback검증','$2a$10$QuAI8c0FP6HFQphjGTjEXu./UgzB7f12TUp9GVppioDAHXi3CyE7K','USER','2026-06-08 18:39:23.095581',_binary '\0',NULL),(6,'2026-06-08 19:16:32.553332','codex-community-test@example.com','커뮤니티검증','$2a$10$lL0kYOf7gVTXdx0820LYYuvZQp0jjePe.TytWVBPmknXdsw0EDKse','USER','2026-06-08 19:16:32.553359',_binary '\0',NULL),(7,'2026-06-08 19:36:11.162331','test@gmail.com','테스트유저','$2a$10$bD1cNXV3Rirj2rfyVsj/8uQCNJFZKU8XMy2dhNNNkq.oyA8yPyIPW','USER','2026-06-08 19:36:11.162331',_binary '\0',NULL),(9,'2026-06-10 23:50:57.998808','admin@reroute.com','관리자','$2b$10$IlES0ozTN6flRDuNJagfheahSGnYwDU9LFZsVbB/PvCsQajc7hgke','ADMIN','2026-06-15 16:49:41.809761',_binary '','PERFECTIONIST');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-15 17:53:04
