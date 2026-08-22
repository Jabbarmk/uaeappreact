-- Migration 38: business search keywords (comma separated)
ALTER TABLE businesses ADD COLUMN keywords VARCHAR(1000) NULL AFTER description;
