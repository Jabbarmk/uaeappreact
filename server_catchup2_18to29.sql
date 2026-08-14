-- server_catchup2_18to29.sql — SMARTUAE production catch-up, part 2
-- Live-DB state this targets: migrations 1–17 applied, plus (from the earlier
-- partial runs): businesses featured/sort_order/latitude/longitude/show_stats/
-- show_clients, category_banners, offer_images, event_images already exist.
-- This file adds what is still missing: migrations 18–21 (schema only, demo
-- seed data omitted) and the remainder of 29.
-- Run ONCE:  mysql -u <user> -p <db> < server_catchup2_18to29.sql
SET NAMES utf8mb4;

-- ── migrate18: named service sections + per-item details ─────────────────────
CREATE TABLE IF NOT EXISTS `business_service_sections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bss_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `business_services` ADD COLUMN `section_id` INT(11) DEFAULT NULL AFTER `business_id`;
ALTER TABLE `business_services` ADD COLUMN `details` TEXT DEFAULT NULL AFTER `description`;
ALTER TABLE `business_services` ADD KEY `section_id` (`section_id`);
ALTER TABLE `business_services` ADD CONSTRAINT `bs_section_fk` FOREIGN KEY (`section_id`) REFERENCES `business_service_sections` (`id`) ON DELETE CASCADE;

-- ── migrate19: detail-page template + online-store products ──────────────────
ALTER TABLE `businesses` ADD COLUMN `template` VARCHAR(20) NOT NULL DEFAULT 'template1';
ALTER TABLE `businesses` ADD COLUMN `is_online_store` TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE `businesses` ADD COLUMN `store_url` VARCHAR(500) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `business_products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(12,2) DEFAULT NULL,
  `original_price` DECIMAL(12,2) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT 'AED',
  `description` TEXT DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bp_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── migrate20: dedicated cover media per business ─────────────────────────────
CREATE TABLE IF NOT EXISTS `business_cover_media` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `business_id` INT(11) NOT NULL,
  `type` ENUM('image','video') NOT NULL DEFAULT 'image',
  `file` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  CONSTRAINT `bcm_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── migrate21: doctor booking schedule ────────────────────────────────────────
ALTER TABLE `doctors` ADD COLUMN `work_days` VARCHAR(20) NOT NULL DEFAULT '1,2,3,4,5';
ALTER TABLE `doctors` ADD COLUMN `slots` VARCHAR(600) NOT NULL DEFAULT '10:00,10:30,11:00,11:30,12:00,14:00,14:30,15:00';

-- ── migrate29 (remainder): template2 default + managed product categories ─────
ALTER TABLE businesses ALTER template SET DEFAULT 'template2';
UPDATE businesses SET template = 'template2';

CREATE TABLE IF NOT EXISTS business_product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(500) NULL,
  icon VARCHAR(50) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bpc_business (business_id)
);

INSERT INTO business_product_categories (business_id, name)
SELECT DISTINCT bp.business_id, bp.category
FROM business_products bp
WHERE bp.category IS NOT NULL AND bp.category <> ''
  AND NOT EXISTS (
    SELECT 1 FROM business_product_categories c
    WHERE c.business_id = bp.business_id AND c.name = bp.category
  );

-- ── Layout Sizes settings keys (blank = code defaults) ───────────────────────
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('home_slider_height', '650'),
  ('biz_featured_img_height', ''),
  ('biz_row_img_height', ''),
  ('biz_client_logo_size', '')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
