# Re-Route Architecture

현재 프론트엔드와 백엔드 코드 기준 구조입니다.

# Frontend

## 1. 프로젝트 디렉터리

```mermaid
flowchart TB
    ROOT["frontend/"]

    ROOT --> CONFIG["설정 파일"]
    CONFIG --> PACKAGE["package.json"]
    CONFIG --> VITE["vite.config.js"]
    CONFIG --> HTML["index.html"]

    ROOT --> PUBLIC["public/"]
    PUBLIC --> FAVICON["favicon.svg"]

    ROOT --> SRC["src/"]
    SRC --> ENTRY["main.jsx"]
    SRC --> APP["App.jsx"]
    SRC --> API["api/"]
    SRC --> COMPONENTS["components/"]
    SRC --> CONTEXT["context/"]
    SRC --> HOOKS["hooks/"]
    SRC --> PAGES["pages/"]
    SRC --> ROUTES["routes/"]
    SRC --> DATA["data/"]
    SRC --> STYLES["styles/"]
    SRC --> UTILS["utils/"]

    API --> AXIOS["axiosInstance.js"]
    API --> AUTH_API["authApi.js"]
    API --> USER_API["userApi.js"]
    API --> COUNSELING_API["counselingApi.js"]
    API --> ACTION_API["actionItemApi.js"]
    API --> QUEST_API["questApi.js"]
    API --> COMMUNITY_API["communityApi.js"]
    API --> REHEARSAL_API["rehearsalApi.js"]
    API --> ADMIN_API["adminApi.js"]

    COMPONENTS --> COMMON["common/<br/>Button · Badge · Modal"]
    COMPONENTS --> LAYOUT["layout/<br/>Navbar · AppNavbar · Footer · AppLayout"]

    CONTEXT --> AUTH_CONTEXT["AuthContext.jsx"]

    HOOKS --> USE_AUTH["useAuth.js"]
    HOOKS --> USE_COUNSELING["useCounseling.js"]
    HOOKS --> USE_EMAIL["useEmailVerification.js"]
    HOOKS --> USE_MY_PAGE["useMyPage.js"]

    ROUTES --> PRIVATE_ROUTE["PrivateRoute.jsx"]
    ROUTES --> ADMIN_ROUTE["AdminRoute.jsx"]

    DATA --> MOCK_ISLAND["mockIsland.js"]
    DATA --> MOCK_COMMUNITY["mockCommunity.js"]
    DATA --> MOCK_USER["mockUser.js"]
    DATA --> MOCK_COUNSELING["mockCounseling.js"]
    DATA --> MOCK_QUESTS["mockQuests.js"]

    STYLES --> GLOBAL_CSS["global.css"]
    STYLES --> INDEX_CSS["index.css"]
    UTILS --> FORMAT["format.js"]

    PAGES --> PUBLIC_PAGES["공개 페이지<br/>Landing · Login · Register"]
    PAGES --> MEMBER_PAGES["회원 페이지<br/>Dashboard · Onboarding · Counseling<br/>AnalysisDetail · ActionItems · ActionItemDetail<br/>QuestDetail · QuestComplete · GoldenCards<br/>Rehearsal · Community · PostDetail · PostWrite · MyPage"]
    PAGES --> ADMIN_PAGE["관리자 페이지<br/>Admin"]
```

## 2. 애플리케이션 계층과 데이터 흐름

```mermaid
flowchart LR
    USER["사용자"]

    subgraph BROWSER["React 애플리케이션"]
        ENTRY["main.jsx"]
        APP["App.jsx<br/>BrowserRouter + AuthProvider"]

        subgraph ROUTING["라우팅 및 접근 제어"]
            ROUTER["React Router"]
            PRIVATE["PrivateRoute<br/>로그인 검사"]
            ADMIN["AdminRoute<br/>ADMIN 권한 검사"]
        end

        subgraph UI["UI 계층"]
            PAGES["pages/<br/>화면 및 페이지 상태"]
            LAYOUT["components/layout/<br/>공통 레이아웃"]
            COMMON["components/common/<br/>버튼 · 배지 · 모달"]
        end

        subgraph STATE["상태 및 도메인 로직"]
            AUTH_CONTEXT["AuthContext<br/>사용자 · 로그인 · 로그아웃"]
            HOOKS["Custom Hooks<br/>상담 · 이메일 인증 · 마이페이지"]
            STORAGE["localStorage<br/>Access Token · User"]
        end

        subgraph NETWORK["통신 계층"]
            DOMAIN_API["Domain API Modules"]
            AXIOS["axiosInstance<br/>토큰 주입 · 401 처리"]
        end
    end

    BACKEND["Backend REST API<br/>기본 경로: VITE_API_BASE_URL 또는 /api"]

    USER --> PAGES
    ENTRY --> APP
    APP --> ROUTER
    APP --> AUTH_CONTEXT
    ROUTER --> PRIVATE
    ROUTER --> ADMIN
    PRIVATE --> PAGES
    ADMIN --> PAGES

    PAGES --> LAYOUT
    PAGES --> COMMON
    PAGES --> HOOKS
    PAGES --> DOMAIN_API

    HOOKS --> AUTH_CONTEXT
    HOOKS --> DOMAIN_API
    AUTH_CONTEXT <--> STORAGE
    AUTH_CONTEXT --> DOMAIN_API

    DOMAIN_API --> AXIOS
    AXIOS --> BACKEND
    AXIOS <--> STORAGE
```

## 3. API 모듈 구성

```mermaid
flowchart TB
    PAGES["Pages / Custom Hooks"] --> AUTH["authApi<br/>인증 · 이메일 인증"]
    PAGES --> USER["userApi<br/>프로필 · 온보딩 · 통계"]
    PAGES --> COUNSELING["counselingApi<br/>상담 세션 · 메시지 · 분석"]
    PAGES --> ACTION["actionItemApi<br/>액션 아이템"]
    PAGES --> QUEST["questApi<br/>퀘스트 · 회고"]
    PAGES --> COMMUNITY["communityApi<br/>게시글 · 댓글 · 캠프파이어"]
    PAGES --> REHEARSAL["rehearsalApi<br/>리허설 시나리오"]
    PAGES --> ADMIN["adminApi<br/>회원 · 게시글 · 댓글 관리"]

    AUTH --> AXIOS["axiosInstance"]
    USER --> AXIOS
    COUNSELING --> AXIOS
    ACTION --> AXIOS
    QUEST --> AXIOS
    COMMUNITY --> AXIOS
    REHEARSAL --> AXIOS
    ADMIN --> AXIOS

    AXIOS --> TOKEN["Request Interceptor<br/>Bearer Access Token"]
    AXIOS --> UNAUTHORIZED["Response Interceptor<br/>401 → 토큰 삭제 → /login"]
    AXIOS --> SERVER["Backend REST API"]
```

## 4. 라우팅 구조

```mermaid
flowchart TB
    START["URL 진입"] --> AUTH_CHECK{"로그인 상태"}

    AUTH_CHECK -->|비로그인| PUBLIC["공개 라우트"]
    AUTH_CHECK -->|로그인| PRIVATE["PrivateRoute"]

    PUBLIC --> LANDING["/ · Landing"]
    PUBLIC --> LOGIN["/login · Login"]
    PUBLIC --> REGISTER["/register · Register"]

    PRIVATE --> DASHBOARD["/dashboard · Dashboard"]
    PRIVATE --> ONBOARDING["/onboarding · Onboarding"]
    PRIVATE --> COUNSELING["/counseling · Counseling"]
    PRIVATE --> COUNSELING_TYPE["/counseling/type · CounselingType"]
    PRIVATE --> ANALYSIS["/analysis/:sessionId · AnalysisDetail"]
    PRIVATE --> ACTION_ITEMS["/action-items · ActionItems"]
    PRIVATE --> ACTION_DETAIL["/action-items/:id · ActionItemDetail"]
    PRIVATE --> QUEST_DETAIL["/quests/:id · QuestDetail"]
    PRIVATE --> QUEST_COMPLETE["/quests/:id/complete · QuestComplete"]
    PRIVATE --> REHEARSAL["/rehearsal · Rehearsal"]
    PRIVATE --> COMMUNITY["/community · Community"]
    PRIVATE --> POST_DETAIL["/community/post/:id · CommunityPostDetail"]
    PRIVATE --> POST_EDIT["/community/post/:id/edit · CommunityPostWrite"]
    PRIVATE --> POST_WRITE["/community/write · CommunityPostWrite"]
    PRIVATE --> GOLDEN_CARDS["/golden-cards · GoldenCards"]
    PRIVATE --> MY_PAGE["/my · MyPage"]

    AUTH_CHECK -->|ADMIN 사용자| ADMIN_ROUTE["AdminRoute"]
    ADMIN_ROUTE --> ADMIN["/admin · Admin"]

    PRIVATE -. "인증 실패" .-> LOGIN
    ADMIN_ROUTE -. "권한 없음" .-> DASHBOARD
    START -. "알 수 없는 경로" .-> LANDING
```

## 5. 주요 사용자 흐름

```mermaid
flowchart LR
    LANDING["Landing"] --> REGISTER["회원가입"]
    LANDING --> LOGIN["로그인"]
    REGISTER --> DASHBOARD["Dashboard"]
    LOGIN --> DASHBOARD

    DASHBOARD --> COUNSELING["상담"]
    COUNSELING --> ANALYSIS["상담 분석"]
    ANALYSIS --> ACTION_ITEMS["액션 아이템"]
    ACTION_ITEMS --> ACTION_DETAIL["액션 아이템 상세"]
    ACTION_DETAIL --> QUEST["퀘스트"]
    QUEST --> COMPLETE["퀘스트 완료 및 회고"]
    COMPLETE --> GOLDEN["골든 카드"]

    DASHBOARD --> COMMUNITY["커뮤니티"]
    COMMUNITY --> POST["게시글 상세"]
    COMMUNITY --> WRITE["게시글 작성"]
    POST --> EDIT["게시글 수정"]

    DASHBOARD --> REHEARSAL["리허설"]
    DASHBOARD --> MY_PAGE["마이페이지"]
    MY_PAGE --> ONBOARDING["온보딩 재검사"]
```

## 6. 현재 구현 상태 참고

```mermaid
flowchart LR
    REAL_API["실제 REST API 사용"] --> AUTH["인증"]
    REAL_API --> PROFILE["사용자/프로필"]
    REAL_API --> COUNSELING["상담/분석"]
    REAL_API --> ACTION["액션 아이템"]
    REAL_API --> QUEST["퀘스트"]
    REAL_API --> COMMUNITY["커뮤니티"]
    REAL_API --> ADMIN["관리자"]

    MOCK["일부 Mock 데이터 참조"] --> REHEARSAL["Rehearsal<br/>mockIsland"]
    MOCK --> MY_PAGE["MyPage<br/>mockUser fallback"]
    MOCK --> LABELS["Community/Post 화면<br/>카테고리 색상 상수"]
```

# Backend

백엔드는 Java 21, Spring Boot 3.2.5, Spring Data JPA, Spring Security와 MySQL을 사용합니다.

## 7. 백엔드 프로젝트 구조

```mermaid
flowchart TB
    ROOT["backend/"]

    ROOT --> BUILD["Gradle 설정<br/>build.gradle · settings.gradle"]
    ROOT --> DB["db/schema.sql"]
    ROOT --> RESOURCES["src/main/resources/"]
    ROOT --> JAVA["src/main/java/com/reroute/"]

    RESOURCES --> APP_YML["application.yml<br/>서버 · JWT · LLM · Swagger"]
    RESOURCES --> LOCAL_YML["application-local.yml<br/>MySQL · JPA"]

    JAVA --> ENTRY["RerouteApplication.java"]
    JAVA --> GLOBAL["global/"]
    JAVA --> DOMAIN["domain/"]

    GLOBAL --> CONFIG["config/<br/>Security · CORS · OpenAPI"]
    GLOBAL --> SECURITY["security/<br/>JwtAuthFilter · JwtUtil"]
    GLOBAL --> EXCEPTION["exception/<br/>전역 예외 처리"]
    GLOBAL --> RESPONSE["response/<br/>ApiResponse"]
    GLOBAL --> HEALTH["controller/<br/>HealthController"]

    DOMAIN --> AUTH["auth/<br/>인증 · 토큰 · 이메일 인증"]
    DOMAIN --> USER["user/<br/>회원 · 온보딩 · 통계"]
    DOMAIN --> COUNSELING["counseling/<br/>상담 · 메시지 · 분석"]
    DOMAIN --> ACTION["actionitem/<br/>액션 아이템"]
    DOMAIN --> QUEST["quest/<br/>퀘스트 · 회고"]
    DOMAIN --> COMMUNITY["community/<br/>게시글 · 댓글 · 캠프파이어 · 검열"]
    DOMAIN --> LLM["llm/<br/>Gemini · OpenAI 추상화"]
    DOMAIN --> ADMIN["admin/<br/>관리자 기능"]
    DOMAIN --> SCENARIO["scenario/<br/>리허설 시나리오"]
    DOMAIN --> REHEARSAL["rehearsal/<br/>리허설"]
    DOMAIN --> REPORT["report/<br/>신고"]
    DOMAIN --> NOTIFICATION["notification/<br/>알림"]
    DOMAIN --> COMMON["common/<br/>RecoveryType"]
```

## 8. 백엔드 계층 구조

```mermaid
flowchart LR
    CLIENT["Frontend / API Client"]

    subgraph SPRING["Spring Boot Backend"]
        SECURITY["SecurityFilterChain<br/>JwtAuthFilter"]
        CONTROLLER["Controller<br/>HTTP 요청 · 인증 사용자"]
        DTO["Request / Response DTO"]
        SERVICE["Service<br/>비즈니스 로직 · 트랜잭션"]
        REPOSITORY["Repository<br/>Spring Data JPA"]
        ENTITY["JPA Entity"]
        EXCEPTION["GlobalExceptionHandler"]
    end

    MYSQL[("MySQL<br/>reroute_db")]
    EXTERNAL["외부 LLM API<br/>Gemini 또는 OpenAI"]

    CLIENT --> SECURITY
    SECURITY --> CONTROLLER
    CONTROLLER <--> DTO
    CONTROLLER --> SERVICE
    SERVICE --> REPOSITORY
    REPOSITORY --> ENTITY
    ENTITY <--> MYSQL
    SERVICE --> EXTERNAL

    CONTROLLER -. "예외" .-> EXCEPTION
    SERVICE -. "예외" .-> EXCEPTION
    EXCEPTION --> CLIENT
```

## 9. 도메인 의존 관계

```mermaid
flowchart TB
    AUTH["Auth<br/>로그인 · JWT · 이메일 인증"]
    USER["User<br/>프로필 · 온보딩 · 통계"]
    COUNSELING["Counseling<br/>세션 · 메시지 · 분석"]
    LLM["LlmClient<br/>GeminiClient / OpenAiClient"]
    ACTION["ActionItem<br/>회복 행동 추천"]
    QUEST["Quest<br/>맞춤 퀘스트 · 회고"]
    COMMUNITY["Community<br/>게시글 · 댓글 · 캠프파이어"]
    MODERATION["Community Moderation<br/>로컬 규칙 · LLM 문맥 검사 · 감사 로그"]
    ADMIN["Admin<br/>회원 및 커뮤니티 관리"]
    COMMON["RecoveryType<br/>공통 회복 유형"]

    AUTH --> USER
    AUTH --> JWT["JwtUtil"]

    COUNSELING --> USER
    COUNSELING --> LLM
    COUNSELING --> ACTION
    COUNSELING --> QUEST
    COUNSELING --> COMMON

    ACTION --> USER
    ACTION --> COUNSELING
    ACTION --> QUEST

    QUEST --> USER
    QUEST --> COUNSELING
    QUEST --> COMMON

    COMMUNITY --> USER
    COMMUNITY --> MODERATION
    MODERATION --> LLM

    ADMIN --> USER
    ADMIN --> COMMUNITY
```

## 10. 인증 요청 처리 흐름

```mermaid
sequenceDiagram
    participant F as Frontend
    participant SF as SecurityFilterChain
    participant JF as JwtAuthFilter
    participant JU as JwtUtil
    participant UR as UserRepository
    participant C as Controller

    F->>SF: Authorization: Bearer AccessToken
    SF->>JF: 요청 필터링
    JF->>JU: 토큰 유효성 및 userId 확인
    JU-->>JF: userId
    JF->>UR: 사용자 조회
    UR-->>JF: User + Role
    JF->>JF: SecurityContext에 인증 저장
    JF->>C: 인증된 요청 전달
    C-->>F: ApiResponse
```

공개 API는 회원가입, 로그인, 토큰 갱신, 이메일 인증, 헬스 체크와 Swagger입니다. `/api/admin/**`는 `ADMIN` 역할이 필요하며, 나머지 API는 인증된 사용자만 접근할 수 있습니다.

## 11. 상담 분석 및 추천 생성 흐름

```mermaid
sequenceDiagram
    participant F as Frontend
    participant C as CounselingController
    participant S as CounselingService
    participant DB as JPA Repositories
    participant L as LlmClient
    participant AI as Gemini / OpenAI

    F->>C: 상담 메시지 전송
    C->>S: sendMessage(userId, request)
    S->>DB: 사용자 메시지 저장
    S->>L: 최근 대화 기반 답변 요청
    L->>AI: LLM API 호출
    AI-->>L: 상담 답변 + 위험도
    L-->>S: LlmCounselingReply
    S->>DB: AI 메시지 저장
    S-->>F: 사용자/AI 메시지 응답

    F->>C: 상담 완료 요청
    C->>S: completeSession(userId, sessionId)
    S->>L: 회복 유형 및 상담 분석 요청
    L->>AI: 대화 분석
    AI-->>S: 분석 결과
    S->>DB: CounselingAnalysis 저장
    S->>DB: 회복 유형별 ActionItem 추천 저장
    S->>L: 맞춤 Quest 생성 요청
    L->>AI: 퀘스트 생성
    AI-->>S: 퀘스트 결과
    S->>DB: UserQuest 저장
    S-->>F: 분석 + 액션 아이템 + 퀘스트
```

## 12. 주요 엔티티 관계

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : owns
    USER ||--o{ COUNSELING_SESSION : starts
    USER ||--o{ USER_ACTION_ITEM : receives
    USER ||--o{ USER_QUEST : receives
    USER ||--o{ EMOTION_LOG : records

    COUNSELING_SESSION ||--o{ COUNSELING_MESSAGE : contains
    COUNSELING_SESSION ||--o| COUNSELING_ANALYSIS : produces
    COUNSELING_SESSION ||--o{ USER_ACTION_ITEM : recommends
    COUNSELING_SESSION ||--o| USER_QUEST : generates

    ACTION_ITEM ||--o{ USER_ACTION_ITEM : assigned_as

    USER ||--o{ COMMUNITY_POST : writes
    COMMUNITY_CATEGORY ||--o{ COMMUNITY_POST : classifies
    COMMUNITY_POST ||--o{ COMMUNITY_COMMENT : contains
    USER ||--o{ COMMUNITY_COMMENT : writes
    COMMUNITY_POST ||--o{ COMMUNITY_POST_LIKE : receives
    USER ||--o{ COMMUNITY_POST_LIKE : creates
    COMMUNITY_COMMENT ||--o{ COMMUNITY_COMMENT_LIKE : receives
    USER ||--o{ COMMUNITY_COMMENT_LIKE : creates

    USER ||--o{ CAMPFIRE : owns
    CAMPFIRE ||--o{ CAMPFIRE_MEMBER : includes
    USER ||--o{ CAMPFIRE_MEMBER : joins
    USER ||--o{ COMMUNITY_MODERATION_LOG : creates
```

## 13. 백엔드 API 영역

```mermaid
flowchart TB
    API["/api"]

    API --> AUTH["/auth<br/>로그인 · 회원가입 · 토큰 · 이메일 인증"]
    API --> USERS["/users<br/>내 정보 · 통계 · 온보딩"]
    API --> COUNSELING["/counseling<br/>세션 · 메시지 · 분석"]
    API --> ACTIONS["/action-items<br/>내 액션 아이템 · 완료"]
    API --> QUESTS["/quests<br/>조회 · 완료 · 건너뛰기 · 회고"]
    API --> COMMUNITY["/community<br/>게시글 · 댓글 · 좋아요 · 캠프파이어"]
    API --> ADMIN["/admin<br/>회원 · 게시글 · 댓글 관리"]
    API --> SCENARIOS["/scenarios<br/>리허설 시나리오"]
    API --> REHEARSALS["/rehearsals<br/>리허설"]
    API --> REPORTS["/reports<br/>신고"]
    API --> NOTIFICATIONS["/notifications<br/>알림"]
    API --> HEALTH["/health<br/>상태 확인"]
```

## 14. 현재 백엔드 구현 상태

```mermaid
flowchart LR
    IMPLEMENTED["구체 구현"] --> AUTH["Auth"]
    IMPLEMENTED --> USER["User"]
    IMPLEMENTED --> COUNSELING["Counseling"]
    IMPLEMENTED --> ACTION["ActionItem"]
    IMPLEMENTED --> QUEST["Quest"]
    IMPLEMENTED --> COMMUNITY["Community + Moderation"]
    IMPLEMENTED --> ADMIN["Admin"]
    IMPLEMENTED --> LLM["Gemini / OpenAI"]

    SKELETON["현재 골격 중심"] --> SCENARIO["Scenario"]
    SKELETON --> REHEARSAL["Rehearsal"]
    SKELETON --> REPORT["Report"]
    SKELETON --> NOTIFICATION["Notification"]
```

# Database

DBMS는 MySQL이며 기본 데이터베이스 이름은 `reroute_db`입니다. 문자셋은 `utf8mb4`, 정렬 규칙은 `utf8mb4_unicode_ci`를 사용합니다.

현재 `application-local.yml`의 `spring.jpa.hibernate.ddl-auto`가 `update`이므로 실제 로컬 DB는 `db/schema.sql`의 테이블에 JPA 엔티티 변경사항이 추가된 형태일 수 있습니다.

## 15. DB 도메인 구성

```mermaid
flowchart TB
    DB[("reroute_db")]

    DB --> USER["회원·인증<br/>users · user_stats<br/>email_verifications · refresh_tokens"]
    DB --> COUNSELING["상담·분석<br/>counseling_sessions · counseling_messages<br/>counseling_analyses · counseling_analysis_emotions<br/>emotion_logs"]
    DB --> ACTION["행동·성과<br/>action_items · action_item_steps · action_item_tips<br/>user_action_items · action_item_reflections<br/>golden_cards · user_quests"]
    DB --> REHEARSAL["리허설<br/>scenarios · rehearsals"]
    DB --> COMMUNITY["커뮤니티<br/>community_categories · community_posts<br/>community_post_tags · community_comments<br/>좋아요 · campfires · 참여자"]
    DB --> OPERATION["운영<br/>notifications · reports<br/>community_moderation_logs"]
```

`user_quests`와 `community_moderation_logs`는 현재 JPA 엔티티에는 존재하지만 `db/schema.sql`에는 정의되어 있지 않습니다. `ddl-auto: update` 실행 시 Hibernate가 생성할 수 있습니다.

## 16. 회원·상담 DB 구조

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR email UK
        VARCHAR password
        VARCHAR nickname
        VARCHAR role
        VARCHAR recovery_type
        BOOLEAN onboarding_completed
        DATETIME created_at
        DATETIME updated_at
    }

    USER_STATS {
        BIGINT id PK
        BIGINT user_id FK,UK
        INT quests_completed
        INT total_quests
        INT current_streak
        INT confidence_score
        INT avoidance_index
    }

    EMAIL_VERIFICATIONS {
        BIGINT id PK
        VARCHAR email
        VARCHAR code
        VARCHAR purpose
        DATETIME expires_at
        BOOLEAN verified
        DATETIME verified_at
    }

    REFRESH_TOKENS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR token_hash UK
        DATETIME expires_at
        BOOLEAN revoked
    }

    COUNSELING_SESSIONS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR title
        VARCHAR status
        DATETIME created_at
        DATETIME updated_at
    }

    COUNSELING_MESSAGES {
        BIGINT id PK
        BIGINT session_id FK
        VARCHAR role
        TEXT content
        DATETIME created_at
    }

    COUNSELING_ANALYSES {
        BIGINT id PK
        BIGINT session_id FK,UK
        TEXT summary
        VARCHAR recovery_type
        DOUBLE confidence
        TEXT reason
        TEXT emotion_keywords
    }

    COUNSELING_ANALYSIS_EMOTIONS {
        BIGINT id PK
        BIGINT analysis_id FK
        VARCHAR emotion
        INT score
    }

    EMOTION_LOGS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR emotion
        INT intensity
        TEXT note
        DATETIME created_at
    }

    USERS ||--o| USER_STATS : has
    USERS ||--o{ REFRESH_TOKENS : owns
    USERS ||--o{ COUNSELING_SESSIONS : starts
    USERS ||--o{ EMOTION_LOGS : records
    COUNSELING_SESSIONS ||--o{ COUNSELING_MESSAGES : contains
    COUNSELING_SESSIONS ||--o| COUNSELING_ANALYSES : produces
    COUNSELING_ANALYSES ||--o{ COUNSELING_ANALYSIS_EMOTIONS : details
```

`email_verifications`는 가입 전 이메일도 저장해야 하므로 `users`와 외래 키로 연결하지 않고 이메일 문자열을 기준으로 관리합니다.

## 17. 액션 아이템·퀘스트·리허설 DB 구조

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR email UK
    }

    COUNSELING_SESSIONS {
        BIGINT id PK
        BIGINT user_id FK
    }

    ACTION_ITEMS {
        BIGINT id PK
        VARCHAR title
        TEXT description
        VARCHAR category
        VARCHAR format
        INT estimated_minutes
        BOOLEAN active
    }

    ACTION_ITEM_STEPS {
        BIGINT id PK
        BIGINT action_item_id FK
        INT step_order
        TEXT content
    }

    ACTION_ITEM_TIPS {
        BIGINT id PK
        BIGINT action_item_id FK
        INT tip_order
        TEXT content
    }

    USER_ACTION_ITEMS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT action_item_id FK
        BIGINT source_session_id FK
        VARCHAR status
        DATETIME completed_at
    }

    ACTION_ITEM_REFLECTIONS {
        BIGINT id PK
        BIGINT user_action_item_id FK,UK
        VARCHAR feeling
        INT difficulty_score
        TEXT reflection
        TEXT next_step
    }

    GOLDEN_CARDS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT user_action_item_id FK
        VARCHAR title
        VARCHAR detail
        DATETIME earned_at
    }

    USER_QUESTS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT counseling_session_id FK
        VARCHAR recovery_type
        VARCHAR title
        TEXT steps
        TEXT tips
        VARCHAR status
        TEXT reflection
    }

    SCENARIOS {
        BIGINT id PK
        VARCHAR name
        INT difficulty_level
        VARCHAR recovery_type
        BOOLEAN active
    }

    REHEARSALS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT scenario_id FK
        VARCHAR status
        TEXT feedback
        INT score
    }

    USERS ||--o{ USER_ACTION_ITEMS : receives
    ACTION_ITEMS ||--o{ USER_ACTION_ITEMS : assigned
    COUNSELING_SESSIONS ||--o{ USER_ACTION_ITEMS : recommends
    ACTION_ITEMS ||--o{ ACTION_ITEM_STEPS : has
    ACTION_ITEMS ||--o{ ACTION_ITEM_TIPS : has
    USER_ACTION_ITEMS ||--o| ACTION_ITEM_REFLECTIONS : records
    USER_ACTION_ITEMS ||--o{ GOLDEN_CARDS : earns
    USERS ||--o{ GOLDEN_CARDS : owns

    USERS ||--o{ USER_QUESTS : receives
    COUNSELING_SESSIONS ||--o| USER_QUESTS : generates

    USERS ||--o{ REHEARSALS : performs
    SCENARIOS ||--o{ REHEARSALS : uses
```

`USER_QUESTS`는 현재 `UserQuest` JPA 엔티티 기준입니다. `ACTION_ITEM_STEPS`, `ACTION_ITEM_TIPS`, `ACTION_ITEM_REFLECTIONS`, `GOLDEN_CARDS`, `SCENARIOS`, `REHEARSALS`는 `schema.sql`에 정의되어 있으나 대응하는 완성된 JPA 엔티티 또는 기능은 아직 없습니다.

## 18. 커뮤니티 DB 구조

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR email UK
    }

    COMMUNITY_CATEGORIES {
        BIGINT id PK
        VARCHAR name UK
        INT display_order
    }

    COMMUNITY_POSTS {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT category_id FK
        VARCHAR anonymous_name
        VARCHAR title
        TEXT content
        INT view_count
        VARCHAR status
    }

    COMMUNITY_POST_TAGS {
        BIGINT id PK
        BIGINT post_id FK
        VARCHAR tag
    }

    COMMUNITY_COMMENTS {
        BIGINT id PK
        BIGINT post_id FK
        BIGINT user_id FK
        VARCHAR anonymous_name
        TEXT content
        VARCHAR status
    }

    COMMUNITY_LIKES {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR target_type
        BIGINT target_id
    }

    COMMUNITY_POST_LIKES {
        BIGINT id PK
        BIGINT post_id FK
        BIGINT user_id FK
    }

    COMMUNITY_COMMENT_LIKES {
        BIGINT id PK
        BIGINT comment_id FK
        BIGINT user_id FK
    }

    CAMPFIRES {
        BIGINT id PK
        BIGINT owner_id FK
        VARCHAR name
        TEXT description
        VARCHAR keyword
        BOOLEAN open
    }

    CAMPFIRE_MEMBERS {
        BIGINT id PK
        BIGINT campfire_id FK
        BIGINT user_id FK
        DATETIME joined_at
    }

    COMMUNITY_MODERATION_LOGS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR target_type
        VARCHAR action
        TEXT submitted_content
        VARCHAR reason
        BOOLEAN self_harm_risk
    }

    USERS ||--o{ COMMUNITY_POSTS : writes
    COMMUNITY_CATEGORIES ||--o{ COMMUNITY_POSTS : classifies
    COMMUNITY_POSTS ||--o{ COMMUNITY_POST_TAGS : tagged
    COMMUNITY_POSTS ||--o{ COMMUNITY_COMMENTS : contains
    USERS ||--o{ COMMUNITY_COMMENTS : writes

    COMMUNITY_POSTS ||--o{ COMMUNITY_POST_LIKES : receives
    USERS ||--o{ COMMUNITY_POST_LIKES : creates
    COMMUNITY_COMMENTS ||--o{ COMMUNITY_COMMENT_LIKES : receives
    USERS ||--o{ COMMUNITY_COMMENT_LIKES : creates

    USERS ||--o{ CAMPFIRES : owns
    CAMPFIRES ||--o{ CAMPFIRE_MEMBERS : includes
    USERS ||--o{ CAMPFIRE_MEMBERS : joins
    USERS ||--o{ COMMUNITY_MODERATION_LOGS : triggers
```

`schema.sql`은 좋아요를 `community_likes` 단일 다형 테이블로 정의하지만, 현재 JPA 엔티티는 `community_post_likes`와 `community_comment_likes`로 분리합니다. 캠프파이어 참여 테이블도 `schema.sql`의 `campfire_participants`와 JPA의 `campfire_members`가 서로 다릅니다.

## 19. 알림·신고 DB 구조

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR email UK
    }

    NOTIFICATIONS {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR type
        VARCHAR title
        TEXT content
        DATETIME read_at
        DATETIME created_at
    }

    REPORTS {
        BIGINT id PK
        BIGINT reporter_id FK
        VARCHAR target_type
        BIGINT target_id
        VARCHAR reason
        TEXT detail
        VARCHAR status
        DATETIME resolved_at
    }

    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ REPORTS : submits
```

`reports.target_id`는 게시글이나 댓글 등 여러 종류의 대상을 가리키는 다형 참조이므로 특정 테이블에 대한 물리 외래 키는 없습니다.

## 20. 스키마와 JPA 엔티티 차이

| 영역 | `db/schema.sql` | 현재 JPA 엔티티 |
|---|---|---|
| 사용자 회복 유형 | `users.recovery_type` | `users.primary_recovery_type` |
| 사용자 퀘스트 | 테이블 정의 없음 | `user_quests` 엔티티 존재 |
| 사용자 액션 출처 | `source_session_id` | `counseling_session_id` |
| 게시글 작성자 | `user_id` | `user_id`와 `author_id`를 함께 매핑 |
| 게시글 카테고리/태그 | 정규화 테이블 사용 | 문자열 및 JSON 컬럼도 함께 사용 |
| 댓글 작성자 | `user_id` | `author_id` |
| 커뮤니티 좋아요 | `community_likes` 단일 테이블 | 게시글/댓글 좋아요 테이블 분리 |
| 캠프파이어 소유자 | 소유자 컬럼 없음 | `owner_id` 필수 |
| 캠프파이어 참여 | `campfire_participants` | `campfire_members` |
| 커뮤니티 검열 로그 | 테이블 정의 없음 | `community_moderation_logs` 엔티티 존재 |

현재 개발 환경에서는 Hibernate가 스키마를 자동 보정하지만, 운영 환경에서는 `schema.sql`과 엔티티 중 하나를 기준으로 확정하고 Flyway 또는 Liquibase 마이그레이션으로 관리하는 편이 안전합니다.
