-- Migration 32: business verified badge + card color
ALTER TABLE businesses
  ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER featured,
  ADD COLUMN color VARCHAR(20) NULL AFTER is_verified;
