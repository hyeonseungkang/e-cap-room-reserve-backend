# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev      # Start with hot reload (development)
npm run build          # Compile TypeScript to dist/
npm run start:prod     # Run compiled production build
npm run lint           # ESLint with auto-fix
npm run format         # Prettier format
npm test               # Run Jest unit tests
npm run test:watch     # Tests in watch mode
npm run test:cov       # Tests with coverage
npm run test:e2e       # End-to-end tests
```

Single test file:
```bash
npx jest src/user/user.service.spec.ts
```

---

## 1. Project Overview & Tech Stack

사내 회의실 예약 관리 시스템. 관리자(Admin)가 회의실을 등록하고, 일반 사용자(User)가 예약(Reservation)을 생성하는 구조.

| 레이어 | 기술 |
|---|---|
| Framework | NestJS 11 (Express adapter) |
| ORM | TypeORM 0.3 |
| Database | SQLite (`better-sqlite3`, WAL mode) |
| Validation | 없음 — `ValidationPipe` 미적용, class-validator 미사용 |
| API Docs | Swagger UI (`@nestjs/swagger`) |
| Template | Handlebars (`.hbs`) |
| Auth | **없음** — 인증/인가 미구현 (JWT, Passport, Session 전혀 없음) |

---

## 2. Authentication & Authorization

**현재 인증 없음.** 모든 엔드포인트가 공개(public)이며 Guard, Decorator, JWT, Session이 일절 적용되어 있지 않다.

- `Authorization` 헤더 불필요
- 프론트엔드에서 인증 토큰을 첨부할 필요 없음
- 향후 인증 추가 시 이 섹션을 업데이트할 것

---

## 3. API Standards

### Base URL

```
http://localhost:3000
```

글로벌 prefix 없음 (`/api`는 Swagger UI 경로이며, REST API 경로가 아님).

### 공통 응답 포맷

응답 인터셉터나 래퍼 없음. **엔티티 객체가 JSON으로 그대로 반환**된다.

**성공 응답 — 단일 객체 (POST / PATCH / GET :id)**
```json
HTTP 200 OK
{
  "user_id": 1,
  "name": "홍길동",
  ...
}
```

**성공 응답 — 배열 (GET 목록)**
```json
HTTP 200 OK
[
  { "user_id": 1, ... },
  { "user_id": 2, ... }
]
```

**성공 응답 — 삭제 (DELETE)**
```
HTTP 200 OK
(body 없음)
```

**에러 응답 — NestJS 기본 형식**
```json
HTTP 404 Not Found
{
  "statusCode": 404,
  "message": "User #99 not found",
  "error": "Not Found"
}
```

```json
HTTP 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

### 에러 코드 처리 가이드

| HTTP 상태 | 원인 | 프론트엔드 처리 |
|---|---|---|
| `400` | URL 파라미터가 숫자가 아님 (e.g. `/user/abc`) | "잘못된 요청" 표시 |
| `404` | 해당 ID의 리소스 없음 | "존재하지 않는 데이터" 표시, 목록으로 리다이렉트 |
| `500` | DB CHECK 제약 위반 (예: `end_time <= start_time`) | "예약 시간을 확인해주세요" 표시 |

> `Reservation` 생성 시 `end_time > start_time` 제약이 DB 레벨에서 걸려 있다. 위반 시 TypeORM이 500을 반환하므로 **클라이언트에서 반드시 사전 검증**해야 한다.

### 페이지네이션

**미구현.** 모든 목록 API는 전체 레코드를 반환한다. `limit`, `offset`, `page` 파라미터 없음.

---

## 4. Core Domains & DTOs

### 4-1. User (사용자)

**엔티티 모델 (`users` 테이블)**
```typescript
{
  user_id: number          // PK, auto increment
  name: string             // max 50자
  email: string            // max 100자, unique
  department: string | null // max 100자
  phone: string | null     // max 20자
  role: string             // max 20자, default: "USER"
  created_at: Date         // auto
  reservations: Reservation[] // relations 로드 시 포함
}
```

**POST /user** — 사용자 생성
```typescript
// Request Body
{
  name: string        // 필수
  email: string       // 필수
  department?: string
  phone?: string
  role?: string       // 기본값 "USER"
}
// Response: User 객체 (reservations 미포함)
```

**GET /user** — 전체 사용자 목록
```
// Response: User[] (reservations 배열 포함, 단 각 reservation 내부에 user/room 미포함)
```

**GET /user/:id** — 단일 사용자 조회
```
// Response: User 객체 (reservations 배열 포함)
```

**PATCH /user/:id** — 사용자 수정
```typescript
// Request Body (모든 필드 선택)
{
  name?: string
  email?: string
  department?: string
  phone?: string
  role?: string
}
// Response: 수정된 User 객체
```

**DELETE /user/:id**
```
// Response: 200 OK, empty body
```

---

### 4-2. Reservation (예약)

**엔티티 모델 (`reservations` 테이블)**
```typescript
{
  reservation_id: number       // PK, auto increment
  start_time: Date             // datetime
  end_time: Date               // datetime, DB CHECK: end_time > start_time
  purpose: string | null       // max 255자
  reservation_status: string   // max 20자, default: "RESERVED"
  created_at: Date             // auto
  user: User                   // relations 로드 시 포함
  room: MeetingRoom            // relations 로드 시 포함
}
```

**POST /user/:userId/reservations** — 예약 생성
```typescript
// Request Body
{
  start_time: string  // ISO 8601 형식 권장 (e.g. "2025-01-15T09:00:00.000Z")
  end_time: string    // ISO 8601, 반드시 start_time 이후
  room_id: number     // 필수, 존재하는 MeetingRoom의 room_id
  purpose?: string
}
// Response: Reservation 객체 (user/room 미포함 — 단순 FK 참조만 저장됨)
```

**GET /user/:userId/reservations** — 특정 사용자의 예약 목록
```
// Response: Reservation[] (user, room 객체 포함)
```

**GET /user/reservations/:reservationId** — 단일 예약 조회
```
// Response: Reservation 객체 (user, room 객체 포함)
```

**PATCH /user/reservations/:reservationId** — 예약 수정
```typescript
// Request Body (모든 필드 선택)
{
  start_time?: string
  end_time?: string
  purpose?: string
  reservation_status?: string  // e.g. "RESERVED" | "CANCELLED" | "COMPLETED"
}
// Response: 수정된 Reservation 객체
```

**DELETE /user/reservations/:reservationId**
```
// Response: 200 OK, empty body
```

> **라우트 순서 주의**: `GET /user/reservations/:id`는 `GET /user/:id`보다 먼저 등록되어 있다. NestJS가 정적 세그먼트(`reservations`)를 동적 파라미터(`:id`)보다 우선 매칭하므로 정상 동작한다.

---

### 4-3. MeetingRoom (회의실)

**엔티티 모델 (`meeting_rooms` 테이블)**
```typescript
{
  room_id: number          // PK, auto increment
  room_name: string        // max 100자
  location: string         // max 100자
  capacity: number         // 수용 인원
  room_status: string      // max 20자, default: "AVAILABLE"
  admin: Admin | null      // relations 로드 시 포함 (onDelete: SET NULL)
  equipment: RoomEquipment[] // relations 로드 시 포함
  reservations: Reservation[] // findOne에서만 포함, findAll에서는 미포함
}
```

**POST /meeting-room** — 회의실 생성
```typescript
// Request Body
{
  room_name: string    // 필수
  location: string     // 필수
  capacity: number     // 필수
  room_status?: string // 기본값 "AVAILABLE"
  admin_id?: number    // 담당 관리자 ID
}
// Response: MeetingRoom 객체 (admin/equipment 미포함)
```

**GET /meeting-room** — 전체 회의실 목록
```
// Response: MeetingRoom[] (admin, equipment 포함 / reservations 미포함)
```

**GET /meeting-room/:id** — 단일 회의실 조회
```
// Response: MeetingRoom 객체 (admin, equipment, reservations 모두 포함)
```

**PATCH /meeting-room/:id** — 회의실 수정
```typescript
// Request Body
{
  room_name?: string
  location?: string
  capacity?: number
  room_status?: string
  admin_id?: number    // null 전달 시 관리자 해제
}
// Response: 수정된 MeetingRoom 객체
```

**DELETE /meeting-room/:id**
```
// Response: 200 OK, empty body
```

---

### 4-4. RoomEquipment (회의실 장비)

**엔티티 모델 (`room_equipment` 테이블)**
```typescript
{
  equipment_id: number   // PK, auto increment
  equipment_name: string // max 100자
  quantity: number       // default: 1
  room: MeetingRoom      // 부모 회의실
}
```

**POST /meeting-room/:id/equipment** — 장비 추가
```typescript
// Request Body
{
  equipment_name: string  // 필수
  quantity?: number       // 기본값 1
}
// Response: RoomEquipment 객체 (room 미포함)
```

**GET /meeting-room/:id/equipment** — 회의실 장비 목록
```
// Response: RoomEquipment[] (room 미포함)
```

**PATCH /meeting-room/:id/equipment/:equipmentId** — 장비 수정
```typescript
// Request Body
{
  equipment_name?: string
  quantity?: number
}
// Response: 수정된 RoomEquipment 객체
```

**DELETE /meeting-room/:id/equipment/:equipmentId**
```
// Response: 200 OK, empty body
```

---

### 4-5. Admin (관리자)

**엔티티 모델 (`admins` 테이블)**
```typescript
{
  admin_id: number         // PK, auto increment
  name: string             // max 50자
  email: string            // max 100자, unique
  department: string | null // max 100자
  created_at: Date         // auto
  rooms: MeetingRoom[]     // relations 로드 시 포함
}
```

**POST /admin** — 관리자 생성
```typescript
// Request Body
{
  name: string        // 필수
  email: string       // 필수
  department?: string
}
// Response: Admin 객체 (rooms 미포함)
```

**GET /admin** — 전체 관리자 목록
```
// Response: Admin[] (rooms 배열 포함)
```

**GET /admin/:id** — 단일 관리자 조회
```
// Response: Admin 객체 (rooms 배열 포함)
```

**PATCH /admin/:id** — 관리자 수정
```typescript
// Request Body (모든 필드 선택)
{
  name?: string
  email?: string
  department?: string
}
// Response: 수정된 Admin 객체
```

**DELETE /admin/:id**
```
// Response: 200 OK, empty body
```

---

## 5. Frontend Integration Guide

### API 클라이언트 설정

```typescript
const BASE_URL = 'http://localhost:3000';

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 200 && res.headers.get('content-length') === '0') {
    return undefined as T; // DELETE 응답 (빈 body)
  }
  if (!res.ok) {
    const err = await res.json();
    throw new ApiError(err.statusCode, err.message);
  }
  return res.json();
}
```

### 날짜/시간 처리

- `start_time`, `end_time`은 ISO 8601 문자열로 전송 (`new Date().toISOString()`)
- 응답의 `created_at`은 SQLite datetime 문자열로 반환됨 — `new Date(value)` 로 파싱
- **클라이언트에서 반드시 `end_time > start_time` 검증 후 요청** (DB 제약 위반 시 500 반환)

### Relations 포함 여부 — 엔드포인트별 차이

| 엔드포인트 | 포함되는 중첩 데이터 |
|---|---|
| `GET /user` | `reservations[]` (단, reservation 내 user/room 없음) |
| `GET /user/:id` | `reservations[]` (단, reservation 내 user/room 없음) |
| `GET /user/:userId/reservations` | 각 reservation에 `user`, `room` 포함 |
| `GET /user/reservations/:id` | `user`, `room` 포함 |
| `POST /user/:userId/reservations` | user/room 미포함 (생성 직후 별도 조회 필요) |
| `GET /meeting-room` | `admin`, `equipment[]` 포함 / `reservations` 없음 |
| `GET /meeting-room/:id` | `admin`, `equipment[]`, `reservations[]` 모두 포함 |
| `GET /admin` | `rooms[]` 포함 |
| `GET /meeting-room/:id/equipment` | `room` 미포함 |

### 상태값 열거형 (enum 미정의, 문자열 사용)

```typescript
// User.role
type UserRole = 'USER' | string;  // 기본값: "USER"

// MeetingRoom.room_status
type RoomStatus = 'AVAILABLE' | string;  // 기본값: "AVAILABLE"

// Reservation.reservation_status
type ReservationStatus = 'RESERVED' | 'CANCELLED' | 'COMPLETED' | string;  // 기본값: "RESERVED"
```

> 코드베이스에 enum이 정의되어 있지 않고 DB 레벨 제약도 없다. 위 값은 관례적인 값이므로, 팀 내 규칙으로 고정하거나 백엔드에 enum 추가를 요청할 것.

### 도메인 모델 (TypeScript 타입 정의)

```typescript
interface Admin {
  admin_id: number;
  name: string;
  email: string;
  department: string | null;
  created_at: string;
  rooms?: MeetingRoom[];
}

interface MeetingRoom {
  room_id: number;
  room_name: string;
  location: string;
  capacity: number;
  room_status: string;          // 기본: "AVAILABLE"
  admin?: Admin | null;
  equipment?: RoomEquipment[];
  reservations?: Reservation[];
}

interface RoomEquipment {
  equipment_id: number;
  equipment_name: string;
  quantity: number;
  room?: MeetingRoom;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  department: string | null;
  phone: string | null;
  role: string;                 // 기본: "USER"
  created_at: string;
  reservations?: Reservation[];
}

interface Reservation {
  reservation_id: number;
  start_time: string;
  end_time: string;
  purpose: string | null;
  reservation_status: string;   // 기본: "RESERVED"
  created_at: string;
  user?: User;
  room?: MeetingRoom;
}
```

### 주의사항 요약

1. **인증 없음** — 현재 모든 API 무인증 접근 가능.
2. **페이지네이션 없음** — 목록 API는 전체 반환, 대량 데이터 시 성능 이슈 가능.
3. **유효성 검사 없음** — 서버에 ValidationPipe 미적용. 필수 필드 누락 시 TypeORM이 DB 에러 발생 → 500 반환. 클라이언트에서 모든 유효성 검사 처리 필요.
4. **예약 생성 직후 중첩 데이터 없음** — `POST /user/:id/reservations` 응답에 `room` 객체 없음. 생성 후 `GET /user/reservations/:id` 로 재조회 필요.
5. **Swagger UI** — `http://localhost:3000/api` 에서 실시간 API 스펙 확인 가능.

---

## Architecture

NestJS REST API. 세 개의 도메인 모듈 + 루트 앱 모듈.

**Module 의존 관계:**
- `AdminModule` → imports `MeetingRoomModule` (MeetingRoomService 사용)
- `MeetingRoomModule` → exports `MeetingRoomService`
- `UserModule` → 독립

**Database:** SQLite via TypeORM (`data/db/db.sqlite3`), WAL mode, `synchronize: true` (앱 시작 시 스키마 자동 반영).

**Entity 관계:**
- `Admin` →(1:N)→ `MeetingRoom` (onDelete: SET NULL)
- `MeetingRoom` →(1:N)→ `RoomEquipment` (onDelete: CASCADE)
- `MeetingRoom` →(1:N)→ `Reservation` (onDelete: CASCADE)
- `User` →(1:N)→ `Reservation` (onDelete: CASCADE)
