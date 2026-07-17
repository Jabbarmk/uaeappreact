-- migrate3.sql — user-requested business categories
-- MySQL 5.7 compatible. Run once on a fresh DB.

-- Free-text category requested by the user when no existing category fits.
ALTER TABLE businesses
  ADD COLUMN requested_category_name VARCHAR(100) NULL AFTER category_id;

-- Seed a permanent "Other" category that holds businesses with an unresolved
-- category request until an admin assigns/creates a real one. Idempotent.
INSERT INTO business_categories (name, group_name, icon, sort_order, is_active)
SELECT 'Other', 'Other', '📦', 999, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM business_categories WHERE name = 'Other');
