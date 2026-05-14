# Re-Route

AI 기반 심리 회복 플랫폼 — 상담, 감정 분석, 마이크로 실천 과제, VR 리허설을 통해 현실 행동 회복을 돕는 서비스

## 폴더 구조

```
ReRoute/
├── backend/          # Spring Boot
├── frontend/         # React + Vite
├── database/         # init.sql
└── docker-compose.yml
```

## 실행 방법

### 1. MySQL 실행 (Docker)
```bash
docker compose up -d
```

### 2. Backend 실행
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 3. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

## 접속 주소

| 서비스 | 주소 |
|--------|------|
| Backend API | http://localhost:8080 |
| Frontend | http://localhost:5173 |
| MySQL | localhost:3306 |
| Health Check | http://localhost:8080/api/health |
