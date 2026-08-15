-- Migration 31: emirate + coordinates on Best-in-UAE collection items
-- (used for emirate filter and Near Me on the collection page; linked
--  businesses supply these automatically via read-time fallback)

ALTER TABLE home_collection_items
  ADD COLUMN emirate VARCHAR(50) NULL AFTER business_id,
  ADD COLUMN latitude DECIMAL(10,7) NULL AFTER emirate,
  ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude;
