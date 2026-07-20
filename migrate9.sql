-- migrate9.sql — Add "Doctors & Specialists" main category + sub-categories
-- Same pattern as migrate8. Contains emoji — SET NAMES utf8mb4 handles it, so a
-- plain `mysql <db> < migrate9.sql` imports correctly. Idempotent (safe to re-run).

SET NAMES utf8mb4;

-- Remove any prior run of this category (keeps re-runs clean).
DELETE bc FROM business_categories bc
  JOIN main_categories mc ON bc.main_category_id = mc.id
  WHERE mc.name = 'Doctors & Specialists';
DELETE FROM main_categories WHERE name = 'Doctors & Specialists';

-- Main category (appended after the existing 20).
INSERT INTO main_categories (name, icon, sort_order, is_active)
VALUES ('Doctors & Specialists', '👨‍⚕️', 21, 1);

-- Sub-categories under it.
SET @m := (SELECT id FROM main_categories WHERE name = 'Doctors & Specialists');
INSERT INTO business_categories (name, icon, group_name, main_category_id, sort_order, is_active) VALUES
('General Physicians','🩺','Doctors & Specialists',@m,1,1),
('Pediatricians','🧒','Doctors & Specialists',@m,2,1),
('Cardiologists','❤️','Doctors & Specialists',@m,3,1),
('Orthopaedic Doctors','🦴','Doctors & Specialists',@m,4,1),
('Neurologists','🧠','Doctors & Specialists',@m,5,1),
('Ophthalmologists','👁️','Doctors & Specialists',@m,6,1),
('ENT Specialists','👂','Doctors & Specialists',@m,7,1),
('Dentists','🦷','Doctors & Specialists',@m,8,1),
('Dermatologists','🧴','Doctors & Specialists',@m,9,1),
('Gynaecologists','🤰','Doctors & Specialists',@m,10,1),
('Pulmonologists','🫁','Doctors & Specialists',@m,11,1),
('Gastroenterologists','🍽️','Doctors & Specialists',@m,12,1),
('Endocrinologists','🩸','Doctors & Specialists',@m,13,1),
('Psychiatrists','🧠','Doctors & Specialists',@m,14,1),
('Psychologists','🧑‍⚕️','Doctors & Specialists',@m,15,1),
('Radiologists','🩻','Doctors & Specialists',@m,16,1),
('Pathologists','🔬','Doctors & Specialists',@m,17,1),
('Dietitians & Nutritionists','🥗','Doctors & Specialists',@m,18,1),
('Physiotherapists','🏃','Doctors & Specialists',@m,19,1),
('Online Doctor Consultations','💻','Doctors & Specialists',@m,20,1);
