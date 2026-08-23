-- Migration 41: Welcome screen (splash) — full-image slider before the home page
-- Slides are image-only; slide behavior (timer, radius, padding, transition style)
-- lives in site_settings key 'welcome_screen' as JSON, admin-editable.

CREATE TABLE IF NOT EXISTS welcome_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO site_settings (setting_key, setting_value)
SELECT 'welcome_screen', '{"timer":4,"radius":24,"padding":16,"style":"fade"}'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'welcome_screen');
