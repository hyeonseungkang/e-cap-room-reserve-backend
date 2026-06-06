```{sql}
CREATE TABLE users (
                      user_id NUMBER PRIMARY KEY,
                      name VARCHAR2(50),
                      email VARCHAR2(100),
                      password VARCHAR2(100),
                      department VARCHAR2(100),
                      phone VARCHAR2(20),
                      role VARCHAR2(20),
                      is_active NUMBER(1),
                      created_at TIMESTAMP
);


CREATE TABLE admins (
                       admin_id NUMBER PRIMARY KEY,
                       name VARCHAR2(50),
                       email VARCHAR2(100),
                       password VARCHAR2(100),
                       department VARCHAR2(100),
                       is_active NUMBER(1),
                       created_at TIMESTAMP
);


CREATE TABLE meeting_rooms (
                              room_id NUMBER PRIMARY KEY,
                              room_name VARCHAR2(100),
                              location VARCHAR2(100),
                              capacity NUMBER,
                              room_status VARCHAR2(20),
                              admin_id NUMBER,
                              CONSTRAINT fk_meeting_rooms_admin
                                  FOREIGN KEY (admin_id)
                                      REFERENCES admins(admin_id)
);


CREATE TABLE reservations (
                             reservation_id NUMBER PRIMARY KEY,
                             user_id NUMBER,
                             room_id NUMBER,
                             start_time TIMESTAMP,
                             end_time TIMESTAMP,
                             participant_count NUMBER,
                             purpose VARCHAR2(255),
                             reservation_status VARCHAR2(20),
                             created_at TIMESTAMP,
                             CONSTRAINT fk_reservations_user
                                 FOREIGN KEY (user_id)
                                     REFERENCES users(user_id),
                             CONSTRAINT fk_reservations_room
                                 FOREIGN KEY (room_id)
                                     REFERENCES meeting_rooms(room_id)
);


CREATE TABLE room_equipment (
                               equipment_id NUMBER PRIMARY KEY,
                               room_id NUMBER,
                               equipment_name VARCHAR2(100),
                               quantity NUMBER,
                               CONSTRAINT fk_room_equipment_room
                                   FOREIGN KEY (room_id)
                                       REFERENCES meeting_rooms(room_id)
);


CREATE TABLE usage_logs (
                           usage_id NUMBER PRIMARY KEY,
                           reservation_id NUMBER UNIQUE,
                           check_in_time TIMESTAMP,
                           check_out_time TIMESTAMP,
                           usage_status VARCHAR2(20),
                           CONSTRAINT fk_usage_logs_reservation
                               FOREIGN KEY (reservation_id)
                                   REFERENCES reservations(reservation_id)
);


CREATE TABLE penalty_policies (
                                 penalty_policy_id NUMBER PRIMARY KEY,
                                 penalty_type VARCHAR2(50),
                                 penalty_reason VARCHAR2(255),
                                 restriction_days NUMBER,
                                 created_at TIMESTAMP
);


CREATE TABLE penalty_history (
                                penalty_history_id NUMBER PRIMARY KEY,
                                reservation_id NUMBER,
                                start_date TIMESTAMP,
                                end_date TIMESTAMP,
                                created_at TIMESTAMP,
                                CONSTRAINT fk_penalty_history_reservation
                                    FOREIGN KEY (reservation_id)
                                        REFERENCES reservations(reservation_id)
);


CREATE TABLE cancellation_logs (
                                  cancellation_id NUMBER PRIMARY KEY,
                                  reservation_id NUMBER,
                                  cancelled_at TIMESTAMP,
                                  cancel_reason VARCHAR2(255),
                                  is_late_cancel NUMBER(1),
                                  CONSTRAINT fk_cancellation_logs_reservation
                                      FOREIGN KEY (reservation_id)
                                          REFERENCES reservations(reservation_id)
);


CREATE TABLE questions (
                          question_id NUMBER PRIMARY KEY,
                          user_id NUMBER,
                          title VARCHAR2(200),
                          content CLOB,
                          question_status VARCHAR2(20),
                          created_at TIMESTAMP,
                          CONSTRAINT fk_questions_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(user_id)
);


CREATE TABLE answers (
                        answer_id NUMBER PRIMARY KEY,
                        admin_id NUMBER,
                        content CLOB,
                        created_at TIMESTAMP,
                        CONSTRAINT fk_answers_admin
                            FOREIGN KEY (admin_id)
                                REFERENCES admins(admin_id)
);


CREATE TABLE qna_mappings (
                             mapping_id NUMBER PRIMARY KEY,
                             question_id NUMBER UNIQUE,
                             answer_id NUMBER UNIQUE,
                             created_at TIMESTAMP,
                             CONSTRAINT fk_qna_mappings_question
                                 FOREIGN KEY (question_id)
         
                            REFERENCES questions(question_id),
                             CONSTRAINT fk_qna_mappings_answer
                                 FOREIGN KEY (answer_id)
                                     REFERENCES answers(answer_id)
);


CREATE TABLE room_maintenance_logs (
                                      maintenance_id NUMBER PRIMARY KEY,
                                      room_id NUMBER,
                                      admin_id NUMBER,
                                      maintenance_type VARCHAR2(50),
                                      maintenance_status VARCHAR2(20),
                                      CONSTRAINT fk_room_maintenance_logs_room
                                          FOREIGN KEY (room_id)
                                              REFERENCES meeting_rooms(room_id),
                                      CONSTRAINT fk_room_maintenance_logs_admin
                                          FOREIGN KEY (admin_id)
                                              REFERENCES admins(admin_id)
);
```

## IV. DB 생성 결과 캡처 {#iv.-db-생성-결과-캡처}

1조는 정보시스템 구현을 위해 Oracle Cloud Infrastructure에서 호스팅하는 Oracle Database 19c 버전을 사용하였다. 데이터베이스는 정보시스템 어플리케이션(이하 '백엔드’)가 접근할 수 있도록 자격증명 User ‘E\_CAP\_ROOM\_RESERVE’을 가진다. 개발자는 정보시스템 데이터베이스에 DB가 구현됨을 확인하기 위해 JetBrains 시리즈의 DataGrip 프로그램을 통해 접근하였다. 아래는 SQL문을 통해 User ‘E\_CAP\_ROOM\_RESERVE’가 생성한 테이블 및 테이블의 컬럼을 조회한 것이다.

**SQL문 1: 테이블 조회**

SQL문 1: SELECT *\** FROM all\_tables where OWNER \= 'E\_CAP\_ROOM\_RESERVE';

SQL문 1을 통해 User ‘E\_CAP\_ROOM\_RESERVE’가 생성한 테이블을 조회한다.

**SQL문 1의 캡처:**![][image3]

(후속)

![][image4]

**SQL문 2: 테이블 컬럼 조회**

SQL문 2: SELECT *\** FROM cols;

SQL문 2을 통해 User ‘E\_CAP\_ROOM\_RESERVE’가 생성한 테이블의 컬럼을 조회한다.

**SQL문 2의 캡처:**

(후속)

![][image5]![][image6]

## V. 생성된 DB의 각 테이블 구조 {#v.-생성된-db의-각-테이블-구조}

#### 1\. User & Admin (사용자 및 관리자 그룹) {#1.-user-&-admin-(사용자-및-관리자-그룹)}

##### 1-1. users (일반 사용자 테이블) {#1-1.-users-(일반-사용자-테이블)}

![][image7]

* 설명 및 용도: 사내 회의실을 조회하고 예약을 생성하는 주체인 일반 임직원 데이터를 관리합니다.  
* 컬럼 명세:  
  * user\_id (NUMBER, PK): 사용자의 고유 식별자 값입니다.  
  * name (VARCHAR2(50)): 사용자 실명입니다.  
  * email (VARCHAR2(100)): 로그인 및 알림용 이메일 주소입니다 (시스템 관례상 UNIQUE 관리).  
  * password (VARCHAR2(100)): 암호화되어 저장되는 계정 비밀번호 필드입니다.  
  * department (VARCHAR2(100)): 소속 부서명입니다.  
  * phone (VARCHAR2(20)): 비상 연락용 전화번호입니다.  
  * role (VARCHAR2(20)): 권한 레벨을 나타내며 기본값은 'USER'로 처리됩니다.  
  * is\_active (NUMBER(1)): 계정 활성화 여부를 나타내는 숫자형 플래그입니다 (1 또는 0).  
  * created\_at (TIMESTAMP): 계정 생성 일시입니다.  
* 참조 관계 및 Cascade:  
  * reservations (1:N): 한 사용자는 여러 개의 예약을 가질 수 있습니다. users 레코드가 탈퇴 등으로 삭제될 경우, 데이터 무결성을 위해 자식 테이블인 reservations 내역에 CASCADE 옵션을 적용하여 관련 예약을 일괄 삭제하는 구조를 취합니다.  
  * questions (1:N): 한 사용자는 다수의 QnA 질문을 올릴 수 있습니다. 사용자가 완전히 삭제될 때 작성한 질문들도 함께 지워지도록 구성하는 것이 일반적입니다 (CASCADE).

##### 1-2. admins (시스템 관리자 테이블) {#1-2.-admins-(시스템-관리자-테이블)}

![][image8]

* 설명 및 용도: 회의실 자산을 등록/유지보수하고, 사용자의 예약을 취소하거나 징계(패널티)를 가하며, QnA에 답변을 등록하는 시스템 관리자 계정 정보를 담고 있습니다.  
* 컬럼 명세:  
  * admin\_id (NUMBER, PK): 관리자의 고유 식별자 값입니다.  
  * name (VARCHAR2(50)): 관리자 이름입니다.  
  * email (VARCHAR2(100)): 관리자 이메일 주소입니다.  
  * password (VARCHAR2(100)): 암호화된 관리자 비밀번호 필드입니다.  
  * department (VARCHAR2(100)): 관리 센터 소속 부서명입니다.  
  * is\_active (NUMBER(1)): 관리자 권한 활성화 여부입니다 (1 또는 0).  
  * created\_at (TIMESTAMP): 관리자 계정 등록 일시입니다.  
* 참조 관계 및 Cascade:  
  * meeting\_rooms (1:N): 관리자가 특정 회의실의 전담 관리 책임자로 지정될 수 있습니다. 만약 관리자가 삭제될 경우, 회의실 공간 자체는 보존되어야 하므로 자식 필드의 admin\_id를 비워두는 SET NULL 옵션이 안전합니다.  
  * answers (1:N), room\_maintenance\_logs (1:N): 관리자가 작성한 답변 및 유지보수 로그에 매핑됩니다. 운영 이력 보존을 위해 기록을 남기려면 RESTRICT 혹은 SET NULL을 권장하나, 필요에 따라 관리자 이력 폐기 시 함께 정리하도록 아키텍처를 유연하게 적용할 수 있습니다.

#### 2\. MeetingRoom & Equipment (회의실 자산 그룹) {#2.-meetingroom-&-equipment-(회의실-자산-그룹)}

##### 2-1. meeting\_rooms (회의실 마스터 테이블) {#2-1.-meeting_rooms-(회의실-마스터-테이블)}

![][image9]

* 설명 및 용도: 사내에 존재하는 모든 예약 가능한 회의실 공간 물리 자산을 정의합니다.  
* 컬럼 명세:  
  * room\_id (NUMBER, PK): 회의실 고유 ID입니다.  
  * room\_name (VARCHAR2(100)): 회의실 이름(예: '제1회의실', '그린룸')입니다.  
  * location (VARCHAR2(100)): 회의실 위치(예: '본관 3층 302호')입니다.  
  * capacity (NUMBER): 최대 수용 가능 인원수입니다.  
  * room\_status (VARCHAR2(20)): 회의실 상태 정보입니다 (예: 'AVAILABLE', 'MAINTENANCE').  
  * admin\_id (NUMBER, FK): admins(admin\_id)를 참조하는 외래키로, 해당 회의실을 전담하는 관리자를 나타냅니다.  
* 참조 관계 및 Cascade:  
  * 부모 테이블인 admins가 지워질 때 회의실 자체가 사라지면 안 되므로, fk\_meeting\_rooms\_admin 외래키는 ON DELETE SET NULL 전략을 취합니다.  
  * 자식 테이블로는 비품(room\_equipment), 예약(reservations), 유지보수 로그(room\_maintenance\_logs)가 존재하며, 회의실이라는 공간이 철거(DELETE)되면 종속된 비품 및 예약 이력 전체가 무의미해지므로 이 자식 관계들에는 ON DELETE CASCADE가 강제됩니다.

##### 2-2. room\_equipment (회의실 비품 테이블) {#2-2.-room_equipment-(회의실-비품-테이블)}

![][image10]

* 설명 및 용도: 각 회의실 내부에 영구 배치되어 빌트인으로 제공되는 기자재 및 장비 목록(빔프로젝터, 마이크, 화이트보드 등)을 관리합니다.  
* 컬럼 명세:  
  * equipment\_id (NUMBER, PK): 비품 고유 식별자입니다.  
  * room\_id (NUMBER, FK): meeting\_rooms(room\_id)를 참조하는 외래키입니다. 이 비품이 배치된 회의실을 뜻합니다.  
  * equipment\_name (VARCHAR2(100)): 비품의 명칭입니다.  
  * quantity (NUMBER): 비품 수량입니다.  
* 참조 관계 및 Cascade:  
  * 부모 테이블인 회의실(meeting\_rooms)에 100% 종속되어 있습니다. 따라서 회의실 삭제 시 배치된 비품 데이터도 동시에 폐기되는 ON DELETE CASCADE 매핑을 설정합니다.

#### 3\. Reservation & Logs (예약 인스턴스 및 트랜잭션 도메인) {#3.-reservation-&-logs-(예약-인스턴스-및-트랜잭션-도메인)}

##### 3-1. reservations (회의실 예약 트랜잭션 테이블) {#3-1.-reservations-(회의실-예약-트랜잭션-테이블)}

![][image11]

* 설명 및 용도: 회의실 예약 관리를 위한 핵심 도메인 테이블입니다. 어떤 사용자가 어느 회의실을 언제부터 언제까지 사용하는지에 대한 트랜잭션을 기록합니다.  
* 컬럼 명세:  
  * reservation\_id (NUMBER, PK): 예약 트랜잭션의 고유 식별자입니다.  
  * user\_id (NUMBER, FK): users(user\_id)를 참조하며, 예약을 신청한 주체입니다.  
  * room\_id (NUMBER, FK): meeting\_rooms(room\_id)를 참조하며, 예약된 회의실입니다.  
  * start\_time (TIMESTAMP): 회의 시작 일시입니다.  
  * end\_time (TIMESTAMP): 회의 종료 일시입니다 (비즈니스 로직 및 DB 체크 제약상 end\_time \> start\_time 필수).  
  * participant\_count (NUMBER): 실제 참석 인원수입니다.  
  * purpose (VARCHAR2(255)): 회의 사용 목적 및 소제목입니다.  
  * reservation\_status (VARCHAR2(20)): 예약의 현재 상태를 관리합니다 (예: 'RESERVED', 'CANCELLED', 'COMPLETED').  
  * created\_at (TIMESTAMP): 예약을 등록한 시점입니다.  
* 참조 관계 및 Cascade:  
  * 부모인 users와 meeting\_rooms가 지워지면 데이터 무결성 규칙에 의거하여 예약도 자동으로 지워지도록 ON DELETE CASCADE로 설정되어 있습니다.  
  * 자식 테이블로 이용 실적 로그(usage\_logs), 패널티 이력(penalty\_history), 취소 로그(cancellation\_logs)가 주렁주렁 매달려 있는 트랜잭션 루트 엔티티입니다. 예약이라는 부모 데이터 원본이 삭제되는 경우 이 모든 하위 로그 테이블의 레코드들 역시 동반 삭제되는 ON DELETE CASCADE 구조가 설계됩니다.

##### 3-2. usage\_logs (실제 회의실 이용 로그 테이블) {#3-2.-usage_logs-(실제-회의실-이용-로그-테이블)}

![][image12]

* 설명 및 용도: 예약 건에 대해 사용자가 실제로 입실(Check-In)하고 퇴실(Check-Out)한 타임스탬프 실적을 수집하는 기록 테이블입니다. 노쇼(No-Show)를 판별하는 근거 데이터가 됩니다.  
* 컬럼 명세:  
  * usage\_id (NUMBER, PK): 이용 로그의 고유 식별자입니다.  
  * reservation\_id (NUMBER, FK, UNIQUE): reservations(reservation\_id)를 참조하는 외래키입니다. UNIQUE 제약이 걸려있어 하나의 예약 당 단 하나의 이용 로그만 매핑되는 명확한 1:1 관계를 형성합니다.  
  * check\_in\_time (TIMESTAMP): 실제 입실(체크인) 일시입니다.  
  * check\_out\_time (TIMESTAMP): 실제 퇴실(체크아웃) 일시입니다.  
  * usage\_status (VARCHAR2(20)): 이용 현황 상태 값입니다.  
* 참조 관계 및 Cascade:  
  * 부모 예약 데이터에 완전하게 귀속되는 종속 로그 데이터입니다. 예약(reservations) 레코드가 삭제되면 해당 사용 기록 또한 자동으로 데이터베이스에서 지워지도록 관계 데코레이터 단에서 ON DELETE CASCADE 설정을 보장해야 합니다.

##### 3-3. penalty\_history (패널티 누적 이력 테이블) {#3-3.-penalty_history-(패널티-누적-이력-테이블)}

![][image13]

* 설명 및 용도: 노쇼(No-Show)를 하거나 당일 급작스러운 취소, 회의실 비품 훼손 등 비정상적인 행위가 적발되었을 때 사용자의 예약 건을 기반으로 부과된 제재 및 패널티 부여 히스토리를 추적합니다.  
* 컬럼 명세:  
  * penalty\_history\_id (NUMBER, PK): 패널티 부과 기록 고유 식별자입니다.  
  * reservation\_id (NUMBER, FK): 패널티 발생의 원인이 된 reservations(reservation\_id)를 링크하는 외래키입니다 (1:N 관계).  
  * start\_date (TIMESTAMP): 패널티로 인한 서비스 이용 제한 시작일입니다.  
  * end\_date (TIMESTAMP): 서비스 이용 제한 종료일입니다.  
  * created\_at (TIMESTAMP): 패널티가 전산에 등록된 시점입니다.  
* 참조 관계 및 Cascade:  
  * 해당 패널티의 명확한 원인이 되는 예약 엔티티에 연동되어 있습니다. 부모 예약 데이터 파괴 시 히스토리가 자동으로 제거되는 ON DELETE CASCADE 구조를 사용합니다.

##### 3-4. cancellation\_logs (예약 취소 로그 테이블) {#3-4.-cancellation_logs-(예약-취소-로그-테이블)}

![][image14]

* 설명 및 용도: 정상적으로 예약된 건이 취소되었을 때, 언제 취소되었고 취소 사유가 무엇인지 기재하는 사후 감사(Audit)용 로그 데이터베이스입니다.  
* 컬럼 명세:  
  * cancellation\_id (NUMBER, PK): 취소 기록 고유 식별자입니다.  
  * reservation\_id (NUMBER, FK): 취소 대상이 된 reservations(reservation\_id) 외래키입니다.  
  * cancelled\_at (TIMESTAMP): 실제로 취소 버튼을 누른 일시입니다.  
  * cancel\_reason (VARCHAR2(255)): 사용자가 직접 작성한 취소 사유입니다.  
  * is\_late\_cancel (NUMBER(1)): 예약 직전에 취소했는지 여부를 알려주는 긴급 취소 여부 플래그입니다 (1 또는 0). 패널티 정책과 연동되는 트리거 필드입니다.  
* 참조 관계 및 Cascade:  
  * 예약의 상태가 취소로 변경되는 시점에 인스턴스가 생성되며, 부모인 예약 데이터 소멸 시 일괄 정리 대상이 되므로 ON DELETE CASCADE가 명시적으로 적용됩니다.

#### 4\. QnA System (고객 지원 및 소통 도메인) {#4.-qna-system-(고객-지원-및-소통-도메인)}

##### 4-1. questions (사용자 질문 테이블) {#4-1.-questions-(사용자-질문-테이블)}

![][image15]

* 설명 및 용도: 회의실 사용과 관련된 불편 사항이나 시스템 장애 문의를 일반 사용자가 관리자에게 질문하는 마스터 게시판 테이블입니다.  
* 컬럼 명세:  
  * question\_id (NUMBER, PK): 질문 고유 식별자입니다.  
  * user\_id (NUMBER, FK): users(user\_id)를 지탱하는 외래키로, 질문 작성자입니다.  
  * title (VARCHAR2(200)): 질문의 제목입니다.  
  * content (CLOB): 텍스트의 양에 제한이 없는 대용량 본문 데이터 필드입니다.  
  * question\_status (VARCHAR2(20)): 현재 처리 상태입니다 (예: 'PENDING', 'ANSWERED').  
  * created\_at (TIMESTAMP): 질문 등록 시간입니다.  
* 참조 관계 및 Cascade:  
  * 부모인 작성자(users)가 서비스에서 탈퇴하면 질문 데이터도 데이터 무결성을 파괴하지 않도록 ON DELETE CASCADE 옵션을 통해 연쇄 삭제되도록 처리합니다.  
  * 또한 하위의 매핑 인덱스(qna\_mappings) 테이블에 대한 부모 역할을 하므로, 질문이 삭제될 경우 매핑 레코드가 우선 파괴되는 CASCADE 고리를 가집니다.

##### 4-2. answers (관리자 답변 테이블) {#4-2.-answers-(관리자-답변-테이블)}

![][image16]

* 설명 및 용도: 등록된 질문(questions)에 대하여 전담 관리자가 피드백 및 조치 내용을 작성하는 답변 데이터베이스입니다.  
* 컬럼 명세:  
  * answer\_id (NUMBER, PK): 답변의 고유 식별자입니다.  
  * admin\_id (NUMBER, FK): admins(admin\_id)를 바라보는 외래키로, 답변을 작성해 준 관리자를 뜻합니다.  
  * content (CLOB): 상세 조치 내용이 기재된 대용량 본문 필드입니다.  
  * created\_at (TIMESTAMP): 답변 등록 시간입니다.  
* 참조 관계 및 Cascade:  
  * 답변을 작성한 관리자 엔티티가 소멸하더라도 사용자가 올린 질문에 대한 조치 이력 자체는 시스템에 보존되어야 유익하므로, admin\_id 관계는 완전히 터뜨리기 보다는 ON DELETE SET NULL을 고려하거나 비즈니스 요구사항에 따라 CASCADE를 적용하게 됩니다.

##### 4-3. qna\_mappings (질문-답변 연계 매핑 테이블) {#4-3.-qna_mappings-(질문-답변-연계-매핑-테이블)}

![][image17]

* 설명 및 용도: 질문 테이블과 답변 테이블을 논리적/물리적으로 엮어주는 징검다리 인덱스 테이블입니다. 하나의 질문에는 단 하나의 답변만 연결되도록 제약합니다.  
* 컬럼 명세:  
  * mapping\_id (NUMBER, PK): 매핑 데이터 고유 식별자입니다.  
  * question\_id (NUMBER, FK, UNIQUE): questions(question\_id) 외래키이며 UNIQUE 제약으로 1:1 결합됩니다.  
  * answer\_id (NUMBER, FK, UNIQUE): answers(answer\_id) 외래키이며 역시 UNIQUE 제약으로 1:1 결합됩니다.  
  * created\_at (TIMESTAMP): 매핑 링크 생성 시간입니다.  
* 참조 관계 및 Cascade:  
  * 질문(questions) 또는 답변(answers)이 시스템에서 삭제되면, 관계를 이어주던 이 매핑 인덱스 데이터 역시 아무 쓸모가 없어집니다. 따라서 두 개 부모 테이블 중 어느 하나라도 삭제가 발생하면 연쇄적으로 이 레코드가 파괴되도록 데이터베이스 관계 구조상 ON DELETE CASCADE 옵션을 필히 주입해야 합니다.

#### 5\. Maintenance & Policy (백오피스 지원 도메인) {#5.-maintenance-&-policy-(백오피스-지원-도메인)}

##### 5-1. room\_maintenance\_logs (회의실 정비 및 유지보수 로그 테이블) {#5-1.-room_maintenance_logs-(회의실-정비-및-유지보수-로그-테이블)}

![][image18]

* 설명 및 용도: 회의실 자산의 시설 노후화 수리, 청소, 장비 고장 조치 등으로 인해 특정 회의실 공간이 정비 상태에 돌입했을 때, 기간과 액션 내용을 투명하게 관리자가 추적/기록하는 감사 기록입니다.  
* 컬럼 명세:  
  * maintenance\_id (NUMBER, PK): 유지보수 기록의 고유 식별자입니다.  
  * room\_id (NUMBER, FK): meeting\_rooms(room\_id) 외래키로, 정비 대상 공간입니다.  
  * admin\_id (NUMBER, FK): admins(admin\_id) 외래키로, 정비를 지시하거나 처리한 담당자입니다.  
  * maintenance\_type (VARCHAR2(50)): 정비 유형입니다 (예: '정기 청소', '프로젝터 교체').  
  * maintenance\_status (VARCHAR2(20)): 정비 진행도입니다 (예: '진행중', '완료').  
* 참조 관계 및 Cascade:  
  * 회의실(meeting\_rooms) 자산 자체가 소멸하여 사라질 경우에는 자산 히스토리 정보도 무의미하므로 ON DELETE CASCADE 처리됩니다. 단, 담당 관리자(admins)가 삭제되는 경우에는 정비 일지가 그대로 남아있어야 하므로 admin\_id 관계에 한해서는 ON DELETE SET NULL 전략을 유도하는 것이 정석입니다.

##### 5-2. penalty\_policies (서비스 패널티 정책 마스터 테이블) {#5-2.-penalty_policies-(서비스-패널티-정책-마스터-테이블)}

![][image19]

* 설명 및 용도: 어떠한 위반 규칙을 저질렀을 때 며칠 동안 회의실 예약 권한을 박탈 및 중지할 것인지에 대한 전사 공통 규칙(Rule)을 보관하는 독립 정책 마스터 테이블입니다.  
* 컬럼 명세:  
  * penalty\_policy\_id (NUMBER, PK): 정책 고유 식별자 일련번호입니다.  
  * penalty\_type (VARCHAR2(50)): 규정 위반 유형 명칭입니다 (예: '당일 긴급 취소', '노쇼').  
  * penalty\_reason (VARCHAR2(255)): 세부 제재 규칙 설명글입니다.  
  * restriction\_days (NUMBER): 패널티 적용 시 자동 박탈될 예약 정지 일수(정수형)입니다.  
  * created\_at (TIMESTAMP): 해당 정책 규정이 생성된 시간입니다.  
* 참조 관계 및 Cascade:  
  * 외래키(FK)를 전혀 갖지 않는 완벽하게 독립적인 공통 코드성 마스터 테이블입니다. 타 테이블의 삭제 연쇄 작업(CASCADE)에 아무런 영향을 받지 않으며, 비즈니스 요건에 맞춰 상위 관리자 서비스가 CRUD 형태로 유연하게 데이터를 통제합니다.