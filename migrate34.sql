-- Migration 34: per-business detail-page section layout (show/hide + order)
-- NULL = default layout. JSON: [{"key":"header","on":1,"order":1}, ...]
ALTER TABLE businesses ADD COLUMN sections_config TEXT NULL AFTER color;
