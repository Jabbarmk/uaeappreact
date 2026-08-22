-- Migration 36: per-business Clients & Partners size preset (small | medium)
ALTER TABLE businesses ADD COLUMN clients_size VARCHAR(10) NULL AFTER sections_config;
