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
