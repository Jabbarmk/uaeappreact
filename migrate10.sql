-- migrate10.sql — Universities & Courses education module
--  • institution_types / course_categories / study_levels (dashboard-editable, icons)
--  • university_profiles (per Universities-category business: institution type + extras)
--  • courses (individual listings under a university, by course category + study level)
--  • seed: 3 taxonomies + 2 demo universities (as businesses) + ~15 courses
-- Contains emoji — SET NAMES utf8mb4 handles it. Idempotent (safe to re-run).

SET NAMES utf8mb4;

-- ── Taxonomy tables ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `institution_types` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_institution_type` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `course_categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_course_category` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `study_levels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_study_level` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── University profile (extends a Universities-category business) ────────────────
CREATE TABLE IF NOT EXISTS `university_profiles` (
  `business_id` INT(11) NOT NULL,
  `institution_type_id` INT(11) DEFAULT NULL,
  `ranking` VARCHAR(120) DEFAULT NULL,
  `campus_size` VARCHAR(60) DEFAULT NULL,
  `established_year` INT(11) DEFAULT NULL,
  PRIMARY KEY (`business_id`),
  KEY `institution_type_id` (`institution_type_id`),
  CONSTRAINT `university_profiles_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Courses ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `course_category_id` INT(11) DEFAULT NULL,
  `study_level_id` INT(11) DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `specialisation` VARCHAR(150) DEFAULT NULL,
  `duration` VARCHAR(50) DEFAULT NULL,
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
  KEY `course_category_id` (`course_category_id`),
  KEY `study_level_id` (`study_level_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`course_category_id`) REFERENCES `course_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `courses_ibfk_3` FOREIGN KEY (`study_level_id`) REFERENCES `study_levels` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed taxonomies (idempotent) ────────────────────────────────────────────────
INSERT IGNORE INTO institution_types (name, icon, sort_order) VALUES
('Universities','🎓',1),
('Colleges','🏛️',2),
('International University Campuses','🌍',3),
('Online Universities','💻',4),
('Research Institutions','🔬',5),
('Vocational Colleges','🛠️',6);

INSERT IGNORE INTO course_categories (name, icon, sort_order) VALUES
('Business & Management','💼',1),
('Computer Science & IT','💻',2),
('Artificial Intelligence & Data Science','🤖',3),
('Engineering','⚙️',4),
('Architecture & Interior Design','🏗️',5),
('Medicine & Healthcare','🩺',6),
('Law','⚖️',7),
('Accounting & Finance','📊',8),
('Marketing & Communication','📣',9),
('Arts, Design & Multimedia','🎨',10),
('Psychology','🧠',11),
('Education & Teaching','🧑‍🏫',12),
('Aviation & Aerospace','✈️',13),
('Hospitality & Tourism','🏨',14),
('Environmental Science','🌱',15),
('Science & Research','🔬',16);

INSERT IGNORE INTO study_levels (name, icon, sort_order) VALUES
('Diploma','📜',1),
('Bachelor''s Degree','🎓',2),
('Master''s Degree','🎓',3),
('Doctorate/PhD','🏅',4),
('Professional Certification','📄',5),
('Short Courses','⏱️',6),
('Online and Distance Learning','💻',7);

-- ── Seed demo universities (as businesses) — idempotent ─────────────────────────
DELETE FROM businesses WHERE name IN ('Gulf International University','Emirates University of Technology');
SET @cat_uni := (SELECT id FROM business_categories WHERE name='Universities' LIMIT 1);

INSERT INTO businesses (name, category_id, logo, image, tagline, about, description, emirate, address, phone, whatsapp, email, website, rating, established_year, status, is_active)
VALUES ('Gulf International University', @cat_uni, 'uni-1-logo.svg', 'uni-1-banner.svg', 'Shaping future leaders since 1998',
'Gulf International University is a leading private university in Dubai offering accredited undergraduate and postgraduate programmes across business, technology and engineering.',
'A leading private university in Dubai with accredited programmes across business, technology and engineering.',
'Dubai','Academic City, Dubai','+97144005000','971544005000','admissions@giu.ac.ae','https://giu.example.ae',4.6,1998,'approved',1);
SET @uni1 := LAST_INSERT_ID();
INSERT INTO university_profiles (business_id, institution_type_id, ranking, campus_size, established_year)
VALUES (@uni1, (SELECT id FROM institution_types WHERE name='Universities'), 'Top 50 in the GCC', '120 acres', 1998);

INSERT INTO businesses (name, category_id, logo, image, tagline, about, description, emirate, address, phone, whatsapp, email, website, rating, established_year, status, is_active)
VALUES ('Emirates University of Technology', @cat_uni, 'uni-2-logo.svg', 'uni-2-banner.svg', 'Innovate. Research. Lead.',
'Emirates University of Technology is a research-driven institution in Abu Dhabi specialising in computing, artificial intelligence, healthcare and applied sciences.',
'A research-driven institution in Abu Dhabi specialising in computing, AI, healthcare and applied sciences.',
'Abu Dhabi','Masdar City, Abu Dhabi','+97120117000','971521170000','info@eut.ac.ae','https://eut.example.ae',4.8,2006,'approved',1);
SET @uni2 := LAST_INSERT_ID();
INSERT INTO university_profiles (business_id, institution_type_id, ranking, campus_size, established_year)
VALUES (@uni2, (SELECT id FROM institution_types WHERE name='Research Institutions'), 'Top 10 for Research in UAE', '85 acres', 2006);

-- ── Seed courses (~15) ──────────────────────────────────────────────────────────
INSERT INTO courses (business_id, course_category_id, study_level_id, name, specialisation, duration, total_fee, fee_per_year, currency, study_mode, delivery, location, emirate, intake, eligibility, application_deadline, accreditation, scholarships, is_featured, is_active) VALUES
-- Diploma
(@uni1,(SELECT id FROM course_categories WHERE name='Business & Management'),(SELECT id FROM study_levels WHERE name='Diploma'),'Diploma in Business Administration','Management','1–2 years',45000,22500,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Available',1,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Computer Science & IT'),(SELECT id FROM study_levels WHERE name='Diploma'),'Diploma in Information Technology','Networking','1–2 years',48000,24000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Not Available',0,1),
(@uni1,(SELECT id FROM course_categories WHERE name='Arts, Design & Multimedia'),(SELECT id FROM study_levels WHERE name='Diploma'),'Diploma in Graphic Design','Digital Media','1 year',38000,38000,'AED','Full-time','On campus','Academic City','Dubai','January 2027','Grade 12 or equivalent','2026-11-30','Ministry of Education, UAE','Available',0,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Hospitality & Tourism'),(SELECT id FROM study_levels WHERE name='Diploma'),'Diploma in Hospitality Management','Hotel Operations','2 years',52000,26000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 or equivalent','2026-08-15','Ministry of Education, UAE','Available',0,1),
-- Bachelor's Degree
(@uni1,(SELECT id FROM course_categories WHERE name='Business & Management'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'Bachelor of Business Administration','Marketing','3–4 years',120000,30000,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Computer Science & IT'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'BSc Computer Science','Software Engineering','4 years',140000,35000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Artificial Intelligence & Data Science'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'BSc Artificial Intelligence','Machine Learning','4 years',150000,37500,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',1,1),
(@uni1,(SELECT id FROM course_categories WHERE name='Engineering'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'BEng Civil Engineering','Structural','4 years',145000,36250,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Not Available',0,1),
(@uni1,(SELECT id FROM course_categories WHERE name='Architecture & Interior Design'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'Bachelor of Architecture','Sustainable Design','5 years',175000,35000,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Grade 12 or equivalent','2026-06-30','Ministry of Education, UAE','Available',0,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Medicine & Healthcare'),(SELECT id FROM study_levels WHERE name='Bachelor''s Degree'),'BSc Nursing','Clinical Practice','4 years',130000,32500,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Grade 12 (Science) or equivalent','2026-06-30','Ministry of Education, UAE','Available',0,1),
-- Master's Degree
(@uni1,(SELECT id FROM course_categories WHERE name='Business & Management'),(SELECT id FROM study_levels WHERE name='Master''s Degree'),'Master of Business Administration (MBA)','Strategy & Leadership','1–2 years',85000,42500,'AED','Part-time','Hybrid','Academic City','Dubai','September 2026 / January 2027','Bachelor''s degree with 2:2 or above','2026-07-31','Ministry of Education, UAE','Available',1,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Artificial Intelligence & Data Science'),(SELECT id FROM study_levels WHERE name='Master''s Degree'),'MSc Data Science','Big Data Analytics','1–2 years',90000,45000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Bachelor''s in a numerate discipline','2026-07-31','Ministry of Education, UAE','Available',1,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Computer Science & IT'),(SELECT id FROM study_levels WHERE name='Master''s Degree'),'MSc Cybersecurity','Network Security','1–2 years',92000,46000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','January 2027','Bachelor''s in Computer Science or related','2026-11-30','Ministry of Education, UAE','Not Available',0,1),
-- Doctorate / PhD
(@uni1,(SELECT id FROM course_categories WHERE name='Business & Management'),(SELECT id FROM study_levels WHERE name='Doctorate/PhD'),'PhD in Business Management','Organisational Behaviour','3–5 years',150000,30000,'AED','Full-time','On campus','Academic City','Dubai','September 2026','Master''s degree with research proposal','2026-05-31','Ministry of Education, UAE','Available',0,1),
(@uni2,(SELECT id FROM course_categories WHERE name='Computer Science & IT'),(SELECT id FROM study_levels WHERE name='Doctorate/PhD'),'PhD in Computer Science','Applied AI','3–5 years',160000,32000,'AED','Full-time','On campus','Masdar City','Abu Dhabi','September 2026','Master''s degree with research proposal','2026-05-31','Ministry of Education, UAE','Available',0,1);
