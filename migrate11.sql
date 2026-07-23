-- migrate11.sql — Courses restructure: catalog + per-university offerings
--  • courses  -> reusable CATALOG (category, name, study level, duration, specialisation, description)
--  • university_courses -> a university offering a catalog course with its OWN editable
--    fee & details (each college can price/configure the same course differently)
-- Run ONCE, AFTER migrate10.sql. Not idempotent (it drops columns from `courses`).

SET NAMES utf8mb4;

-- 1) Per-university offerings (junction with per-university fields)
CREATE TABLE IF NOT EXISTS `university_courses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `course_id` INT(11) NOT NULL,
  `total_fee` DECIMAL(12,2) DEFAULT NULL,
  `fee_per_year` DECIMAL(12,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `study_mode` VARCHAR(30) DEFAULT NULL,
  `delivery` VARCHAR(30) DEFAULT NULL,
  `location` VARCHAR(120) DEFAULT NULL,
  `emirate` VARCHAR(50) DEFAULT NULL,
  `intake` VARCHAR(100) DEFAULT NULL,
  `eligibility` VARCHAR(255) DEFAULT NULL,
  `application_deadline` DATE DEFAULT NULL,
  `accreditation` VARCHAR(150) DEFAULT NULL,
  `scholarships` VARCHAR(30) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `university_courses_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `university_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Move existing course rows into offerings (each seeded course becomes one offering)
INSERT INTO `university_courses`
  (business_id, course_id, total_fee, fee_per_year, currency, study_mode, delivery, location, emirate,
   intake, eligibility, application_deadline, accreditation, scholarships, is_featured, is_active)
SELECT business_id, id, total_fee, fee_per_year, currency, study_mode, delivery, location, emirate,
       intake, eligibility, application_deadline, accreditation, scholarships, is_featured, is_active
FROM `courses`
WHERE business_id IS NOT NULL;

-- 3) Reduce `courses` to a catalog (drop per-university columns; add description)
ALTER TABLE `courses` DROP FOREIGN KEY `courses_ibfk_1`;
ALTER TABLE `courses`
  DROP COLUMN `business_id`,
  DROP COLUMN `total_fee`,
  DROP COLUMN `fee_per_year`,
  DROP COLUMN `currency`,
  DROP COLUMN `study_mode`,
  DROP COLUMN `delivery`,
  DROP COLUMN `location`,
  DROP COLUMN `emirate`,
  DROP COLUMN `intake`,
  DROP COLUMN `eligibility`,
  DROP COLUMN `application_deadline`,
  DROP COLUMN `accreditation`,
  DROP COLUMN `scholarships`,
  DROP COLUMN `is_featured`;
ALTER TABLE `courses` ADD COLUMN `description` TEXT DEFAULT NULL;
