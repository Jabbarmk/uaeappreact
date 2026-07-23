-- migrate12.sql — Course image (catalog course gets an optional image)
-- Run ONCE, after migrate11. (ALTER ADD COLUMN is not idempotent.)
-- If a course has no image, the app shows a common course icon instead.

SET NAMES utf8mb4;

ALTER TABLE `courses` ADD COLUMN `image` VARCHAR(500) DEFAULT NULL;

-- Assign a themed placeholder to seeded courses by category (others stay NULL -> icon).
UPDATE `courses` c JOIN `course_categories` cc ON cc.id = c.course_category_id
SET c.image = CASE cc.name
  WHEN 'Business & Management' THEN 'course-business.svg'
  WHEN 'Computer Science & IT' THEN 'course-cs.svg'
  WHEN 'Artificial Intelligence & Data Science' THEN 'course-ai.svg'
  WHEN 'Engineering' THEN 'course-engineering.svg'
  WHEN 'Architecture & Interior Design' THEN 'course-architecture.svg'
  WHEN 'Medicine & Healthcare' THEN 'course-medicine.svg'
  WHEN 'Arts, Design & Multimedia' THEN 'course-arts.svg'
  WHEN 'Hospitality & Tourism' THEN 'course-hospitality.svg'
  ELSE c.image END;
