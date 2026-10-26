-- ============================================================================
-- LMS Database Schema: cloudcomputinglms
-- Target Database: MySQL 8.0+ / MariaDB 10.5+
-- Features: User Roles, Sequential Unlocking, 20-Item Quizzes, Gradebook Views
-- Seeders: NONE
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `cloudcomputinglms`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `cloudcomputinglms`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table (Student and Faculty roles)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `surname` VARCHAR(50) NOT NULL,
  `role` ENUM('student', 'faculty') NOT NULL DEFAULT 'student',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_username` (`username`),
  KEY `idx_users_surname_firstname` (`surname`, `first_name`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Courses Table (Holds metadata e.g. ITEP413-T, Cloud Computing)
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `term` VARCHAR(20) NOT NULL,
  `year_level` VARCHAR(20) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `uk_courses_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Chapters Table (Modules, Topics, Insights Text, Slide/Presentation URLs)
DROP TABLE IF EXISTS `chapters`;
CREATE TABLE `chapters` (
  `chapter_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` BIGINT UNSIGNED NOT NULL,
  `chapter_number` INT UNSIGNED NOT NULL,
  `module_title` VARCHAR(100) NOT NULL,
  `chapter_title` VARCHAR(150) NOT NULL,
  `summary_text` LONGTEXT NULL,
  `presentation_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`chapter_id`),
  UNIQUE KEY `uk_course_chapter_number` (`course_id`, `chapter_number`),
  CONSTRAINT `fk_chapters_course` 
    FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Quizzes Table (20 items, 10 min time limit, 75% passing mark)
DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `quiz_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chapter_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `time_limit_minutes` INT UNSIGNED NOT NULL DEFAULT 10,
  `passing_percentage` DECIMAL(5,2) NOT NULL DEFAULT 75.00,
  `total_questions` INT UNSIGNED NOT NULL DEFAULT 20,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quiz_id`),
  UNIQUE KEY `uk_quizzes_chapter` (`chapter_id`),
  CONSTRAINT `fk_quizzes_chapter` 
    FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Quiz Questions Table (Multiple-choice item bank)
DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE `quiz_questions` (
  `question_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id` BIGINT UNSIGNED NOT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` TEXT NOT NULL,
  `option_b` TEXT NOT NULL,
  `option_c` TEXT NOT NULL,
  `option_d` TEXT NOT NULL,
  `correct_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`),
  KEY `idx_quiz_questions_quiz` (`quiz_id`),
  CONSTRAINT `fk_questions_quiz` 
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Student Progress Table (Sequential Unlocking Control)
DROP TABLE IF EXISTS `student_progress`;
CREATE TABLE `student_progress` (
  `progress_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `chapter_id` BIGINT UNSIGNED NOT NULL,
  `is_unlocked` TINYINT(1) NOT NULL DEFAULT 0,
  `is_completed` TINYINT(1) NOT NULL DEFAULT 0,
  `highest_score` DECIMAL(5,2) DEFAULT 0.00,
  `unlocked_at` TIMESTAMP NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `uk_student_chapter` (`student_id`, `chapter_id`),
  KEY `idx_progress_unlocked` (`student_id`, `is_unlocked`),
  CONSTRAINT `fk_progress_student` 
    FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_progress_chapter` 
    FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Quiz Attempts Table (Logs attempts, scores, and pass/fail states)
DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE `quiz_attempts` (
  `attempt_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id` BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `score` INT UNSIGNED NOT NULL,
  `total_questions` INT UNSIGNED NOT NULL DEFAULT 20,
  `percentage` DECIMAL(5,2) NOT NULL,
  `passed` TINYINT(1) NOT NULL,
  `time_taken_seconds` INT UNSIGNED NULL,
  `attempted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attempt_id`),
  KEY `idx_attempts_quiz_student` (`quiz_id`, `student_id`),
  KEY `idx_attempts_student_score` (`student_id`, `score`),
  CONSTRAINT `fk_attempts_quiz` 
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attempts_student` 
    FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Quiz Attempt Answers Table (Auditing selected options)
DROP TABLE IF EXISTS `quiz_attempt_answers`;
CREATE TABLE `quiz_attempt_answers` (
  `answer_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `attempt_id` BIGINT UNSIGNED NOT NULL,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `selected_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
  `is_correct` TINYINT(1) NOT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `idx_attempt_answers_attempt` (`attempt_id`),
  CONSTRAINT `fk_answers_attempt` 
    FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`attempt_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_answers_question` 
    FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`question_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Analytical Gradebook Views
CREATE OR REPLACE VIEW `v_topic_gradebook` AS
SELECT 
  c.course_id,
  ch.chapter_id,
  ch.chapter_number,
  ch.chapter_title,
  u.user_id AS student_id,
  u.surname,
  u.first_name,
  CONCAT(u.surname, ', ', u.first_name) AS student_name,
  COALESCE(MAX(qa.score), 0) AS max_score,
  COALESCE(MAX(qa.percentage), 0.00) AS max_percentage,
  MAX(qa.passed) AS has_passed,
  COUNT(qa.attempt_id) AS total_attempts,
  MAX(qa.attempted_at) AS last_attempt_at
FROM users u
CROSS JOIN chapters ch
JOIN courses c ON ch.course_id = c.course_id
LEFT JOIN quizzes q ON ch.chapter_id = q.chapter_id
LEFT JOIN quiz_attempts qa ON q.quiz_id = qa.quiz_id AND u.user_id = qa.student_id
WHERE u.role = 'student'
GROUP BY c.course_id, ch.chapter_id, ch.chapter_number, ch.chapter_title, u.user_id, u.surname, u.first_name;