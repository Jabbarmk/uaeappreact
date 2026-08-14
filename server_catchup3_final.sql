-- server_catchup3_final.sql — SMARTUAE production catch-up, final step
-- Fixes the utf8mb4_0900_ai_ci vs utf8mb4_unicode_ci collation mismatch (MySQL 8
-- default vs our tables) and finishes the last two statements of catchup2.
-- Run ONCE:  mysql -u <user> -p <db> < server_catchup3_final.sql
SET NAMES utf8mb4;

-- Align the new table's collation with the rest of the schema
ALTER TABLE business_product_categories
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed managed categories from any categories already on products
INSERT INTO business_product_categories (business_id, name)
SELECT DISTINCT bp.business_id, bp.category
FROM business_products bp
WHERE bp.category IS NOT NULL AND bp.category <> ''
  AND NOT EXISTS (
    SELECT 1 FROM business_product_categories c
    WHERE c.business_id = bp.business_id AND c.name = bp.category
  );

-- Layout Sizes settings keys (blank = code defaults)
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('home_slider_height', '650'),
  ('biz_featured_img_height', ''),
  ('biz_row_img_height', ''),
  ('biz_client_logo_size', '')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- ── Verification (prints results; all should return rows / OK counts) ────────
SELECT 'businesses columns' AS checkpoint, COUNT(*) AS found_expect_9
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'businesses'
  AND column_name IN ('featured','sort_order','latitude','longitude','show_stats',
                      'show_clients','template','is_online_store','store_url');

SELECT 'new tables' AS checkpoint, COUNT(*) AS found_expect_6
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('category_banners','offer_images','event_images',
                     'business_service_sections','business_products',
                     'business_cover_media');

SELECT 'settings keys' AS checkpoint, COUNT(*) AS found_expect_4
FROM site_settings
WHERE setting_key IN ('home_slider_height','biz_featured_img_height',
                      'biz_row_img_height','biz_client_logo_size');
