-- server_catchup_22to29.sql — SMARTUAE production catch-up
-- For a live DB where server_update_25to29.sql failed at line 34:
--   • migrate25 (businesses featured/sort_order/lat/lng) ALREADY applied by that run — skipped here
--   • migrations 22–24 were never applied on the server — included here
--   • migrations 26–29 never ran (aborted) — included here
-- Run ONCE:  mysql -u <user> -p <db> < server_catchup_22to29.sql
SET NAMES utf8mb4;

-- ── migrate22: category banners table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `category_banners` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) NOT NULL,
  `business_id` INT(11) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `video` VARCHAR(500) DEFAULT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `subtitle` VARCHAR(300) DEFAULT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- (business_id from migrate23 and video from migrate26 are folded into the CREATE)

-- ── migrate24: offer/event image galleries ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `offer_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `offer_id` INT(11) NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── migrate27 + 28: detail-page section toggles ───────────────────────────────
ALTER TABLE businesses
  ADD COLUMN show_stats TINYINT(1) NOT NULL DEFAULT 1 AFTER employees,
  ADD COLUMN show_clients TINYINT(1) NOT NULL DEFAULT 1 AFTER show_stats;

-- ── migrate29: template2 only + managed product categories ───────────────────
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
