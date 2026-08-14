-- migrate27: per-business toggle for the detail-page stats row
ALTER TABLE businesses
  ADD COLUMN show_stats TINYINT(1) NOT NULL DEFAULT 1 AFTER employees;
