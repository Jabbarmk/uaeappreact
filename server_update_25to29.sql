-- server_update_25to29.sql — SMARTUAE production DB update
-- Consolidates migrate25 … migrate29 (Aug 2026):
--   25: businesses featured/sort_order/latitude/longitude
--   26: category_banners video
--   27: businesses show_stats
--   28: businesses show_clients
--   29: template2 default + business_product_categories
-- MySQL 5.7 / MariaDB compatible: plain ALTER — run ONCE against the production DB:
--   mysql -u <user> -p <db> < server_update_25to29.sql

SET NAMES utf8mb4;

-- ── migrate25: businesses listing/near-me columns ─────────────────────────────
ALTER TABLE businesses
  ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0 AFTER rating,
  ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER featured,
  ADD COLUMN latitude DECIMAL(10,7) NULL AFTER sort_order,
  ADD COLUMN longitude DECIMAL(11,7) NULL AFTER latitude;

-- Backfill coordinates from Google Maps embed URLs (pattern ...!2d<lng>!3d<lat>!...)
UPDATE businesses
SET longitude = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '!2d', 2), '!2d', -1), '!', 1) AS DECIMAL(11,7)),
    latitude  = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(map_embed, '!3d', 2), '!3d', -1), '!', 1) AS DECIMAL(10,7))
WHERE map_embed LIKE '%!2d%' AND map_embed LIKE '%!3d%'
  AND latitude IS NULL AND longitude IS NULL;

UPDATE businesses
SET latitude = NULL, longitude = NULL
WHERE (latitude = 0 AND longitude = 0)
   OR latitude NOT BETWEEN -90 AND 90
   OR longitude NOT BETWEEN -180 AND 180;

-- ── migrate26: category banner video ─────────────────────────────────────────
ALTER TABLE category_banners
  ADD COLUMN video VARCHAR(500) NULL AFTER image;

-- ── migrate27: stats row toggle ───────────────────────────────────────────────
ALTER TABLE businesses
  ADD COLUMN show_stats TINYINT(1) NOT NULL DEFAULT 1 AFTER employees;

-- ── migrate28: clients & partners toggle ──────────────────────────────────────
ALTER TABLE businesses
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

-- ── site settings used by the new Layout Sizes panel (blank = code defaults) ──
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('home_slider_height', '650'),
  ('biz_featured_img_height', ''),
  ('biz_row_img_height', ''),
  ('biz_client_logo_size', '')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
