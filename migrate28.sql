-- migrate28: per-business toggle for the Clients & Partners section
ALTER TABLE businesses
  ADD COLUMN show_clients TINYINT(1) NOT NULL DEFAULT 1 AFTER show_stats;
